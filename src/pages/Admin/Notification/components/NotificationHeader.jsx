import React from 'react';
import styles from '../Notification.module.css';

const NotificationHeader = ({
  pendingHotelsCount,
  notificationsCount,
  fetchAllData,
  markAllAsRead,
  allRead
}) => {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.headerTitle}>Notifications</h1>
        <p className={styles.headerSubtitle}>
          {pendingHotelsCount > 0 && `${pendingHotelsCount} hotels pending approval • `}
          {notificationsCount} total notifications
        </p>
      </div>

      {(notificationsCount > 0 || pendingHotelsCount > 0) && (
        <div className={styles.actionsContainer}>
          <button
            className={styles.refreshBtn}
            onClick={fetchAllData}
          >
            Refresh
          </button>
          {notificationsCount > 0 && (
            <button
              className={styles.markAllReadBtn}
              onClick={markAllAsRead}
              disabled={allRead}
            >
              Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationHeader;
