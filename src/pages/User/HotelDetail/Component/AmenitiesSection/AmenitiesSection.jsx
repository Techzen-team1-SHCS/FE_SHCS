import React from "react";
import styles from "../../style.module.css";
import AmenityIcon from "../Amenities/AmenityIcon";

const AmenitiesSection = ({ amenitiesArray = [] }) => {

  const visibleAmenities = amenitiesArray.slice(0, 8);
  const hiddenCount = amenitiesArray.length - 8;

  return (
    <div className={styles.amenitiesSection}>

      {/* Title */}
      <h2 className={styles.title}>
        Tiện nghi nổi bật
      </h2>

      {/* Amenities Grid */}
      <div className={styles.amenitiesGrid}>
        {visibleAmenities.map((amenity, index) => (
          <div key={index} className={styles.amenityItem}>

            <div className={styles.amenityIcon}>
              <AmenityIcon
                amenityName={amenity}
                style={{ color: "white" }}
              />
            </div>

            <span className={styles.amenityLabel}>
              {amenity}
            </span>

          </div>
        ))}
      </div>


      {/* Show More */}
      {hiddenCount > 0 && (
        <div className={styles.showMoreWrapper}>
          <button className={styles.btnShowMore}>
            Xem thêm {hiddenCount} tiện nghi
          </button>
        </div>
      )}

    </div>
  );
};

export default React.memo(AmenitiesSection);