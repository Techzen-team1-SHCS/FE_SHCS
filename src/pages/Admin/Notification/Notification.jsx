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
  hotel_approved: {
    icon: "/assets/images/icons/checked.png",
    bg: "#E8F5E9",
    color: "#2E7D32",
  },
  hotel_rejected: {
    icon: "/assets/images/icons/delete.png",
    bg: "#FFEBEE",
    color: "#C62828",
  },
  hotel_pending: {
    icon: "/assets/images/icons/new-hotel.png",
    bg: "#FFF3E0",
    color: "#E65100",
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
  const [pendingHotels, setPendingHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [rejectReason, setRejectReason] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const [notificationsData, hotelsData] = await Promise.all([
        notificationService.getNotifications(),
        notificationService.getPendingHotels()
      ]);

      setNotifications(notificationsData || []);
      setPendingHotels(hotelsData || []);
    } catch (error) {
      console.error("Fetch data error:", error);
      setNotifications([]);
      setPendingHotels([]);
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

  const approveHotel = async (hotelId) => {
    try {
      setApproving(hotelId);
      await notificationService.approveHotel(hotelId);
      setPendingHotels(prev => prev.filter(h => h.id !== hotelId));

      // Refresh notifications to show the approval notification
      const notificationsData = await notificationService.getNotifications();
      setNotifications(notificationsData || []);
    } catch (error) {
      console.error("Approve hotel error:", error);
      alert("Lỗi duyệt khách sạn: " + (error.response?.data?.message || error.message));
    } finally {
      setApproving(null);
    }
  };

  const rejectHotel = async (hotelId) => {
    try {
      setApproving(hotelId);
      const reason = rejectReason[hotelId] || "Admin không chấp nhận";
      await notificationService.rejectHotel(hotelId, reason);
      setPendingHotels(prev => prev.filter(h => h.id !== hotelId));
      setShowRejectModal(null);

      // Refresh notifications to show the rejection notification
      const notificationsData = await notificationService.getNotifications();
      setNotifications(notificationsData || []);
    } catch (error) {
      console.error("Reject hotel error:", error);
      alert("Lỗi từ chối khách sạn: " + (error.response?.data?.message || error.message));
    } finally {
      setApproving(null);
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
            {pendingHotels.length > 0 && `${pendingHotels.length} hotels pending approval • `}
            {notifications.length} total notifications
          </p>
        </div>

        {(notifications.length > 0 || pendingHotels.length > 0) && (
          <div className={actionsContainer}>
            <button
              className={refreshBtn}
              onClick={fetchAllData}
            >
              Refresh
            </button>
            {notifications.length > 0 && (
              <button
                className={markAllReadBtn}
                onClick={markAllAsRead}
                disabled={notifications.every(n => n.read)}
              >
                Mark all as read
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pending Hotels Section */}
      {pendingHotels.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px", color: "#333" }}>
            ⏳ Pending Hotel Approvals ({pendingHotels.length})
          </h2>
          <div className={notificationList}>
            {pendingHotels.map((hotel) => (
              <div
                className={notificationCard}
                key={hotel.id}
                style={{ border: "2px solid #FFA500", background: "#FFFAF0" }}
              >
                <div className={cardLeft}>
                  <div
                    className={iconContainer}
                    style={{
                      backgroundColor: NOTIFICATION_TYPES.hotel_pending.bg,
                      color: NOTIFICATION_TYPES.hotel_pending.color,
                    }}
                  >
                    <img
                      src={NOTIFICATION_TYPES.hotel_pending.icon}
                      alt="pending"
                    />
                  </div>

                  <div className={contentContainer}>
                    <div className={notificationHeader}>
                      <h3 className={notificationTitle}>{hotel.name}</h3>
                      <span className={typeBadge} style={{ background: "#FFA500", color: "white" }}>
                        PENDING
                      </span>
                    </div>
                    <p className={notificationDescription}>
                      {hotel.description}
                    </p>
                    <div className={notificationMeta}>
                      <span className={notificationDate}>
                        📍 {hotel.province}
                      </span>
                      <span className={notificationDate} style={{ marginLeft: "15px" }}>
                        👤 {hotel.user?.name || "Unknown Manager"}
                      </span>
                      <span className={notificationDate} style={{ marginLeft: "15px" }}>
                        💰 {hotel.price} VND
                      </span>
                    </div>
                  </div>
                </div>

                <div className={cardRight} style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
                  <button
                    onClick={() => approveHotel(hotel.id)}
                    disabled={approving === hotel.id}
                    style={{
                      padding: "8px 16px",
                      background: "#27AE60",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: approving === hotel.id ? "not-allowed" : "pointer",
                      opacity: approving === hotel.id ? 0.7 : 1,
                      fontSize: "12px",
                      fontWeight: "600"
                    }}
                  >
                    {approving === hotel.id ? "Approving..." : "✓ Approve"}
                  </button>
                  <button
                    onClick={() => setShowRejectModal(hotel.id)}
                    disabled={approving === hotel.id}
                    style={{
                      padding: "8px 16px",
                      background: "#E74C3C",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: approving === hotel.id ? "not-allowed" : "pointer",
                      opacity: approving === hotel.id ? 0.7 : 1,
                      fontSize: "12px",
                      fontWeight: "600"
                    }}
                  >
                    ✕ Reject
                  </button>
                </div>

                {showRejectModal === hotel.id && (
                  <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                  }}>
                    <div style={{
                      background: "white",
                      padding: "24px",
                      borderRadius: "8px",
                      maxWidth: "400px",
                      width: "90%"
                    }}>
                      <h3 style={{ marginBottom: "12px" }}>Reject Hotel</h3>
                      <p style={{ marginBottom: "12px", color: "#666" }}>
                        Please provide a reason for rejecting {hotel.name}:
                      </p>
                      <textarea
                        value={rejectReason[hotel.id] || ""}
                        onChange={(e) => setRejectReason(prev => ({
                          ...prev,
                          [hotel.id]: e.target.value
                        }))}
                        placeholder="Reason for rejection..."
                        style={{
                          width: "100%",
                          minHeight: "100px",
                          padding: "8px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          marginBottom: "12px",
                          fontFamily: "inherit"
                        }}
                      />
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => rejectHotel(hotel.id)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            background: "#E74C3C",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "600"
                          }}
                        >
                          Confirm Rejection
                        </button>
                        <button
                          onClick={() => setShowRejectModal(null)}
                          style={{
                            flex: 1,
                            padding: "10px",
                            background: "#95A5A6",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontWeight: "600"
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

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