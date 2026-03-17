import { FaFilter } from "react-icons/fa";
import styles from "../../WishList.module.css";

const ContentHeader = ({ showFilter, setShowFilter }) => {
  return (
    <div className={styles.contentHeader}>
      <div className={styles.headerText}>
        <h2>Khách sạn yêu thích của bạn</h2>
        <p>Danh sách các khách sạn bạn đã lưu lại để tham khảo sau</p>
      </div>

      {/* Filter Toggle for Mobile */}
      <button
        className={styles.filterToggle}
        onClick={() => setShowFilter(!showFilter)}
      >
        <FaFilter />
        Lọc theo rating
      </button>
    </div>
  );
};

export default ContentHeader;