import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FiX, FiInfo, FiTag, FiList, FiAlertCircle } from "react-icons/fi";
import { hotelService } from "../../../../services/hotelService";
import { formatVND } from "../../../../utils/dateUtils";
import styles from "./RoomDetailSidebar.module.css";

const RoomDetailSidebar = ({ roomId, isOpen, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && roomId) {
      fetchRoomDetail();
    }
  });

  const fetchRoomDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await hotelService.getRoomDetail(roomId)
      if (response.status && Array.isArray(response.data)) {
        const room = response.data.find(r => r.id === roomId) || response.data[0];
        setData(room);
      } else {
        throw new Error("Không thể lấy dữ liệu phòng");
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải thông tin phòng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "available": return styles.available;
      case "unavailable": return styles.unavailable;
      default: return "";
    }
  };

  return (
    <div className={`${styles.sidebarOverlay} ${isOpen ? styles.open : ""}`} onClick={onClose}>
      <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Room Details #{roomId}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Fetching room details...</p>
          </div>
        ) : error ? (
          <div className={styles.loadingState}>
            <FiAlertCircle size={48} color="#ef4444" />
            <p style={{ marginTop: "16px", color: "#ef4444" }}>{error}</p>
          </div>
        ) : data ? (
          <div className={styles.content}>
            {/* General Info */}
            <section className={styles.section}>
              <h3><FiInfo size={16} /> Basic Information</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>Room Type</label>
                  <span>{data.room_type}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Status</label>
                  <span className={`${styles.statusBadge} ${getStatusClass(data.availability_status)}`}>
                    {data.availability_status}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <label>Price per Night</label>
                  <span style={{ color: "#2563eb", fontWeight: "700" }}>{formatVND(data.price)}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Max Guests</label>
                  <span>{data.max_guest} members</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Quantity</label>
                  <span>{data.quantity} rooms</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Available From</label>
                  <span>{data.available_from}</span>
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section className={styles.section}>
              <h3><FiTag size={16} /> Amenities</h3>
              <div className={styles.amenitiesList}>
                {(() => {
                  let am = data.amenities;
                  if (typeof am === "string" && am.startsWith("[")) {
                    try { am = JSON.parse(am); } catch (e) { am = []; }
                  }
                  
                  if (Array.isArray(am)) {
                    return am.map((item, idx) => (
                      <span key={idx} className={styles.amenityTag}>{item}</span>
                    ));
                  }
                  return <p className={styles.smallText}>No amenities listed</p>;
                })()}
              </div>
            </section>

            {/* Room Numbers */}
            <section className={styles.section}>
              <h3><FiList size={16} /> Room Numbers ({data.room_numbers?.length || 0})</h3>
              <div className={styles.roomNumbersGrid}>
                {data.room_numbers?.length > 0 ? (
                  data.room_numbers.map((num) => (
                    <div key={num.id} className={styles.roomNumberCard}>
                      <span className={styles.numberLabel}>{num.room_number}</span>
                      <span className={`${styles.statusText} ${getStatusClass(num.status)}`}>
                        {num.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#9ca3af", fontStyle: "italic", fontSize: "0.875rem" }}>
                    No room numbers generated yet.
                  </p>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
};

RoomDetailSidebar.propTypes = {
  roomId: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default RoomDetailSidebar;
