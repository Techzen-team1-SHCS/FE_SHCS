import PartLoading from "../../../../components/Loading/PartLoading";
import styles from "../Notification.module.css";
import { useNotification } from "../hooks/useNotification";
import NotificationHeader from "../components/NotificationHeader";
import PendingHotelList from "../components/PendingHotelList";
import NotificationList from "../components/NotificationList";

const NotificationMain = () => {
  const {
    notifications,
    pendingHotels,
    loading,
    approving,
    rejectReason,
    showRejectModal,
    setShowRejectModal,
    handleRejectReasonChange,
    fetchAllData,
    markAsRead,
    markAllAsRead,
    approveHotel,
    rejectHotel
  } = useNotification();

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

  const allRead = notifications.every(n => n.is_read);

  return (
    <div className={styles.pageContainer}>
      <NotificationHeader
        pendingHotelsCount={pendingHotels.length}
        notificationsCount={notifications.length}
        onRefresh={fetchAllData}
        onMarkAllAsRead={markAllAsRead}
        canMarkAllAsRead={!allRead}
      />

      <PendingHotelList
        hotels={pendingHotels}
        approving={approving}
        rejectReason={rejectReason}
        showRejectModal={showRejectModal}
        onApprove={approveHotel}
        onReject={rejectHotel}
        onShowRejectModal={setShowRejectModal}
        onRejectReasonChange={handleRejectReasonChange}
      />

      <NotificationList
        notifications={notifications}
        onMarkAsRead={markAsRead}
      />
    </div>
  );
};

export default NotificationMain;
