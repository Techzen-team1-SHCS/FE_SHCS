import styles from "../Notification.module.css";

const NotificationHeader = ({ notifications, pendingHotels, fetchAllData, markAllAsRead }) => {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.headerTitle}>Notifications</h1>
        <p className={styles.headerSubtitle}>
          {pendingHotels.length > 0 && `${pendingHotels.length} hotels pending approval • `}
          {notifications.length} total notifications
        </p>
      </div>

      {(notifications.length > 0 || pendingHotels.length > 0) && (
        <div className={styles.actionsContainer}>
          <button
            className={styles.refreshBtn}
            onClick={fetchAllData}
          >
            Refresh
          </button>
          {notifications.length > 0 && (
            <button
              className={styles.markAllReadBtn}
              onClick={markAllAsRead}
              disabled={notifications.every(n => n.is_read)}
            >
              Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationHeader;
