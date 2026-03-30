import { FaHeart } from "react-icons/fa";
import styles from "../../WishList.module.css";

const HeroBanner = ({ wishList }) => {
  return (
    <div className={styles.heroBanner}>
      <img
        src="https://cdn6.agoda.net/images/WebCampaign/20251103_ss_doubleday1111/home_banner_web/vi-vn.png"
        alt="Wishlist Banner"
        className={styles.bannerImage}
      />
      <div className={styles.heroOverlay}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Danh sách yêu thích</h1>
          <p className={styles.heroSubtitle}>
            Khám phá những khách sạn bạn đã lưu lại cho chuyến đi sắp tới
          </p>

          <div className={styles.wishlistStats}>
            <div className={styles.statItem}>
              <FaHeart className={styles.statIcon} />
              <span className={styles.statNumber}>{wishList.length}</span>
              <span className={styles.statLabel}>khách sạn đã lưu</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;