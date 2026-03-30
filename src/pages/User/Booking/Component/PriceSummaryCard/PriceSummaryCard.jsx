import styles from "../../Booking.module.css";

const PriceSummaryCard = ({ hotel, bookingPrice, hasDiscount, displayPrice }) => {
  return (
    <div className={styles.card}>
      <h4 className={styles.cardTitle}>Tóm tắt giá</h4>

      <div className={styles.roomType}>{hotel?.room?.room_type}</div>

      <div
        className={styles.originalPrice}
        style={{
          textDecoration: hasDiscount ? "line-through" : "none",
          color: hasDiscount ? "#999" : "#333",
          fontSize: hasDiscount ? "14px" : "20px",
        }}
      >
        Giá gốc: {Number(bookingPrice.originalPrice).toLocaleString("vi-VN")} VND
      </div>

      {hasDiscount ? (
        <>
          <div
            className={styles.discountInfo}
            style={{
              color: "#ff6b6b",
              fontSize: "14px",
              marginTop: "8px",
              fontWeight: "bold",
            }}
          >
            Giảm giá: -
            {Number(bookingPrice.discountAmount).toLocaleString("vi-VN")} VND
          </div>

          <div
            className={styles.finalPrice}
            style={{
              color: "#51cf66",
              fontSize: "20px",
              marginTop: "8px",
              fontWeight: "bold",
            }}
          >
            Tổng cuối: {Number(displayPrice).toLocaleString("vi-VN")} VND
          </div>
        </>
      ) : (
        <div
          className={styles.price}
          style={{
            fontSize: "20px",
            marginTop: "8px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          {Number(displayPrice).toLocaleString("vi-VN")} VND
        </div>
      )}

      <div className={styles.note}>Đã bao gồm thuế và phí</div>
    </div>
  );
};

export default PriceSummaryCard;