import { FaDoorOpen, FaHotel, FaCalendarAlt } from "react-icons/fa";
import { formatDateTime, getNights } from "../../../../../utils/dateUtils";
import styles from "../../Booking.module.css";

const BookingDetailCard = ({ hotel }) => {
  return (
    <div className={styles.card}>
      <h4 className={styles.cardTitle}>Chi tiết đặt phòng của bạn</h4>

      <div className={styles.row}>
        <span className={styles.weight}><FaCalendarAlt style={{marginRight: '8px'}} />Nhận phòng:</span>
        <span>{formatDateTime(hotel.check_in)}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.weight}><FaCalendarAlt style={{marginRight: '8px'}} />Trả phòng:</span>
        <span>{formatDateTime(hotel.check_out)}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.weight}><FaHotel style={{marginRight: '8px'}} />Số lượng phòng:</span>
        <span>{hotel.quantity} phòng</span>
      </div>

      {hotel.selected_room_numbers && (
        <div className={styles.row}>
          <span className={styles.weight}><FaDoorOpen style={{marginRight: '8px'}} />Số hiệu phòng:</span>
          <span className={styles.roomBadge}>{hotel.selected_room_numbers}</span>
        </div>
      )}

      <div className={styles.row} style={{borderTop: '1px solid #eee', paddingTop: '8px', marginTop: '8px'}}>
        <span className={styles.weight}>Tổng thời gian lưu trú:</span>
        <span>{getNights(hotel.check_in, hotel.check_out)} đêm</span>
      </div>
    </div>
  );
};

export default BookingDetailCard;