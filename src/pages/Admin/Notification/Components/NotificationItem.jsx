import styles from "../Notification.module.css";
import { NOTIFICATION_TYPES } from "../Constants/notificationConstants";
import { formatTimeAgo } from "../Helpers/notificationHelpers";

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const typeConfig = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.system;
  
  return (
    <div
      className={`${styles.notificationCard} ${!notification.is_read ? styles.unreadCard : ""}`}
      onClick={() => !notification.is_read && onMarkAsRead(notification.id || notification._id)}
      style={{ cursor: !notification.is_read ? "pointer" : "default" }}
    >
      <div className={styles.cardLeft}>
        <div
          className={styles.iconContainer}
          style={{
            backgroundColor: typeConfig.bg,
            color: typeConfig.color,
          }}
        >
          <img
            src={typeConfig.icon}
            alt={notification.type}
          />
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.notificationHeader}>
            <h3 className={styles.notificationTitle}>{notification.title}</h3>
            <span className={styles.typeBadge}>
              {notification.type}
            </span>
          </div>
          <p className={styles.notificationDescription}>
            {notification.message || notification.desc || notification.description}
          </p>
          <div className={styles.notificationMeta}>
            <span className={styles.notificationDate}>
              {formatTimeAgo(notification.created_at || notification.date)}
            </span>
            {notification.time && (
              <span className={styles.notificationTime}> • {notification.time}</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.cardRight}>
        {!notification.is_read && <div className={styles.unreadDot}></div>}
        <div className={styles.readStatus}>
          {notification.is_read ? "Read" : "Unread"}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
