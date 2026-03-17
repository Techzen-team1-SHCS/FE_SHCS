import { FaHeart, FaStar } from "react-icons/fa";
import styles from "../../WishList.module.css";

const QuickActions = ({ navigate }) => {
  return (
    <div className={styles.quickActions}>
      <h3>Thao tác nhanh</h3>
      <div className={styles.actionButtons}>
        <button
          className={styles.quickAction}
          onClick={() => navigate("/HotelList")}
        >
          <FaHeart className={styles.actionIcon} />
          <span>Thêm khách sạn yêu thích</span>
        </button>

        <button
          className={styles.quickAction}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <FaStar className={styles.actionIcon} />
          <span>Lên đầu trang</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;