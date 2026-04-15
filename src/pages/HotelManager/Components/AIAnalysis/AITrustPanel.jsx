import React from "react";
import {
  LABEL_AI_TRUST,
  LABEL_DATA_FLUCTUATION,
  AI_TRUST_COLOR,
  AI_TRUST_DESCRIPTION,
  DATA_STABILITY,
} from "../../Constants/Analysis/aiAnalysisConstants";
import styles from "./AITrustPanel.module.css";

export default function AITrustPanel({ trustLevel = "CAO", isStable = true }) {
  const dotColor = AI_TRUST_COLOR[trustLevel] || "#00e5ff";
  const stability = isStable ? DATA_STABILITY.STABLE : DATA_STABILITY.UNSTABLE;

  return (
    <div className={styles.panel}>
      {/* Trust level */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.dot} style={{ background: dotColor }} />
          <span className={styles.sectionTitle}>{LABEL_AI_TRUST}</span>
        </div>
        <p className={styles.trustLevel} style={{ color: dotColor }}>
          {trustLevel}
        </p>
        <p className={styles.description}>{AI_TRUST_DESCRIPTION}</p>
      </div>

      <div className={styles.divider} />

      {/* Data stability */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>{LABEL_DATA_FLUCTUATION}</p>
        <div className={styles.stabilityRow}>
          <span className={styles.stabilityDot} style={{ background: stability.dot }} />
          <span className={styles.stabilityLabel} style={{ color: stability.color }}>
            {stability.label}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: isStable ? "85%" : "40%", background: stability.dot }}
          />
        </div>
      </div>
    </div>
  );
}
