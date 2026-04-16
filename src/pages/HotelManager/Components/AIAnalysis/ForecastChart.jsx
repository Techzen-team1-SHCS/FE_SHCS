import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  AI_CHART_COLORS,
  LABEL_FORECAST_TITLE,
  LABEL_TREND,
  LABEL_CONFIDENCE,
  LABEL_ESTIMATED,
} from "../../Constants/Analysis/aiAnalysisConstants";
import { formatChartTooltipLabel as fmtLabel } from "../../Helpers/aiAnalysisHelpers";
import styles from "./ForecastChart.module.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{fmtLabel(label)}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color || AI_CHART_COLORS.LINE }}>
            {entry.name}: <strong>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ForecastChart({ data, peakForecast }) {
  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.chartTitle}>{LABEL_FORECAST_TITLE}</p>
        </div>
        <div className={styles.peakBadge}>
          <span className={styles.peakNumber}>{peakForecast}</span>
          <span className={styles.peakLabel}>{LABEL_ESTIMATED}</span>
        </div>
      </div>

      {/* Chart */}
      <div className={styles.chartArea}>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 16, left: -10, bottom: 0 }}>
            <defs>
              {/* Confidence band gradient */}
              <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0070f3" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0070f3" stopOpacity={0.02} />
              </linearGradient>
              {/* Main line gradient */}
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0070f3" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#0070f3" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#f1f5f9" vertical={false} />

            <XAxis
              dataKey="date"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(0,112,243,0.2)", strokeWidth: 1 }} />

            {/* Confidence band – upper */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#confGrad)"
              name="Biên trên"
              legendType="none"
            />
            {/* Confidence band – lower (fills white to cancel lower portion) */}
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="#ffffff"
              name="Biên dưới"
              legendType="none"
            />

            {/* Main forecast line */}
            <Area
              type="monotone"
              dataKey="yhat"
              stroke="#0070f3"
              strokeWidth={2.5}
              fill="url(#lineGrad)"
              dot={false}
              activeDot={{ r: 5, fill: "#0070f3", stroke: "#fff", strokeWidth: 2 }}
              name={LABEL_TREND}
            />

            <ReferenceLine
              x={data[data.length - 1]?.date}
              stroke="rgba(0,112,243,0.35)"
              strokeDasharray="4 3"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className={styles.legend}>
          <span className={styles.legendLine} />
          <span className={styles.legendText}>{LABEL_TREND}</span>
          <span className={styles.legendArea} />
          <span className={styles.legendText}>{LABEL_CONFIDENCE}</span>
        </div>
      </div>
    </div>
  );
}
