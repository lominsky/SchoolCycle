
let adminData;

function authCallback() {
  // console.log("Authorization is done, but no need for a callback?");
}

//Displays the main screen and hides the login button
function displayMain() {
  if (user.email != "louis@louisminsky.com") location.pathname = "/";
  processAdminData();
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

function processAdminData() {
  database.ref("/").once("value", (snapshot) => {
    adminData = snapshot.val();
    // console.log(adminData);

    let users = [];
    for (let d in adminData.users) {
      for (let u in adminData.users[d]) {
        users.push({
          name: adminData.users[d][u].name,
          email: adminData.users[d][u].email,
          last_login: (new Date(adminData.users[d][u].last_login)).toLocaleString(),
          uid: adminData.users[d][u].uid,
          schedules: adminData.users[d][u].schedules == null ? 0 : Object.keys(adminData.users[d][u].schedules).length,
          domain: fbUnsafe(d),
          account_created: (new Date(adminData.users[d][u].account_created)).toLocaleString(),
        });
      }
    }

    /******************
        Users Tab
    ******************/
    if (users.length != 0) {
      let table = $('<table class="table table-sm">');
      let head = $("<thead>");
      let headtr = $("<tr>");
      head.append(headtr);
      table.append(head);
      let userProps = Object.keys(users[0]);
      // console.log(users)
      for (let p of userProps) {
        let th = $('<th scope="col"></th>');
        th.text(beautifySnakeCase(p));
        headtr.append(th);
      }
      let body = $("<tbody>");
      table.append(body);
      $("#users").append(table);
      
      //I want this to sort users by domain and then name, but no luck so far.
      users.sort((a, b) => {
        return b.domain - a.domain || a.name - b.name;
      })
      for (let user of users) {
        let row = $("<tr>");
        for (let p of userProps) {
          let td = $("<td>");
          td.text(user[p]);
          row.append(td);
        }
        body.append(row);
      }
    }

    /******************
        Domains Tab
    ******************/
    let domains = adminData.domain;
    if (domains.length != 0) {
      let table = $('<table class="table table-sm">');
      let head = $("<thead>");
      let headtr = $("<tr>");
      head.append(headtr);
      table.append(head);
      let domainProps = Object.keys(domains);
      domainProps = Object.keys(domains[domainProps[0]]);
      domainProps[1] = "users";
      headtr.append($('<th scope="col"></th>'));
      headtr.append($('<th scope="col">domain</th>'));
      for (let p of domainProps) {
        let th = $('<th scope="col"></th>');
        th.text(beautifySnakeCase(p));
        headtr.append(th);
      }
      let body = $("<tbody>");
      table.append(body);
      $("#domains").append(table);

      for (let d in domains) {
        let row = $("<tr>");
        row.append(
          $(
            '<td><button type="button" class="btn btn-primary btn-sm domainEditButton" data-bs-toggle="modal" data-bs-target="#domainModal">Edit</button></td>'
          )
        );
        let tdd = $("<td>");
        tdd.text(fbUnsafe(d));
        row.append(tdd);
        for (let p of domainProps) {
          let td = $("<td>");
          if(p == "administrators" || p == "default_schedules") {
            td.text(Object.keys(domains[d][p]).length);
          } else if(p == "expiration") {
            td.text(timestampToInputDateString(domains[d][p]))
          } else if(p == "users") {
            td.text(Object.keys(adminData.users[d]).length);
          }else {
            td.text(domains[d][p]);
            
          }
          if(p == "cycle_calendar_id") {
            // console.log(p, domains[d][p])
            td.css("max-width","50px");
            td.css("word-wrap","break-word");
          }
          row.append(td);
        }
        body.append(row);
      }
      $(".domainEditButton").click(assembleDomainModal);
      
      
      /******************
          Logs Tab
      ******************/
      let logs = adminData.log;
      let logDomains = Object.keys(logs);
      if(logDomains.length > 1) {
        let sel = $('<select class="form-select form-select-lg mb-3" aria-label="Log Select" id="logSelect"><option selected disabled>Select a domain...</option></select>');

        for(let dom of logDomains) {
          // <option value="1">One</option>
          let opt = $('<option>');
          opt.text(fbUnsafe(dom));
          opt.attr('value', dom);
          sel.append(opt);
        }

        let ltd = $('<div class="container" id="logTableDiv"></div>');

        sel.change((e) => {
          let logs = adminData.log;
          let logDomains = Object.keys(logs);
          let dom = $(e.target).find(":selected").val();
          $('#logTableDiv').empty();
          let table = $('<table class="table table-sm">');
          let head = $('<thead><tr><th scope="col">Timestamp</th><th scope="col">User</th><th scope="col">Message</th></tr></thead>');
          table.append(head);
          let body = $("<tbody>");
          table.append(body);

          let domainLogs = Object.values(logs[dom]);
          let fullName = {};
          for(let i in domainLogs) {
            fullName[domainLogs[i].user] = adminData.users[dom][domainLogs[i].user].name;
          }
          domainLogs.sort((a, b) => { return b.timestamp - a.timestamp });
          domainLogs.forEach((log) => {
            let logDate = new Date(log.timestamp);
            body.append($('<tr><td>' + logDate.toLocaleString() + '</td><td>' + fullName[log.user] + '</td><td>' + log.message + '</td></tr>'))
          })

          $("#logTableDiv").append(table);
        })

        $('#logs').append(sel);
        $('#logs').append(ltd);
      }
    }
  });
}

function assembleDomainModal(e) {
  let t = $(e.target);
  let d = t.parent().next().text();
  let dSafe = safeDomain(d);
  let domain = adminData.domain[dSafe];
  let adminString = "";
  let adminUIDs = Object.keys(domain.administrators)
  for(let i in adminUIDs) {
    if(i > 0) adminString += ", ";
    adminString += domain.administrators[adminUIDs[i]];
  }
  
  $("#domainModalLabel").text(d);
  $("#domain-administrators").val(adminString);
  $("#domain-calendar-id").val(domain.cycle_calendar_id);
  $("#domain-expiration").val(timestampToInputDateString(domain.expiration));
  $("#domain-cycle-days").val(domain.cycle_days);
}

function updateDomain() {
  let d = $("#domainModalLabel").text();
  let dSafe = safeDomain(d);
  
  let dateObj = new Date($("#domain-expiration").val());
  if(dateObj) {
    dateObj = new Date(dateObj.getTime() + dateObj.getTimezoneOffset()*1000*60);
    adminData.domain[dSafe].expiration = dateObj.getTime();
  }
  

  adminData.domain[dSafe].cycle_calendar_id = $("#domain-calendar-id").val();
  adminData.domain[dSafe].cycle_days = $("#domain-cycle-days").val();
  let admin = $("#domain-administrators").val().replace(/ /g, "").split(",");

  let adminObj = {};
  for (let email of admin) {
    let found = false;
    for (let uid in adminData.users[dSafe]) {
      if (adminData.users[dSafe][uid].email == email) {
        adminObj[uid] = email;
        found = true;
      }
    }
    if (!found) {
      log("Failed to find user " + email + " in domain " + d);
      alert($("#domainModalAlert"), "Could not find user: '" + email + "'. Settings not saved.", "danger");
      return false;
    }
  }
  adminData.domain[dSafe].administrators = adminObj;
  
  database.ref("domain/" + dSafe).set(adminData.domain[dSafe])
    .then(() => {
      log(d + " updated: " + JSON.stringify(adminData.domain[dSafe]))
      alert($("#domainModalAlert"), d + " updated successfully.", "success");
    })
    .catch((error) => {
      log(d + " failed to update: ",  error);
      alert($("#domainModalAlert"), "Error: " + error, "warning");
    });
}

