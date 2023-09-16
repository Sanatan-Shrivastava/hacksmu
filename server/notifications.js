const notificationsData = [
  {
    AssetType: "Name 1",
    ServiceRequiredFrom: "01/15/2023",
    ServiceBefore: "02/01/2023",
  },
  {
    AssetType: "Name 2",
    ServiceRequiredFrom: "02/20/2023",
    ServiceBefore: "03/10/2023",
  },
  {
    AssetType: "Name 3",
    ServiceRequiredFrom: "03/05/2023",
    ServiceBefore: "04/02/2023",
  },
  // Add more notifications as needed
];

// Function to create a notification card
function createNotificationCard(notification) {
  const card = document.createElement("div");
  card.className = "alert alert-light m-1 ";

  // Create content for the notification card using the JSON data
  const content = `
          Service needed for <strong>${notification.AssetType}</strong> on <strong>${notification.ServiceRequiredFrom}</strong><br>
          Please complete service request before <strong> ${notification.ServiceBefore}</strong>
        `;

  card.innerHTML = content;
  return card;
}

// Get the notifications container
const notificationsContainer = document.getElementById(
  "notificationsContainer"
);

// Loop through the hard-coded JSON data and create notification cards
notificationsData.forEach((notification) => {
  const notificationCard = createNotificationCard(notification);
  notificationsContainer.appendChild(notificationCard);
});
