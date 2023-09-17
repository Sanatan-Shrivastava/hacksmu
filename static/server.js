// Define the base URL where your Flask server is hosted
const baseUrl = "https://dc47-20-106-75-84.ngrok-free.app";

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

async function getNotificationData() {
  try {
    const notificationData = await fetchApi("/getNotification");
    console.log("Notification Data:", notificationData);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
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
      console.log("Selected value:", floor);
    }
  });

// JavaScript for the second dropdown
  const dropdownButton1 = document.getElementById("dropdownButton1");
  const dropdownMenu1 = document.getElementById("dropdownMenu1");

  dropdownMenu1.addEventListener("click", (e) => {
    if (e.target.tagName === "OPTION") {
      room = e.target.value;
      console.log("Selected value:", room);
    }
  });



function getRoomData() {
  const payload = {
    floor: floor,
    room: room
  }

  console.log("sending payload to flask backend", payload)

  fetch("http://localhost:5000/getRoomData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.json())
    .then((data) => console.log("Response from server:", data), arrayShow())

    .catch((error) => console.error("Error:", error));
}



