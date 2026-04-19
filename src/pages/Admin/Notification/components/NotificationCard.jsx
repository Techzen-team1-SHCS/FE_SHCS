import styles from "../Notification.module.css";
import { NOTIFICATION_TYPES } from '../constants';
import { formatTimeAgo } from '../helpers';

const NotificationCard = ({ notification, markAsRead }) => {
  return (
    <div
      className={`${styles.notificationCard} ${!notification.is_read ? styles.unreadCard : ""}`}
      onClick={() => !notification.is_read && markAsRead(notification.id)}
      style={{ cursor: !notification.is_read ? "pointer" : "default" }}
    >
      <div className={styles.cardLeft}>
        <div
          className={styles.iconContainer}
          style={{
            backgroundColor: NOTIFICATION_TYPES[notification.type]?.bg,
            color: NOTIFICATION_TYPES[notification.type]?.color,
          }}
        >
          <img
            src={NOTIFICATION_TYPES[notification.type]?.icon}
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

export default NotificationCard;
