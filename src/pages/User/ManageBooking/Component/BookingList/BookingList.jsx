import styles from "../../ManageBooking.module.css";
import Loader from "../../../../components/Loading/Loader";
const BookingList = ({
  activeTab,
  loading,
  error,
  fetchAllBookings,
  getStatusConfig
}) => {



  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button
          className={styles.retryButton}
          onClick={fetchAllBookings}
        >
          Thử lại
        </button>
      </div>
    );
  }

  

  return (
    <div className={styles.statusHeader}>
      <div className={styles.statusInfo}>
        {(() => {
          const config = getStatusConfig(activeTab === "active" ? "pending" :
            activeTab === "past" ? "completed" : "cancelled");
          return (
            <>
              <div
                className={styles.statusIndicator}
                style={{
                  backgroundColor: config.bgColor,
                  borderColor: config.borderColor,
                  color: config.color
                }}
              >
                <span className={styles.statusIcon}>{config.icon}</span>
                <span className={styles.statusLabel}>{config.label}</span>
              </div>
              <div className={styles.statusDescription}>
                {activeTab === "active" && "Các đặt phòng đang chờ xác nhận từ khách sạn"}
                {activeTab === "past" && "Các đặt phòng đã được hoàn thành"}
                {activeTab === "cancelled" && "Các đặt phòng đã bị hủy"}
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default BookingList;