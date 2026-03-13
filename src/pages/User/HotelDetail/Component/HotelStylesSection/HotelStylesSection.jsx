import React from "react";
import styles from "../../style.module.css";

const HotelStylesSection = ({ styleArray = [] }) => {

  return (
    <div className={styles.stylesSection}>

      {/* Title */}
      <h2 className={styles.title}>
        Phong cách
      </h2>

      {/* Styles List */}
      <div className={styles.stylesList}>
        {styleArray.map((style, index) => (
          <div key={index} className={styles.stylePill}>

            <div className={styles.styleIcon}>
              <i className="fas fa-palette" />
            </div>

            <span className={styles.styleLabel}>
              {style.style}
            </span>

          </div>
        ))}
      </div>

    </div>
  );
};

export default React.memo(HotelStylesSection);