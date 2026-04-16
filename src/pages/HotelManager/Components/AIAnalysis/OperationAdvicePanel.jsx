import React from "react";
import {
  AI_OPERATION_ADVICE_TITLE,
  AI_OPERATION_ADVICE_BODY,
  AI_OPERATION_ADVICE_QUOTE,
} from "../../Constants/Analysis/aiAnalysisConstants";
import styles from "./OperationAdvicePanel.module.css";

export default function OperationAdvicePanel() {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.icon}>💡</span>
        <span className={styles.title}>{AI_OPERATION_ADVICE_TITLE}</span>
      </div>
      <p className={styles.body}>{AI_OPERATION_ADVICE_BODY}</p>
      <blockquote className={styles.quote}>{AI_OPERATION_ADVICE_QUOTE}</blockquote>
    </div>
  );
}
