import { formatDateTime, getNights } from "../../../../../utils/dateUtils";
import styles from "../../Booking.module.css";

const BookingDetailCard = ({ hotel }) => {
  return (
    <div className={styles.card}>
      <h4 className={styles.cardTitle}>Chi tiết đặt phòng của bạn</h4>

      <div className={styles.row}>
        <span className={styles.weight}>Nhận phòng:</span>
        <span>{formatDateTime(hotel.check_in)}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.weight}>Trả phòng:</span>
        <span>{formatDateTime(hotel.check_out)}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.weight}>Tổng thời gian lưu trú:</span>
        <span>{getNights(hotel.check_in, hotel.check_out)} đêm</span>
      </div>
    </div>
  );
};

export default BookingDetailCard;