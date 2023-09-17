// Define the base URL where your Flask server is hosted
const baseUrl = "https://68b4-20-106-75-84.ngrok-free.app";

// Function to make GET requests to your Flask APIs
async function fetchApi(endpoint) {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Get the notifications container


async function getUrgentServiceRequests() {
  try {
    const futureData = await fetchApi("/getNotification");
    document.getElementById("showUrgentRequestBtn").style.display = "None";
    console.log("Urgent Service Request:", futureData); // Accumulate notifications
    const urgentNotifications = [];
    const urgentServiceRequestsContainer = document.getElementById("urgentServiceRequestsContainer");
    futureData.notifications.forEach((notification) => {
      console.log(urgentServiceRequestsContainer);
      const notificationCard = createNotificationCardUrgentServiceRequest(notification);
      urgentServiceRequestsContainer.appendChild(notificationCard);
      urgentNotifications.push(notificationCard.innerHTML);
    });

    // Combine all notifications into a single email message
    const emailMessage = urgentNotifications.join("<br>");

    emailjs.init("DAZHOYfCb-cRmDSIu");

    // Send an email using EmailJS
    emailjs
      .send("service_iojgk85", "template_qsu5igb", {
        to_email: "sanatan.mscs@gmail.com",
        subject: "Service Required Notification",
        message: emailMessage,
      })
      .then(
        function (response) {
          console.log("Email sent successfully:", response);
        },
        function (error) {
          console.error("Email send error:", error);
        }
      );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Function to create a notification card
function createNotificationCardUrgentServiceRequest(notification) {
  const card = document.createElement("div");
  card.className = "alert alert-light";
  // Create content for the notification card using the JSON data
  const content = `
          Urgent Service needed for <strong>${notification.AssetType}</strong> on <strong>Floor - ${notification.floor}, Room - ${notification.room}</strong>
        `;

  card.innerHTML = content;
  return card;
}



// Function to create a notification card
function createNotificationCard(notification) {
  const card = document.createElement("div");
  card.className = "alert alert-light";
  // Create content for the notification card using the JSON data
  const content = `
          Service needed for <strong>${notification.AssetType}</strong> on <strong>${notification.ServiceRequiredFrom}</strong><br>
          Please complete service request before <strong> ${notification.ServiceBefore}</strong> for <strong>${notification.room}</strong>
        `;

  card.innerHTML = content;
  return card;
}

// Get the notifications container
const notificationsContainer = document.getElementById(
  "notificationsContainer"
);

async function getFutureSeriesData() {
  try {
    const futureData = await fetchApi("/getFutureSeries");
    document.getElementById("showRequestBtn").style.display = "None";
    console.log("Future Series Data:", futureData);

    // Accumulate notifications
    const notifications = [];

    futureData.futureServices.forEach((notification) => {
      const notificationCard = createNotificationCard(notification);
      notificationsContainer.appendChild(notificationCard);
      notifications.push(notificationCard.innerHTML);
    });

    // Combine all notifications into a single email message
    const emailMessage = notifications.join("<br>");

    emailjs.init("DAZHOYfCb-cRmDSIu");

    // Send an email using EmailJS
    emailjs
      .send("service_iojgk85", "template_qsu5igb", {
        to_email: "sanatan.mscs@gmail.com",
        subject: "Service Required Notification",
        message: emailMessage,
      })
      .then(
        function (response) {
          console.log("Email sent successfully:", response);
        },
        function (error) {
          console.error("Email send error:", error);
        }
      );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

var room;
var floor;

// JavaScript for the first dropdown
const dropdownButton = document.getElementById("dropdownButton");
const dropdownMenu = document.getElementById("dropdownMenu");

dropdownMenu.addEventListener("click", (e) => {
  if (e.target.tagName === "OPTION") {
    floor = e.target.value;
    dropdownButton.innerText = `Floor ${floor}`;
    console.log("Selected value:", floor);
  }
});

// JavaScript for the second dropdown
const dropdownButton1 = document.getElementById("dropdownButton1");
const dropdownMenu1 = document.getElementById("dropdownMenu1");

dropdownMenu1.addEventListener("click", (e) => {
  if (e.target.tagName === "OPTION") {
    room = e.target.value;
    dropdownButton1.innerText = `Room ${room}`;
    console.log("Selected value:", room);
  }
});


function getRoomData() {

  const payload = {
    floor: floor,
    room: room,
  };

  console.log("sending payload to flask backend", payload);

  fetch("/getRoomData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Parse the response as JSON
    })
    .then((data) => {
      updateSystemStatus(data);
    })
    .catch((error) => console.error("Error:", error));
}


// Function to update system statuses
function updateSystemStatus(payload) {
  const roomFloorStatus = document.getElementById("roomFloorHeading");
  const h4Content = `
      <h4 class="fs-2 my-4 py-4 fw-normal text-center text-secondary">
        Assets' status for 
        <span class="text-black fw-semibold" id="roomStatus">Room No. ${payload.room}</span> on 
        <span class="text-black fw-semibold" id="floorStatus">Floor ${payload.floor}</span>
      </h4>
    `;
  roomFloorStatus.innerHTML = h4Content;
  document.getElementById("roomDataTable").style.display = 'block';
  console.log("updateSystemStatus: ", payload);
  // Define a mapping of statuses to icons and colors
  const statusMapping = {
    running: {
      iconClass: "bi bi-check-circle-fill text-success fs-5"
    },
    service: {
      iconClass: "bi bi-exclamation-circle-fill text-warning fs-5"
    },
    down: {
      iconClass: "bi bi-x-circle-fill text-danger fs-5"
    },
  };

  const room = payload.room;
  const floor = payload.floor;

  const ep = payload.roomService.ElectricalPanel;
  const ps = payload.roomService.PlumbingSystem;
  const fa = payload.roomService.FireAlarm;
  const el = payload.roomService.Elevator;
  const hvac = payload.roomService.HVAC;

  document.getElementById("ElectricalPanelStatus").innerHTML = ep;
  document.getElementById("ElectricalPanelStatusIcon").className =
    statusMapping[ep].iconClass;
  document.getElementById("PlumbingSystemsStatus").innerHTML = ps;
  document.getElementById("PlumbingSystemsStatusIcon").className =
    statusMapping[ps].iconClass;
  document.getElementById("FireAlarmStatus").innerHTML = fa;
  document.getElementById("FireAlarmStatusIcon").className =
    statusMapping[fa].iconClass;
  document.getElementById("ElevatorStatus").innerHTML = el;
  document.getElementById("ElevatorStatusIcon").className =
    statusMapping[el].iconClass;
  document.getElementById("HVACStatus").innerHTML = hvac;
  document.getElementById("HVACStatusIcon").className =
    statusMapping[hvac].iconClass;
}
