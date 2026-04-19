import styles from "../Notification.module.css";
import NotificationHeader from '../components/NotificationHeader';
import PendingHotelCard from '../components/PendingHotelCard';
import NotificationCard from '../components/NotificationCard';
import NotificationEmptyState from '../components/NotificationEmptyState';
import PartLoading from "../../../../components/Loading/PartLoading";

const NotificationMain = ({
  loading,
  notifications,
  pendingHotels,
  approving,
  rejectReason,
  showRejectModal,
  setRejectReason,
  setShowRejectModal,
  fetchAllData,
  markAllAsRead,
  markAsRead,
  approveHotel,
  rejectHotel
}) => {

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Notifications</h1>
        </div>
        <p className={styles.headerSubtitle}><PartLoading /></p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <NotificationHeader
        notifications={notifications}
        pendingHotels={pendingHotels}
        fetchAllData={fetchAllData}
        markAllAsRead={markAllAsRead}
      />

      {/* Pending Hotels Section */}
      {pendingHotels.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px", color: "#333" }}>
            ⏳ Pending Hotel Approvals ({pendingHotels.length})
          </h2>
          <div className={styles.notificationList}>
            {pendingHotels.map((hotel) => (
              <PendingHotelCard
                key={hotel.id}
                hotel={hotel}
                approving={approving}
                approveHotel={approveHotel}
                showRejectModal={showRejectModal}
                setShowRejectModal={setShowRejectModal}
                rejectReason={rejectReason}
                setRejectReason={setRejectReason}
                rejectHotel={rejectHotel}
              />
            ))}
          </div>
        </div>
      )}

      {/* Notification List */}
      <div className={styles.notificationList}>
        {notifications.length === 0 ? (
          <NotificationEmptyState />
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id || notification._id}
              notification={notification}
              markAsRead={markAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationMain;
