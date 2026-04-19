import styles from "../Notification.module.css";
import EmptyState from "./EmptyState";
import NotificationItem from "./NotificationItem";

const NotificationList = ({ notifications, onMarkAsRead }) => {
  return (
    <div className={styles.notificationList}>
      {notifications.length === 0 ? (
        <EmptyState />
      ) : (
        notifications.map((notification) => (
          <NotificationItem
            key={notification.id || notification._id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
          />
        ))
      )}
    </div>
  );
};

export default NotificationList;
