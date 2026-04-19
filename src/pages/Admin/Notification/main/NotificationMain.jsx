import React from 'react';
import styles from '../Notification.module.css';
import PartLoading from '../../../../components/Loading/PartLoading';
import { useNotifications } from '../hooks/useNotifications';
import NotificationHeader from '../Components/NotificationHeader';
import PendingHotelCard from '../Components/PendingHotelCard';
import NotificationItem from '../Components/NotificationItem';
import RejectHotelModal from '../Components/RejectHotelModal';
import EmptyState from '../Components/EmptyState';

const NotificationMain = () => {
  const {
    notifications,
    pendingHotels,
    loading,
    approving,
    rejectReason,
    setRejectReason,
    showRejectModal,
    setShowRejectModal,
    fetchAllData,
    markAsRead,
    markAllAsRead,
    approveHotel,
    rejectHotel
  } = useNotifications();

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
        pendingHotelsCount={pendingHotels.length}
        notificationsCount={notifications.length}
        fetchAllData={fetchAllData}
        markAllAsRead={markAllAsRead}
        allRead={notifications.every(n => n.is_read)}
      />

      {/* Pending Hotels Section */}
      {pendingHotels.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "15px", color: "#333" }}>
            ⏳ Pending Hotel Approvals ({pendingHotels.length})
          </h2>
          <div className={styles.notificationList}>
            {pendingHotels.map((hotel) => (
              <React.Fragment key={hotel.id}>
                <PendingHotelCard 
                  hotel={hotel}
                  approving={approving}
                  approveHotel={approveHotel}
                  setShowRejectModal={setShowRejectModal}
                />
                
                {showRejectModal === hotel.id && (
                  <RejectHotelModal 
                    hotel={hotel}
                    rejectReason={rejectReason}
                    setRejectReason={setRejectReason}
                    rejectHotel={rejectHotel}
                    setShowRejectModal={setShowRejectModal}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Notification List */}
      <div className={styles.notificationList}>
        {notifications.length === 0 ? (
          <EmptyState />
        ) : (
          notifications.map((notification) => (
            <NotificationItem 
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
