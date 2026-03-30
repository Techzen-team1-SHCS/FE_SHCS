import styles from "../../style.module.css";
import React from "react";
const RoomTypesSection = ({ roomArray = [], galleryImages = [] }) => {

  return (
    <div className={styles.roomTypesSection}>

      {/* Header */}
      <div className={styles.roomTypesHeader}>
        <h2 className={styles.roomTypesTitle}>
          Loại phòng
        </h2>

        <span className={styles.roomTypesCount}>
          {roomArray.length} loại phòng
        </span>
      </div>


      {/* Room Grid */}
      <div className={styles.roomTypesGrid}>

        {roomArray.map((room, index) => (
          <div key={index} className={styles.roomCard}>

            <div className={styles.roomImage}>
              <img
                src={galleryImages[index + 1]?.url || "/default-room.jpg"}
                alt={room.room_type}
              />
            </div>

            <div className={styles.roomCardBody}>

              <h3 className={styles.roomCardTitle}>
                {room.room_type}
              </h3>

              <div className={styles.roomCardFooter}>

                <div>
                  <div className={styles.roomPriceLabel}>
                    Giá mỗi đêm
                  </div>

                  <div className={styles.roomPrice}>
                    {Number(room.price).toLocaleString("vi-VN")}₫
                  </div>
                </div>

                <button className={styles.btnPrimary}>
                  Đặt ngay
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default React.memo(RoomTypesSection);