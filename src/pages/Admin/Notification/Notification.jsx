import { useEffect, useState } from "react";
import styles from "./Notification.module.css";
import { notificationService } from "../../../services/notificationService";
import PartLoading from "../../../components/Loading/PartLoading";

const NOTIFICATION_TYPES = {
  booking: {
    icon: "/assets/images/icons/book.png",
    bg: "#E5EEFF",
    color: "#2E5AAC",
  },
  Registration_Successful: {
    icon: "/assets/images/avatar/user-add-line.png",
    bg: "#FFE7D6",
    color: "#E67E22",
  },
  cancel_booking: {
    icon: "/assets/images/icons/report.png",
    bg: "#FFE4E4",
    color: "#E74C3C",
  },
  payment: {
    icon: "/assets/images/icons/payment.png",
    bg: "#E5F8FF",
    color: "#1ABC9C",
  },
  system: {
    icon: "/assets/images/icons/update.png",
    bg: "#ECE3FF",
    color: "#9B59B6",
  },
};

const Notification = () => {
  const {
    pageContainer,
    header,
    headerTitle,
    headerSubtitle,
    notificationList,
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
    emptyState,
    emptyIcon,
    emptyText,
    actionsContainer,
    markAllReadBtn,
    refreshBtn,
    notificationHeader,
    typeBadge,
  } = styles;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const notifications = await notificationService.getNotifications();
      setNotifications(notifications || []);
    } catch (error) {
      console.error("Fetch notifications error:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={pageContainer}>
        <div className={header}>
          <h1 className={headerTitle}>Notifications</h1>
        </div>
        <p className={headerSubtitle}><PartLoading /></p>
      </div>
    );
  }

  return (
    <div className={pageContainer}>
      {/* Header */}
      <div className={header}>
        <div>
          <h1 className={headerTitle}>Notifications</h1>
          <p className={headerSubtitle}>
            {notifications.length} total notifications
          </p>
        </div>

        {notifications.length > 0 && (
          <div className={actionsContainer}>
            <button
              className={refreshBtn}
              onClick={fetchNotifications}
            >
              Refresh
            </button>
            <button
              className={markAllReadBtn}
              onClick={markAllAsRead}
              disabled={notifications.every(n => n.read)}
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>

      {/* Notification List */}
      <div className={notificationList}>
        {notifications.length === 0 ? (
          <div className={emptyState}>
            <div className={emptyIcon}>📭</div>
            <h3 className={emptyText}>No notifications yet</h3>
            <p>We&apos;ll notify you when something arrives</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              className={`${notificationCard} ${!notification.read ? unreadCard : ""
                }`}
              key={notification.id || notification._id}
              onClick={() => !notification.read && markAsRead(notification.id)}
              style={{ cursor: !notification.read ? "pointer" : "default" }}
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
                    {notification.desc || notification.description}
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
                {!notification.read && <div className={unreadDot}></div>}
                <div className={readStatus}>
                  {notification.read ? "Read" : "Unread"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;