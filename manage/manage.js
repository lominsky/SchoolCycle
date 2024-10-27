//Displays the main screen and hides the login button
function displayMain() {
  // console.log("displayMain()");
  
  let DOMAIN = user.email;
  DOMAIN = DOMAIN.substring(DOMAIN.indexOf("@") + 1);
  $("#pageTitle").text("Manage " + DOMAIN);
  database.ref("/domain/" + safeDomain(DOMAIN)).once("value", (snapshot) => {
    domain = snapshot.val();
    domain.name = DOMAIN;
    if(!Object.values(domain.administrators).includes(user.email)) location.pathname = "/";
    processDomainData();
  }, (error) => {
    // console.log(error);
    if(error.code == "PERMISSION_DENIED") {
      $("#expiredModal").modal("show");
    }
    // console.log(error.code);
    // console.log(error.name);
    // console.log(error.message);
  })
  $("#loginModule").hide();
  $("#loggedInAs").text(user.displayName);
  $("#loggedInAsImage").attr("src", user.photoURL);
  $("#logoutModule").show();
}

//Displays the login button and hides everything else
function displayLogin() {
  $("#loginModule").show();
  $("#logoutModule").hide();
}

//Put the values from the db into the fields
function processDomainData() {
    let expiration = new Date(domain.expiration);
    if(expiration < (new Date())) {
    // console.log("EXPIRED!");
    // $("#authorizeModal").modal('hide');
    $("#expiredModal").modal("show");
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
    }
    return false;
  }
  
  $("#domain-expiration").val(timestampToInputDateString(domain.expiration))
  $("#domain-administrators").val(Object.values(domain.administrators).toString())
  $("#domain-calendar-id").append($("<option selected id='starter-cal-id-option'>").text(domain.cycle_calendar_id))
  updateScheduleDropDown();
}

//Functions to call once GAPI has authorization
function authCallback() {
  getCalendars();
  getEligibleDays();
}

function getCalendars() {
  requestCalendars().then(
    function(value) { 
      for(cal of value) {
        getACL(cal.id, cal.summary)
      }
    },
    function(error) { return error }
  );
}

async function requestCalendars() {
  let response;
  try {
    const request = {
      'minAccessRole': 'writer',
    };
    response = await gapi.client.calendar.calendarList.list(request);
  } catch (err) {
    log("requestCalendars() error", err);
    return false;
  }
  return response.result.items;
}

function getACL(id, name) {
  requestACL(id).then((shares) => { 
      if(shares == false) return false;
      let domainShare = false;
      for(let share of shares) {
        if(share.scope.type == "domain") {
          if(share.role == "reader") {
            domainShare = true;
          } else if (share.role == "writer" || share.role == "owner") {
            return false;
          } 
        } else if(share.scope.type == "default") {
          if(share.role == "reader") {
            domainShare = true;
          } else if (share.role == "writer" || share.role == "owner") {
            return false;
          } 
        }
      }
      if(domainShare) {
        let option = $("<option value=" + id + ">" + name + "</option>")
        if(id == domain.cycle_calendar_id) {
          option.attr("selected", "true");
        }
        $("#domain-calendar-id").append(option)
        $("#domain-calendar-id").removeAttr("disabled")
        $("#starter-cal-id-option").remove()
      }
    }, (error) => { 
      log("getACL() error:", error)
      return error 
    }
  );
}

async function requestACL(id) {
  let response;
  try {
    const request = {
      'calendarId': id,
    };
    response = await gapi.client.calendar.acl.list(request);
  } catch (err) {
    if(err.status != 403){
      log("requestACL() error:", err);
    }
    return false;
  }
  return response.result.items;
}


/* **********************************************************

                  Cycle Day Calendar Tab

 ********************************************************** */


// Enable or disable the save button depending on whether or not the id has changed
function enableSaveButton() {
  let id = $("#domain-calendar-id").find(":selected").val();
  if(id != domain.cycle_calendar_id) {
    $("#domain-calendar-save-button").removeAttr("disabled");
  } else {
    $("#domain-calendar-save-button").attr("disabled", "disabled");
  }
}

// Save the selected calendar as the domain's cycle calendar
function saveCalID() {
  let calId = $("#domain-calendar-id").find(":selected").val();
  database.ref("domain/" + safeDomain(domain.name) + "/cycle_calendar_id/").set(calId)
  .then(() => {
    log("Calendar ID updated to:", calId)
    alert($("#manage-alert-container"), "Calendar ID updated successfully.", "success");
    domain.cycle_calendar_id = calId
    $("#domain-calendar-save-button").attr("disabled", "disabled");
    getEligibleDays();
  })
  .catch((error) => {
    log("Calendar ID failed to update:", error);
    alert($("#manage-alert-container"), "Error: " + error, "warning");
  });
}

//Handle uploading a file
var daysCSV = document.getElementById("daysCSV");
daysCSV.addEventListener('change', (e) => {
  if($("#daysCSV")[0].files[0].type != "text/csv") {
    alert($("#manage-alert-container"), "Please select a CSV file.", "danger");
    daysCSV.value = '';
    return false;
  }
  var file = daysCSV.files[0];
  var reader = new FileReader();
  reader.addEventListener('load', (e) => {
    processDaysCSV(e.target.result);
  });
  reader.readAsText(file);
});

//Process the uploaded file
let newDays = [];
function processDaysCSV(csv) {
  // console.log(csv)
  let start = "Date,Day of Week,Cycle # (e.g. 1 2 3),Cycle Day (e.g. Day 1 Day 2 Day 3)";
  daysCSV.value = '';
  if(csv.substring(0, start.length) != start) {
    alert($("#manage-alert-container"), "Invalid CSV - Make sure you are using the provided template", "danger", 5000);
    return false;
  }
  csv = csv.trim();
  csv = csv.split("\n")
  csv.shift();
  let days = [];
  let counts = {};
  for(let i in csv) {
    let row = csv[i].trim();
    row = row.split(",");
    if(row[3] == "") continue;
    let day = {}
    day.date = new Date(row[0]);
    day.day = row[3];
    if(row[2] != "") {
      if(parseInt[2] == NaN) {
        alert($("#manage-alert-container"), "Invalid CSV - Cycle's can only be integers.", "danger", 5000);
        return false;
      }
      day.cycle = "Cycle " + row[2];
    }
    
    if(counts[day.day] == null) counts[day.day] = 0;
    counts[day.day]++;
    
    days.push(day);
  }
  let first = days[0].date;
  let last = days[0].date;
  for(let day of days) {
    if(day.date < first) first = day.date;
    if(day.date > last) last = day.date;
  }
  
  $("#populateButton").attr("disabled", "disabled");
  $("#dayCount").empty()
  $("#dayList").empty()
  $("#dayCount").text("Your file contains " + days.length + " days starting on " + first.toLocaleDateString() + " and ending on " + last.toLocaleDateString() + ".");
  $("#dayList").text("That includes:");
  $("#addCount").text("Loading data from calendar...");
  counts = Object.entries(counts).sort((a, b) => a[0].substring(4) - b[0].substring(4));
  for(let i of counts)
    $("#dayList").append($("<li>").text(i[0] + " - " + i[1]));
  
  
  newDays = [];
  let today = new Date();
  today = new Date(today.getTime() - 1000*60*60*24);
  
  getCurrentCycleDays().then((response) => {
    let existingDays = response.result.items;
    let passedDays = 0;
    let existingCount = 0;
    for(let day of days) {
      if(today > day.date) {
        passedDays++
        continue;
      }
      let found = false;
      for(let existingDay of existingDays) {
        let edDay = existingDay.summary;
        let edDate = new Date(existingDay.start.date)
        if(edDate.toISOString().split('T')[0] == day.date.toISOString().split('T')[0]) {
          existingCount++;
          found = true;
          break
        }
        if(edDate > day.date) {
          break
        }
      }
      if(!found) {
        newDays.push(day);
      }
    }
    let addCount = ""
    
    $("#populateButton").removeAttr("disabled");
    if(passedDays > 0) {
      addCount += passedDays + " days have already passed. "
    }
    if(existingCount > 0) {
      addCount += existingCount + " days are already scheduled in the calendar. "
    }
    if(newDays.length != 0) {
      addCount += "Do you want to add " + newDays.length + " days to the calendar?"
    } else {
      addCount += "There is nothing to add to the calendar."
      $("#populateButton").attr("disabled", "disabled");
    }
    
    $("#addCount").text(addCount);
  }, (reason) => {
    log("processDaysCSV() failed to getCurrectCycleDays()", reason);
  });
  
  $('#csvModal').modal("show")
}

//Get the cycle days that are already in the calendar
async function getCurrentCycleDays() {
  let response;
  try {
    let now = new Date();
    let then = new Date(now.getTime() + 1000*60*60*24*365*2)
    now = new Date(now.getTime() - 1000*60*60*24)
    const request = {
      'calendarId': domain.cycle_calendar_id,
      'timeMin': now.toISOString(),
      'timeMax': then.toISOString(),
      'maxResults': 1000,
      'showDeleted': false,
      'singleEvents': true,
      'orderBy': 'startTime',
    };
    return await gapi.client.calendar.events.list(request);
  } catch (err) {
    log("getCurrentCycleDays() error. ", err);
    return;
  }
}

function populateCycleCalendar() {
  const batch = gapi.client.newBatch();
  for(let day of newDays) {
    var event = {
      'summary': day.day,
      'description': day.cycle,
      'start': {
        'date': day.date.toISOString().split('T')[0]
      },
      'end': {
        'date': day.date.toISOString().split('T')[0]
      },
      "extendedProperties": {
        "private": {
          "SchoolCycle": "cycle-days-calendar"
        }
      },
      "source": {
        "title": "SchoolCycle",
        "url": "https://schoolcycle.app"
      }
    };

    var request = gapi.client.calendar.events.insert({
      'calendarId': domain.cycle_calendar_id,
      'resource': event
    });

    batch.add(request);
  }
  batch.execute((events) => {
    let errorCount = 0;
    for(let i in events) {
      // console.log(events[i]);
      let event = events[i]
      if(event.error != null) {
        errorCount++;
        log("Error adding cycle day to calendar.", event);
      }
    }
    if(errorCount == 0) {
      alert($("#manage-alert-container"), "Cycle days successfully added to calendar.", "success", 5000);
    } else if (errorCount == events.length) {
      alert($("#manage-alert-container"), "Cycle days failed to add.", "danger", 5000);
    } else {
      alert($("#manage-alert-container"), "Added " + (events.length-errorCount) + " out of " + events.length + " days. Please try again shortly.", "danger", 5000);
    }
    getEligibleDays();
  });
  $("#csvModal").modal('hide');
}


/* **********************************************************

                  Schedule Tool Settings Tab

 ********************************************************** */

// ********* Day Selector *********

//Get the possible days from the selected calendar
function getEligibleDays() {
  $("#manage-schedule-row").hide();
  let currentDays = domain.cycle_days.split(", ").sort();
  $("#daySelectButtons").empty();

  getCurrentCycleDays().then((response) => {
    if(!response) {
      log("getCurrentCycleDays() -> getEligibleDays() error");
      return false;
    }
    let days = response.result.items;
    
    if(days.length == 0) {
      $("#daySelectButtons").text("You must first add events to your Cycle Day Calendar.")
    }
    
    let eligibleDays = []
    for(let day of days) {
      if(!eligibleDays.includes(day.summary)) {
        eligibleDays.push(day.summary);
      }
    }
    eligibleDays.sort();
    for(let day of eligibleDays) {
      let newBtn = $('<button type="button" class="btn selectDayBtn" onclick="selectDay(this)">' + day + '</button>')
      if(currentDays.includes(day)) {
        newBtn.addClass("btn-primary");
      } else {
        newBtn.addClass("btn-secondary");
      }
      $("#daySelectButtons").append(newBtn);
    }
    generateScheduler();
  }) 
}

//Handle toggling the days and enabling / disabling the save button
function selectDay(e) {
  e = $(e);
  if(e.hasClass("btn-primary")) {
    e.removeClass("btn-primary");
    e.addClass("btn-secondary");
  } else if(e.hasClass("btn-secondary")){
    e.removeClass("btn-secondary");
    e.addClass("btn-primary");
  }
  
  let selectedDays = []
  $(".selectDayBtn.btn-primary").each((i, e)=>selectedDays.push($(e).text()));
  selectedDays.sort();
  let currentDays = domain.cycle_days.split(", ").sort();
  if(currentDays.toString() != selectedDays.toString()) {
    $("#manage-save-button").removeAttr("disabled");
  } else {
    $("#manage-save-button").attr("disabled", "disabled");
  } 
}

//Save the selected days as the official ones to use
function saveSelectedDays() {
  let selectedDays = []
  $(".selectDayBtn.btn-primary").each((i, e)=>selectedDays.push($(e).text()));
  selectedDays = selectedDays.join(", ");
  database.ref("domain/" + safeDomain(domain.name) + "/cycle_days/").set(selectedDays)
  .then(() => {
    log("Cycle days updated to: " + selectedDays)
    $("#manage-save-button").attr("disabled", "disabled");
    alert($("#manage-alert-container"), "Cycle days updated successfully.", "success");
    domain.cycle_days = selectedDays;
    generateScheduler();
  })
  .catch((error) => {
    log("Cycle days failed to update: " + JSON.stringify(error));
    alert($("#manage-alert-container"), "Error: " + error, "warning");
  });
}

// ********* Schedule Module *********

//Handler for the + and - buttons. Enables/disables them as needed. Gets the current fill and tries to put it back after and changes
function changeRowCount(e) {
  if($(e).attr('id') == "removeRow") {
    rowCount--;
  } else if($(e).attr('id') == "addRow") {
    rowCount++;
  }
  
  if(rowCount == 0) {
    $("#removeRow").attr("disabled", "disabled");
  } else {
    $("#removeRow").removeAttr("disabled");
  }
  if(rowCount == 14) {
    $("#addRow").attr("disabled", "disabled");
  } else {
    $("#addRow").removeAttr("disabled");
  }
  let tableValues = getTableValues()
  generateScheduler();
  fillScheduleInputs(tableValues)
}

//Create the input grid for the schedule
let rowCount = 12;
function generateScheduler() {
  $("#defaultScheduleDiv").empty();
  let cycleDays = domain.cycle_days.split(", ").sort();
  
  const rows = rowCount + 1;
  const columns = cycleDays.length + 2;
  
  if($("#sameTimeCheckbox").is(":checked")) {
    $("#differentTimesDayRadio").hide()
    let table = $('<table id="defaultScheduleTable" style="max-width:100%"></table>');
  
    // Create table header
    let headerRow = $("<tr>");
    for (let i = 0; i < columns; i++) {
      let headerCell = $("<th>");
      if(i == 0) {
        headerCell.text("Start Time");
      } else if(i == 1) {
        headerCell.text("End Time");
      } else {
        headerCell.text(cycleDays[i-2]);
      }
      headerRow.append(headerCell);
    }
    table.append(headerRow);

    // Create table data rows
    for (let i = 0; i < rows; i++) {
      const dataRow = $("<tr>");
      for (let j = 0; j < columns; j++) {
        const dataCell = $("<td>");
        const input = $("<input>");
        if(j < 2) {
          input.attr("type", "time");
          input.addClass("grey")
        } else {
          input.attr("type", "text");
          dataCell.css("text-align", "center");
          input.css("width", "98%");
        }
        dataCell.append(input);
        dataRow.append(dataCell);
      }
      table.append(dataRow);
    } 
    $("#defaultScheduleDiv").append(table); 
  } else {   // Handle days with different timeslots
    $("#differentTimesDayRadio").show()
    $("#differentTimesDayRadio > div").empty();
    for(let i in cycleDays) {
      // let inputRadio = $('<input type="radio" class="btn-check" name="daySelectorRadio" id="dayRadio' + i + '" autocomplete="off">');
      // if(i == 0) inputRadio.attr("checked", "checked")
      // let label = $('<label class="btn btn-outline-primary" for="dayRadio' + i + '">' + cycleDays[i] + '</label>');
      // $("#differentTimesDayRadio > div").append(inputRadio, label);
      
      let row = $('<div class="row mb-3">')
      let col = $('<div class="col" style="text-align:center;">')
      
      let table = $('<table class="individualScheduleTable" style="max-width:100%"></table>');
      table.attr("day", cycleDays[i]);
      let headerRow = $("<tr><th>Start Time</th><th>End Time</th><th>" + cycleDays[i] + "</th></tr>");
      table.append(headerRow);

      // Create table data rows
      for (let i = 0; i < rows; i++) {
        const dataRow = $("<tr>");
        for (let j = 0; j < 3; j++) {
          const dataCell = $("<td>");
          const input = $("<input>");
          if(j < 2) {
            input.attr("type", "time");
            input.addClass("grey")
          } else {
            input.attr("type", "text");
            dataCell.css("text-align", "center");
            input.css("width", "98%");
          }
          dataCell.append(input);
          dataRow.append(dataCell);
        }
        table.append(dataRow);
      }
      col.append(table)
      row.append(col);
      $("#defaultScheduleDiv").append(row);
    }
    let input = $('<input type="radio" class="btn-check" name="daySelectorRadio" id="dayRadioAll" autocomplete="off">');
    let label = $('<label class="btn btn-outline-primary" for="dayRadioAll">All</label>');
    $("#differentTimesDayRadio > div").append(input, label);
  }
  
  $("#manage-schedule-row").show();
}


// Update the list of saved schedules
function updateScheduleDropDown(selected) {
  let names = Object.keys(domain.default_schedules).sort()
  $("#schedulesDropDown").empty()
  let firstOpt = $("<option disabled>Saved Schedules</option>");
  if(selected == null) firstOpt.attr("selected", "selected");
  $("#schedulesDropDown").append(firstOpt);
  for(let name of names) {
    let option = $('<option>');
    option.text(fbUnsafe(name));
    if(selected == name || selected == fbUnsafe(name)) {
      option.attr("selected", "selected")
    }
    $("#schedulesDropDown").append(option);
  } 
  schedulesDropDownChanged()
}

// Handle changes to the saved schedule dropdown. Mainly enabling or disabling buttons
function schedulesDropDownChanged() {
  if($('#schedulesDropDown').find(':selected').attr("disabled") == "disabled") {
    $("#loadSchedule").attr("disabled", "disabled");
    $("#saveSchedule").attr("disabled", "disabled");
    $("#deleteSchedule").attr("disabled", "disabled");
  } else {
    $("#loadSchedule").removeAttr("disabled");
    $("#saveSchedule").removeAttr("disabled");
    $("#deleteSchedule").removeAttr("disabled");
  }
}

// Handle the load schedule button that fills the input table using saved values
function loadSchedule() {
  let name = fbSafe($('#schedulesDropDown').find(':selected').val());
  let schedule = domain.default_schedules[name];
  $("#sameTimeCheckbox").prop("checked", schedule.sameTimes);
  schedule = JSON.parse(schedule.entries);
  rowCount = schedule.length-2;
  generateScheduler();
  fillScheduleInputs(schedule);
}

function fillScheduleInputs(schedule) {
  if($("#sameTimeCheckbox").is(":checked")) {
    let availableHeaders = domain.cycle_days.split(", ").sort();
    availableHeaders.unshift("End Time");
    availableHeaders.unshift("Start Time");
    let table = $("#defaultScheduleTable");
    let rows = $("#defaultScheduleTable").children();
    let savedHeaders = schedule[0]
    rows.each((y, e) => {
      if(y != 0) {
        $(e).children().each((x, el) => {
          let newX = savedHeaders.indexOf(availableHeaders[x]);
          if(newX != -1 && y < schedule.length) {
            $(el).find("input").val(schedule[y][newX]);
          }
        })
      }
    })
  } else {
    let availableHeaders = domain.cycle_days.split(", ").sort();
    let tables = $(".individualScheduleTable");
    let savedHeaders = [];
    for(let t of schedule){
      savedHeaders.push(t[0][2]);
    }

    tables.each((i,t) => {
      let savedTableNumber = savedHeaders.indexOf(availableHeaders[i]);
      if(savedTableNumber != -1) {
        $(t).children().each((y, e) => {
          if(y < schedule[0].length) {
            $(e).children().each((x, el) => {
              $(el).find("input").val(schedule[savedTableNumber][y][x])
            });
          }
        });
      }
    });
  }
}

// Handler for the save as button that creates new saved schedules
function saveScheduleAs() {
  $('#saveAsModal').modal('hide')
  let values = getTableValues();
  
  let name = fbSafe($("#scheduleNameInput").val());
  $("#scheduleNameInput").val("")
  if(name.length > 100) name = name.substring(0, 100);
  
  let usedNames = Object.keys(domain.default_schedules);
  if(usedNames.includes(name)) {
    alert($("#manage-alert-container"), "That name is already in use.", "warning");
    return false;
  }
  database.ref("domain/" + safeDomain(domain.name) + "/default_schedules/" + name).set({
    entries: JSON.stringify(values),
    sameTimes: $("#sameTimeCheckbox").is(":checked")
  })
  .then(() => {
    log("Created new schedule: " + name)
    alert($("#manage-alert-container"), "Created new schedule: " + fbUnsafe(name), "success");
    domain.default_schedules[name] = {
    entries: JSON.stringify(values),
    sameTimes: $("#sameTimeCheckbox").is(":checked")
  };
    updateScheduleDropDown(name);
  })
  .catch((error) => {
    log("Failed to create schedule: " + name, error);
    alert($("#manage-alert-container"), "Failed to create schedule: " + fbUnsafe(name), "warning");
  });
}

// Handler for the update button that overwrites existing schedules
function updateSchedule() {
  $('#updateModal').modal('hide')
  let values = getTableValues();
  
  for(let i = 1; i < values.length; i++) {
    let now = new Date();
    let s = values[i][0];
    let e = values[i][1];
    if((new Date(now.toLocaleDateString() + " " + s) >= (new Date(now.toLocaleDateString() + " " + e)))) {
      alert($("#manage-alert-container"), "Start times must be before end times.", "warning");
      return false
    }
  }
  
  let name = fbSafe($('#schedulesDropDown').find(':selected').val())
  
  database.ref("domain/" + safeDomain(domain.name) + "/default_schedules/" + name).set({
    entries: JSON.stringify(values),
    sameTimes: $("#sameTimeCheckbox").is(":checked")
  })
  .then(() => {
    log("Updated schedule: " + name)
    alert($("#manage-alert-container"), "Updated schedule: " + fbUnsafe(name), "success");
    domain.default_schedules[name] = {
    entries: JSON.stringify(values),
    sameTimes: $("#sameTimeCheckbox").is(":checked")
  };
    updateScheduleDropDown(name);
  })
  .catch((error) => {
    log("Failed to create schedule: " + name, error);
    alert($("#manage-alert-container"), "Failed to update schedule: " + fbUnsafe(name), "warning");
  });
}

// Handler for the delete schedule button that removes saved schedules
function deleteSchedule() {
  $('#deleteModal').modal('hide')
  let name = fbSafe($('#schedulesDropDown').find(':selected').val())
  
  database.ref("domain/" + safeDomain(domain.name) + "/default_schedules/" + name).set({})
  .then(() => {
    log("Deleted schedule: " + name)
    alert($("#manage-alert-container"), "Deleted schedule: " + fbUnsafe(name), "success");
    delete domain.default_schedules[name];
    updateScheduleDropDown();
  })
  .catch((error) => {
    log("Failed to delete schedule: " + name, error);
    alert($("#manage-alert-container"), "Failed to delete schedule: " + fbUnsafe(name), "warning");
  });
}


