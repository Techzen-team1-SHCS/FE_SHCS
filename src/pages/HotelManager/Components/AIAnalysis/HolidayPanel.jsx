import React from "react";
import {
  LABEL_HOLIDAY,
  LABEL_HOLIDAY_SPECIAL,
  LABEL_NO_HOLIDAY,
} from "../../Constants/Analysis/aiAnalysisConstants";
import { AI_HOLIDAY_EVENTS } from "../../Mock/aiForecastData";
import styles from "./HolidayPanel.module.css";

export default function HolidayPanel({ holidayWarnings = [] }) {
  const events = holidayWarnings.length ? holidayWarnings : AI_HOLIDAY_EVENTS;
  const hasEvents = events && events.length > 0;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.labelTop}>{LABEL_HOLIDAY}</span>
        <span className={styles.calIcon}>📅</span>
      </div>
      <p className={styles.specialTitle}>{LABEL_HOLIDAY_SPECIAL}</p>
      {hasEvents ? (
        <ul className={styles.eventList}>
          {events.map((event, idx) => (
            <li key={idx} className={styles.eventItem}>
              <span className={styles.eventDot} />
              {event}
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.noEventRow}>
          <span className={styles.noEventDot} />
          <span className={styles.noEventText}>{LABEL_NO_HOLIDAY}</span>
        </div>
      )}
    </div>
  );
}
