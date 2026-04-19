import styles from "../Notification.module.css";
import { NOTIFICATION_TYPES } from '../constants';
import RejectHotelModal from './RejectHotelModal';

const PendingHotelCard = ({
  hotel,
  approving,
  approveHotel,
  showRejectModal,
  setShowRejectModal,
  rejectReason,
  setRejectReason,
  rejectHotel
}) => {
  return (
    <div
      className={styles.notificationCard}
      style={{ border: "2px solid #FFA500", background: "#FFFAF0" }}
    >
      <div className={styles.cardLeft}>
        <div
          className={styles.iconContainer}
          style={{
            backgroundColor: NOTIFICATION_TYPES.hotel_pending.bg,
            color: NOTIFICATION_TYPES.hotel_pending.color,
          }}
        >
          <img
            src={NOTIFICATION_TYPES.hotel_pending.icon}
            alt="pending"
          />
        </div>

        <div className={styles.contentContainer}>
          <div className={styles.notificationHeader}>
            <h3 className={styles.notificationTitle}>{hotel.name}</h3>
            <span className={styles.typeBadge} style={{ background: "#FFA500", color: "white" }}>
              PENDING
            </span>
          </div>
          <p className={styles.notificationDescription}>
            {hotel.description}
          </p>
          <div className={styles.notificationMeta}>
            <span className={styles.notificationDate}>
              📍 {hotel.province}
            </span>
            <span className={styles.notificationDate} style={{ marginLeft: "15px" }}>
              👤 {hotel.user?.name || "Unknown Manager"}
            </span>
            <span className={styles.notificationDate} style={{ marginLeft: "15px" }}>
              💰 {hotel.price} VND
            </span>
          </div>
        </div>
      </div>

      <div className={styles.cardRight} style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
        <button
          onClick={() => approveHotel(hotel.id)}
          disabled={approving === hotel.id}
          style={{
            padding: "8px 16px",
            background: "#27AE60",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: approving === hotel.id ? "not-allowed" : "pointer",
            opacity: approving === hotel.id ? 0.7 : 1,
            fontSize: "12px",
            fontWeight: "600"
          }}
        >
          {approving === hotel.id ? "Approving..." : "✓ Approve"}
        </button>
        <button
          onClick={() => setShowRejectModal(hotel.id)}
          disabled={approving === hotel.id}
          style={{
            padding: "8px 16px",
            background: "#E74C3C",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: approving === hotel.id ? "not-allowed" : "pointer",
            opacity: approving === hotel.id ? 0.7 : 1,
            fontSize: "12px",
            fontWeight: "600"
          }}
        >
          ✕ Reject
        </button>
      </div>

      {showRejectModal === hotel.id && (
        <RejectHotelModal
          hotel={hotel}
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
          rejectHotel={rejectHotel}
          setShowRejectModal={setShowRejectModal}
        />
      )}
    </div>
  );
};

export default PendingHotelCard;
