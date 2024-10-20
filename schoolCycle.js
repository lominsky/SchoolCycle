//Firebase setup
const config = {
  apiKey: "AIzaSyClH_aXnYIXkAHOy9hwVQZXnjNYrQDJt3k",
  authDomain: "school-cycle.firebaseapp.com",
  databaseURL: "https://school-cycle-default-rtdb.firebaseio.com",
  projectId: "school-cycle",
  storageBucket: "school-cycle.appspot.com",
  messagingSenderId: "989767443269",
  appId: "1:989767443269:web:842bc7328425655156942c",
  measurementId: "G-DVZGLWTVX5",
};

//API Request Data
let CLIENT_ID;
let API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';
let tokenClient;

//Confirmation for the Service Unavailable Modal
let gapiInited = false;
let gisInited = false;
let fbInited = false;
let serviceModalInterval;
let serviceModalIntervalCount = 0; //The modal is bad at closing. This repeats until it's closed

//Setup Firebase
try {
  firebase.initializeApp(config);
} catch (error) {
  $('#servicesModal').modal('show');
  console.error("firebase.initializeApp() errored.", error);
}
let database = firebase.database();
let auth = firebase.auth();
let user = null; //Stores the user information
let domain = null;

//Load and Initialize GAPI
function gapiLoaded() {
  console.log("gapiLoaded()");
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  console.log("initializeGapiClient()");
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: [DISCOVERY_DOC],
  });
  gapiInited = true;
  googleServicesAreLoaded();
}

//Load Google Identity Service
function gisLoaded() {
  database.ref("/admin/").once("value", (snapshot) => {
    console.log("read the admin information")
    let val = snapshot.val();
    console.log(val)
    CLIENT_ID = val.client_id;
    API_KEY = val.api_key;
    
    if(!val) {
      alert($("#manage-alert-container"), "Cannot reach database. Please reload.", "danger");
      return false
    }
    
    console.log("gisLoaded()");
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
    googleServicesAreLoaded();
  })
  
}

//If any of the external services don't load properly, display 
function googleServicesAreLoaded() {
  console.log("googleServicesAreLoaded()");
  if(!gisInited) $("#gisStatus").text("Google Identity Service is not loaded.");
  if(!gapiInited) $("#gapiStatus").text("Google API is not loaded.");
  if(!fbInited) $("#fbStatus").text("Firebase is not loaded.");
  
  if(gisInited && gapiInited && fbInited) {
    handleAuth();
    serviceModalInterval = setInterval(() => {
      serviceModalIntervalCount++;
      $('#servicesModal').modal('hide')
      if(serviceModalIntervalCount == 100) {
        clearInterval(serviceModalInterval);
      }
    }, 1);
  }
}

//Loads the authoriation popup for GAPI
//Unless you pass it an explicit callback function, it will call authCallback()
function handleAuth(callback) {
  console.log("handleAuth()");
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
      throw (resp);
    } else {
      if(callback != null) {
        callback();
      } else if(authCallback != null) {
        authCallback();
      }
    }
  };

  if (gapi.client.getToken() === null) {
    tokenClient.requestAccessToken({prompt: 'consent'});
  } else {
    tokenClient.requestAccessToken({prompt: ''});
  }
}

//Runs when the page is loaded. Handles login and adding event listeners to buttons
$(() => {
  console.log("PAGE LOADED");
  try {
    gapiLoaded();
  } catch (error) {
    $('#servicesModal').modal('show');
    console.error("gapiLoaded() errored.", error);
  }
  try {
    gisLoaded();
  } catch (error) {
    $('#servicesModal').modal('show');
    console.error("gisLoaded() errored.", error);
  }
  
  $('#copyright-year').text((new Date()).getFullYear());

  //Handle changes in login status
  firebase.auth().onAuthStateChanged((u) => {
    fbInited = true;
    googleServicesAreLoaded();
    if (u) {
      user = u;
      user.domain = safeDomain(u.email)
      displayMain(u);
    } else {
      displayLogin();
    }
  });  
  
  //Handle clicking on the sign in / log in / login button
  $('#signin').on('click', () => {
    $('#loginLoading').show();
    let provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then((result) => {
    }).catch((error) => {
      console.log("Sign In Error.", error);
      displayLogin();
    });
  });

  //Handle clicking on the sign out / signout / log out button
  $("#logout").on('click', () => {
    displayLogin();
    firebase.auth().signOut();
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
    }
    user = null;
  });
});

//Get the values from the various schedule tables in the nice JSON format
function getTableValues() {
  console.log("getTableValue()");
  let values = [];
  
  let sameTime = true;
  console.log($("#sameTimeCheckbox"));
  if($("#sameTimeCheckbox")[0] != null) {
    sameTime = $("#sameTimeCheckbox").is(":checked")
  } else {
    sameTime = domain.selectedDefault.sameTimes;
  }
  console.log(sameTime);
  
  if(sameTime) {
    let headers = []
    $("#defaultScheduleTable").find("th").each((i, e) => { headers.push($(e).text())})
    values.push(headers);
    $("#defaultScheduleTable").children().each((y, e) => {
      let row = []
      if(y != 0) {
        $(e).children().each((x, el) => {
          row.push($(el).find("input").val())
        });
        values.push(row);
      }
    })
  } else {
    console.log("different times");
    $(".individualScheduleTable").each((i,t) => {
      let tableData = [];
      $(t).children().each((y,e) => {
        let rowData = [];
        $(e).children().each((x, el) => {
          if(y == 0) {
            rowData.push($(el).text())
          } else {
            rowData.push($(el).find("input").val());
          }
        })
        tableData.push(rowData);
      });
      values.push(tableData)
    });
  }
  
  console.log(values);
  
  // Check that start is before end
  for(let i = 1; i < values.length; i++) {
    let now = new Date();
    if((new Date(now.toLocaleDateString() + " " + values[i][0]) > (new Date(now.toLocaleDateString() + " " + values[i][1])))) {
      alert($("#manage-alert-container"), "Start times must be before end times.", "warning");
      return false
    }
  }
  
  return values
}


//Converts from a ms timestamp into a nicely formatted date string
function timestampToInputDateString(ts) {
  console.log("timestampToInputDateStrings()");
  if(ts == "") return "";
  let d = new Date(parseInt(ts));
  return d.toISOString().substring(0,10)
}

//Log a message to the db log file. Can take a text message and an extra (object?)
function log(message, extra) {
  // console.log("log()");
  console.log(message, extra)
  if(extra == null) {
    
  } else if(typeof extra == "object") {
    message = message + " " + JSON.stringify(extra);
  } else {
    message = message + " " + extra
  }
  database.ref("log/" + safeDomain(user.email)).push({
    user: user.uid,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    message: message.replaceAll('.', '%2E')
  }).catch(function(error) {
    console.log("Log Failed?!:", error)
  });
}

//handle converting between safe and unsafe key values
function safeDomain(d) {
  // console.log("safeDomain()");
  if(d.indexOf('@') != -1) d = d.split("@")[1]
  return fbSafe(d)
}
function fbSafe(str) {
  // console.log("fbSafe()");
  return encodeURIComponent(str).replace(/\./g, "%2E")
}
function fbUnsafe(str) {
  // console.log("fbUnsafe()");
  return decodeURIComponent(str.replace(/%2E/g, "."));
}

//Convert from snake case to table headings with capitalization
function beautifySnakeCase(snake) {
  // console.log("beautifySnakeCase()");
  snake = snake.split("_")
  let temp = ""
  for(let word of snake) {
    temp += word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase() + " "
  }
  return temp.slice(0, -1)
}

//Create an alert message in the location specified
function alert(loc, message, type="warning", dismissTime=2000) {
  // console.log("alert()");
  var wrapper = $("<div>");
  wrapper.html(
    '<div class="alert alert-' +
      type +
      ' alert-dismissible" role="alert">' +
      message +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
  );
  if(dismissTime != null) {
    wrapper.fadeTo(dismissTime, 500).slideUp(500, function() {
      wrapper.alert('close');
    });
  }

  loc.append(wrapper);
}