import React from "react";
import styles from "../../style.module.css";

const HotelHeroSection = ({ hotelData, galleryImages, reviewStats }) => {

  const backgroundImage = galleryImages?.[0]?.url || "/default-hotel.jpg";

  return (
    <div className={styles.hotelHeroSection}>
      <div
        className={styles.heroBackground}
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url(${backgroundImage})`
        }}
      >
        <div className={styles.heroContent}>

          <h1 className={styles.heroTitle}>
            {hotelData?.name || "Hotel Name"}
          </h1>

          <div className={styles.heroMeta}>

            <span className={styles.heroLocation}>
              <i className="fas fa-map-marker-alt"></i>
              {hotelData?.description || "Location"}
            </span>

            {reviewStats?.averageRating && (
              <span className={styles.heroRating}>
                <i className="fas fa-star rating-star"></i>

                <span>{reviewStats.averageRating.toFixed(1)}</span>

                <span className="rating-count">
                  ({reviewStats.totalReviews} đánh giá)
                </span>
              </span>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default React.memo(HotelHeroSection);