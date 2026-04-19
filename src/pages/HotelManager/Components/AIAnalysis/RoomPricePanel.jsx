import React from "react";
import {
  LABEL_PRICE_ADVICE,
  LABEL_OCCUPANCY_TARGET,
  LABEL_PRICE_CTA,
} from "../../Constants/Analysis/aiAnalysisConstants";
import styles from "./RoomPricePanel.module.css";

export default function RoomPricePanel({ occupancyTarget = "61.1%", dynamicPricing = "" }) {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.labelTop}>{LABEL_PRICE_ADVICE}</span>
        <span className={styles.tagIcon}>🏷️</span>
      </div>
      <p className={styles.value}>{occupancyTarget}</p>
      <p className={styles.subLabel}>{LABEL_OCCUPANCY_TARGET}</p>
      <button className={styles.ctaBtn}>{dynamicPricing || LABEL_PRICE_CTA}</button>
    </div>
  );
}
