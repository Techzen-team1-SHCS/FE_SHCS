import { useEffect, useState } from "react";
import styles from "./Notification.module.css";
import PartLoading from "../../../components/Loading/PartLoading";
import { useNotifications } from "../../Admin/Notification/hooks/useNotifications";
import NotificationCard from "./Components/NotificationCard/NotificationCard";
import PendingHotelCard from "./Components/PendingHotelCard/PendingHotelCard";


const Notification = () => {
  const {
  notifications,
  pendingHotels,
  loading,
  approving,
  fetchAllData,
  markAsRead,
  markAllAsRead,
  approveHotel,
  rejectHotel,
} = useNotifications();
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

  const [rejectReason, setRejectReason] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(null);

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
                disabled={notifications.every(n => n.is_read)}
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
              <PendingHotelCard
    key={hotel.id}
    hotel={hotel}
    approving={approving}
    onApprove={approveHotel}
    onReject={(id) => setShowRejectModal(id)}
  />
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
           <NotificationCard
    key={notification.id}
    notification={notification}
    onRead={markAsRead}
  />
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;