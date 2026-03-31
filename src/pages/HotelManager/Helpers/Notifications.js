export const filterNotifications = (notifications, activeTab) => {
  if (activeTab === "All") return notifications;

  if (activeTab === "Read") {
    return notifications.filter((n) => !n.unread);
  }

  return notifications.filter((n) => n.unread);
};

export const getPaginationPages = (totalPages) => {
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};