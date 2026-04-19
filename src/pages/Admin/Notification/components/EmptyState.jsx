import React from 'react';
import styles from '../Notification.module.css';

const EmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>📭</div>
      <h3 className={styles.emptyText}>No notifications yet</h3>
      <p>We'll notify you when something arrives</p>
    </div>
  );
};

export default EmptyState;
