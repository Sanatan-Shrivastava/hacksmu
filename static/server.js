// Define the base URL where your Flask server is hosted
const baseUrl = "https://f2f5-20-118-130-2.ngrok-free.app";

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
  console.log("printing notificartion");
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
    document.getElementById("showRequestBtn").style.display='None';
    console.log("Future Series Data:", futureData);
    // Loop through the hard-coded JSON data and create notification cards
    futureData.futureServices.forEach((notification) => {
      const notificationCard = createNotificationCard(notification);
      notificationsContainer.appendChild(notificationCard);
    });
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

