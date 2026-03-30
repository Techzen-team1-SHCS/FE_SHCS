import { FaRegHeart } from "react-icons/fa";
import Button from "../../../../../components/Button/Button";
import styles from "../../WishList.module.css";

const EmptyWishlist = ({ navigate }) => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyHeart}>
        <FaRegHeart size={64} />
      </div>

      <h3>Chưa có khách sạn yêu thích</h3>
      <p>Hãy khám phá và lưu lại những khách sạn bạn yêu thích</p>

      <Button
        onClick={() => navigate("/HotelList")}
        props="Khám phá khách sạn ngay"
        className={styles.exploreButton}
      />
    </div>
  );
};

export default EmptyWishlist;