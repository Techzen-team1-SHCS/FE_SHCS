import styles from "../../Notification.module.css";
import { NOTIFICATION_TYPES } from "../../Constants/notificationTypes";
import RejectModal from "../RejectModal/RejectModal";

const PendingHotelCard = ({
  hotel,
  approving,
}) => {
  const {
    notificationCard,
    cardLeft,
    iconContainer,
    contentContainer,
    notificationTitle,
    notificationDescription,
    notificationMeta,
    cardRight,
    notificationDate,
    notificationHeader,
    typeBadge,
  } = styles;

  return (
    <div
                className={notificationCard}
                key={hotel.id}
                style={{ border: "2px solid #FFA500", background: "#FFFAF0" }}
              >
                <div className={cardLeft}>
                  <div
                    className={iconContainer}
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

                  <div className={contentContainer}>
                    <div className={notificationHeader}>
                      <h3 className={notificationTitle}>{hotel.name}</h3>
                      <span className={typeBadge} style={{ background: "#FFA500", color: "white" }}>
                        PENDING
                      </span>
                    </div>
                    <p className={notificationDescription}>
                      {hotel.description}
                    </p>
                    <div className={notificationMeta}>
                      <span className={notificationDate}>
                        📍 {hotel.province}
                      </span>
                      <span className={notificationDate} style={{ marginLeft: "15px" }}>
                        👤 {hotel.user?.name || "Unknown Manager"}
                      </span>
                      <span className={notificationDate} style={{ marginLeft: "15px" }}>
                        💰 {hotel.price} VND
                      </span>
                    </div>
                  </div>
                </div>

                <div className={cardRight} style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
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

                <RejectModal
                  showRejectModal={showRejectModal}
                  rejectReason={rejectReason}
                  rejectHotel={rejectHotel}
                  onClose={() => setShowRejectModal(null)}
                />
              </div>
  );
};

export default PendingHotelCard;