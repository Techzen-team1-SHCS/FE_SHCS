import styles from "../../Notification.module.css";
import { getNotificationTypeConfig } from "../../helpers/notificationHelpers";

const NotificationCard = ({ notification, onRead }) => {
  const {
    notificationCard,
    unreadCard,
    cardLeft,
    iconContainer,
    contentContainer,
    notificationTitle,
    notificationDescription,
    notificationMeta,
    cardRight,
    notificationDate,
    notificationTime,
    readStatus,
    unreadDot,
    notificationHeader,
    typeBadge,
  } = styles;

  const typeConfig = getNotificationTypeConfig(notification.type);

  return (
     <div
                  className={`${notificationCard} ${!notification.is_read ? unreadCard : ""
                    }`}
                  key={notification.id || notification._id}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                  style={{ cursor: !notification.is_read ? "pointer" : "default" }}
                >
                  <div className={cardLeft}>
                    <div
                      className={iconContainer}
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
    
                    <div className={contentContainer}>
                      <div className={notificationHeader}>
                        <h3 className={notificationTitle}>{notification.title}</h3>
                        <span className={typeBadge}>
                          {notification.type}
                        </span>
                      </div>
                      <p className={notificationDescription}>
                        {notification.message || notification.desc || notification.description}
                      </p>
                      <div className={notificationMeta}>
                        <span className={notificationDate}>
                          {formatTimeAgo(notification.created_at || notification.date)}
                        </span>
                        {notification.time && (
                          <span className={notificationTime}> • {notification.time}</span>
                        )}
                      </div>
                    </div>
                  </div>
    
                  <div className={cardRight}>
                    {!notification.is_read && <div className={unreadDot}></div>}
                    <div className={readStatus}>
                      {notification.is_read ? "Read" : "Unread"}
                    </div>
                  </div>
                </div>
  );
};

export default NotificationCard;