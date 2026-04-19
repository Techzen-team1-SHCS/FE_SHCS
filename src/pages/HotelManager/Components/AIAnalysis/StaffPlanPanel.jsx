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

function parseStaffingText(staffing = "") {
  const houseMatch = staffing.match(/(\d+)\s*nhân\s*viên\s*dọn\s*phòng/i);
  const recepMatch = staffing.match(/(\d+)\s*lễ\s*tân\s*\/\s*ca/i);

  return {
    housekeeping: houseMatch ? Number(houseMatch[1]) : null,
    receptionPerShift: recepMatch ? Number(recepMatch[1]) : null,
  };
}

export default function StaffPlanPanel({ staffing = "", peakForecast = 0 }) {
  const parsed = parseStaffingText(staffing);
  const { housekeeping, receptionPerShift } = AI_STAFF_PLAN;

  const totalRooms = peakForecast || AI_STAFF_PLAN.totalRooms;
  const finalHousekeeping = parsed.housekeeping ?? housekeeping;
  const finalReception = parsed.receptionPerShift ?? receptionPerShift;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.labelTop}>{LABEL_STAFF_PLAN}</span>
        <span className={styles.staffIcon}>👥</span>
      </div>
      <div className={styles.totalRow}>
        <span className={styles.totalNumber}>{Math.round(totalRooms)}</span>
        <span className={styles.totalLabel}>{LABEL_ROOMS_FORECAST}</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.staffRow}>
        <span className={styles.staffName}>{LABEL_HOUSEKEEPING}</span>
        <span className={styles.staffValue}>
          {finalHousekeeping} <span className={styles.unit}>{LABEL_STAFF_UNIT}</span>
        </span>
      </div>
      <div className={styles.staffRow}>
        <span className={styles.staffName}>{LABEL_RECEPTION}</span>
        <span className={styles.staffValue}>
          {finalReception} <span className={styles.unit}>{LABEL_SHIFT_UNIT}</span>
        </span>
      </div>
    </div>
  );
}
