import styles from "../../Booking.module.css";

const BookingConditionCard = () => {
  return (
    <div className={styles.card}>
      <h4 className={styles.cardTitle}>Xem lại điều kiện đặt phòng</h4>

      <div className={styles.subTitle}>Ưu Đãi Từ Đối Tác</div>

      <ul className={styles.list}>
        <li>Bạn sẽ thanh toán bảo mật hôm nay với SHCS.com</li>
        <li>
          Các thay đổi liên quan đến thông tin cá nhân hay thông tin đặt phòng
          đều không khả thi sau khi đặt phòng đã hoàn tất
        </li>
        <li>Công ty đối tác của chúng tôi sẽ là bên xuất hoá đơn</li>
      </ul>
    </div>
  );
};

export default BookingConditionCard;