import styles from "../../ManageBooking.module.css";

const QuickActions = ({ navigate }) => {
    return (
        <div className={styles.quickActions}>
            <h3 className={styles.quickActionsTitle}>Thao tác nhanh</h3>
            <div className={styles.quickActionsGrid}>
                <button
                    className={styles.quickAction}
                    onClick={() => navigate('/HotelList')}
                >
                    <span className={styles.quickActionIcon}>🏨</span>
                    <span className={styles.quickActionText}>Đặt thêm phòng</span>
                </button>
                <button
                    className={styles.quickAction}
                    onClick={() => window.print()}
                >
                    <span className={styles.quickActionIcon}>🖨️</span>
                    <span className={styles.quickActionText}>In danh sách</span>
                </button>
                <button
                    className={styles.quickAction}
                    onClick={() => navigate('/profile')}
                >
                    <span className={styles.quickActionIcon}>👤</span>
                    <span className={styles.quickActionText}>Hồ sơ của tôi</span>
                </button>
            </div>
        </div>
    );
};

export default QuickActions;