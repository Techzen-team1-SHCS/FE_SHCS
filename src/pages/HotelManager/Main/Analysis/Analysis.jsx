import React from "react";
import styles from "./Analysis.module.css";
import { useAIAnalysis } from "../../hooks/useAIAnalysis";
import ForecastChart from "../../Components/AIAnalysis/ForecastChart";
import AITrustPanel from "../../Components/AIAnalysis/AITrustPanel";
import OperationAdvicePanel from "../../Components/AIAnalysis/OperationAdvicePanel";
import RoomPricePanel from "../../Components/AIAnalysis/RoomPricePanel";
import StaffPlanPanel from "../../Components/AIAnalysis/StaffPlanPanel";
import HolidayPanel from "../../Components/AIAnalysis/HolidayPanel";
import {
  LABEL_RUN,
  LABEL_PERIOD,
  LABEL_SUB_TITLE,
} from "../../Constants/Analysis/aiAnalysisConstants";

export default function Analysis() {
  const {
    selectedPeriod,
    isRunning,
    chartData,
    peakForecast,
    occupancyTarget,
    handleRun,
    handlePeriodChange,
    periodOptions,
  } = useAIAnalysis();

  return (
    <div className={styles.page}>
      {/* ── Top bar ── */}
      <div className={styles.topBar}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>Thống Kê Dự Báo Lượng Khách AI</h1>
          <p className={styles.pageSubtitle}>{LABEL_SUB_TITLE}</p>
        </div>

        <div className={styles.controls}>
          <span className={styles.periodLabel}>{LABEL_PERIOD}</span>
          <select
            className={styles.periodSelect}
            value={selectedPeriod.value}
            onChange={(e) => {
              const opt = periodOptions.find((o) => o.value === e.target.value);
              if (opt) handlePeriodChange(opt);
            }}
          >
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            id="ai-run-btn"
            className={styles.runBtn}
            onClick={handleRun}
            disabled={isRunning}
          >
            <span className={styles.runIcon}>▶</span>
            {isRunning ? "Đang chạy…" : LABEL_RUN}
          </button>
        </div>
      </div>

      {/* ── Main 2-column grid ── */}
      <div className={styles.mainGrid}>
        {/* Left: Forecast chart */}
        <div className={styles.leftCol}>
          <ForecastChart data={chartData} peakForecast={peakForecast} />
        </div>

        {/* Right: trust + advice panels */}
        <div className={styles.rightCol}>
          <AITrustPanel trustLevel="CAO" isStable={true} />
          <OperationAdvicePanel />
        </div>
      </div>

      {/* ── Bottom 3-column row ── */}
      <div className={styles.bottomRow}>
        <RoomPricePanel occupancyTarget={occupancyTarget} />
        <StaffPlanPanel />
        <HolidayPanel />
      </div>
    </div>
  );
}
