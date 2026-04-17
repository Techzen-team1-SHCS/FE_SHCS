import styles from '../../ManageBooking.module.css';
const BookingStats = ({ stats, activeTab, setActiveTab }) => {

    return (
        <div className={styles.statsGrid}>
            <div
                className={`${styles.statCard} ${activeTab === "active" ? styles.activeStatCard : ''}`}
                onClick={() => setActiveTab("active")}
            >
                <div className={styles.statCardContent}>
                    <div className={styles.statCardIcon} style={{ background: '#FFF9E6', color: '#FFA500' }}>⏳</div>
                    <div className={styles.statCardInfo}>
                        <div className={styles.statCardNumber}>{stats.active}</div>
                        <div className={styles.statCardLabel}>Đang chờ</div>
                    </div>
                    {stats.active > 0 && (
                        <div className={styles.pulseIndicator}></div>
                    )}
                </div>
            </div>

            <div
                className={`${styles.statCard} ${activeTab === "past" ? styles.activeStatCard : ''}`}
                onClick={() => setActiveTab("past")}
            >
                <div className={styles.statCardContent}>
                    <div className={styles.statCardIcon} style={{ background: '#ECFDF5', color: '#10B981' }}>✅</div>
                    <div className={styles.statCardInfo}>
                        <div className={styles.statCardNumber}>{stats.past}</div>
                        <div className={styles.statCardLabel}>Hoàn thành</div>
                    </div>
                </div>
            </div>

            <div
                className={`${styles.statCard} ${activeTab === "cancelled" ? styles.activeStatCard : ''}`}
                onClick={() => setActiveTab("cancelled")}
            >
                <div className={styles.statCardContent}>
                    <div className={styles.statCardIcon} style={{ background: '#FEF2F2', color: '#EF4444' }}>❌</div>
                    <div className={styles.statCardInfo}>
                        <div className={styles.statCardNumber}>{stats.cancelled}</div>
                        <div className={styles.statCardLabel}>Đã hủy</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingStats;