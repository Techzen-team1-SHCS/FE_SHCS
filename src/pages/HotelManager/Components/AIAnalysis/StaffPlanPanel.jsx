import React from "react";
import {
  LABEL_STAFF_PLAN,
  LABEL_HOUSEKEEPING,
  LABEL_RECEPTION,
  LABEL_ROOMS_FORECAST,
  LABEL_STAFF_UNIT,
  LABEL_SHIFT_UNIT,
} from "../../Constants/Analysis/aiAnalysisConstants";
import { AI_STAFF_PLAN } from "../../Mock/aiForecastData";
import styles from "./StaffPlanPanel.module.css";

export default function StaffPlanPanel() {
  const { totalRooms, housekeeping, receptionPerShift } = AI_STAFF_PLAN;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.labelTop}>{LABEL_STAFF_PLAN}</span>
        <span className={styles.staffIcon}>👥</span>
      </div>
      <div className={styles.totalRow}>
        <span className={styles.totalNumber}>{totalRooms}</span>
        <span className={styles.totalLabel}>{LABEL_ROOMS_FORECAST}</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.staffRow}>
        <span className={styles.staffName}>{LABEL_HOUSEKEEPING}</span>
        <span className={styles.staffValue}>
          {housekeeping} <span className={styles.unit}>{LABEL_STAFF_UNIT}</span>
        </span>
      </div>
      <div className={styles.staffRow}>
        <span className={styles.staffName}>{LABEL_RECEPTION}</span>
        <span className={styles.staffValue}>
          {receptionPerShift} <span className={styles.unit}>{LABEL_SHIFT_UNIT}</span>
        </span>
      </div>
    </div>
  );
}
