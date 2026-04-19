import styles from "../Notification.module.css";

const NotificationEmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>📭</div>
      <h3 className={styles.emptyText}>No notifications yet</h3>
      <p>We&apos;ll notify you when something arrives</p>
    </div>
  );
};

export default NotificationEmptyState;
