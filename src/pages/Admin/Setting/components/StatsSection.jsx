import styles from '../SettingPage.module.css';
import { formatCurrency } from '../helpers';

const StatsSection = ({ loading, systemStats }) => {
    return (
        <div className={styles.statsSection}>
            <h2 className={styles.sectionTitle}>📊 Thống kê hệ thống {loading && '(đang tải...)'}</h2>
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>👥</div>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{loading ? '-' : systemStats.totalUsers}</div>
                        <div className={styles.statLabel}>Tổng người dùng</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>🏨</div>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{loading ? '-' : systemStats.totalHotels}</div>
                        <div className={styles.statLabel}>Tổng khách sạn</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>📅</div>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{loading ? '-' : systemStats.totalBookings}</div>
                        <div className={styles.statLabel}>Tổng đặt phòng</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon}>💰</div>
                    <div className={styles.statContent}>
                        <div className={styles.statNumber}>{loading ? '-' : formatCurrency(systemStats.totalRevenue)}</div>
                        <div className={styles.statLabel}>Doanh thu</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsSection;
