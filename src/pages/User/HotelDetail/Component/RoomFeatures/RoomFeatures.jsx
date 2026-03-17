import React from "react";
import styles from "../../style.module.css";
import { ROOM_FEATURES } from "../../Constants/roomFeatures.js";
import { getRoomFeatureValue } from "../../Helpers/roomFeaturesHelper.js";

const RoomFeatures = ({ room }) => {
  return (
    <div className={styles.roomFeatures}>
      {ROOM_FEATURES.map((feature) => (
        <div key={feature.key} className={styles.featureItem}>
          <div className={styles.icon}>{feature.icon}</div>
          <div className={styles.label}>{feature.label}</div>
          <div className={styles.value}>
            {getRoomFeatureValue(feature.key, room)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(RoomFeatures);