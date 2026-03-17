import React, { useState } from "react";
import styles from "./Analysis.module.css";
import Select from "react-select";
import { data } from "../../Mock/chartData";
import { reasonOptions } from "../../Mock/reasonoption";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BOOKING_CHART_RANGE,
  BOOKING_CHART_COLOR,
  ANALYSIS_SOLUTIONS,
  ANALYSIS_PLACEHOLDER
} from "../../Constants/Analysis/analysisConstants";
import { selectStyles } from "../../Helpers/Analysis";
import { useAnalysis } from "../../hooks/useAnalysis";

export default function Analysis() {
  const { selectedReason, setSelectedReason } = useAnalysis();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Analysis</h2>

      {/* Booking Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span>Booking</span>
          <div className={styles.navButtons}>
            <button>{"<"}</button>
            <span>Present</span>
            <button>{">"}</button>
          </div>
        </div>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="bookingGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={BOOKING_CHART_COLOR.START} />
                  <stop offset="100%" stopColor={BOOKING_CHART_COLOR.END} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#e5e7eb" vertical={false} />

              <XAxis
                dataKey="day"
                tick={{ fill: "#6b7280", fontSize: 14 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                domain={BOOKING_CHART_RANGE}
                tick={{ fill: "#6b7280", fontSize: 14 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
              />

              <Bar
                dataKey="booking"
                fill="url(#bookingGradient)"
                radius={[12, 12, 12, 12]}
                barSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reason */}
      <div className={styles.reasonSection}>
        <h3>Reason</h3>

        <Select
          options={reasonOptions}
          value={selectedReason}
          onChange={setSelectedReason}
          styles={  selectStyles}
        />
      </div>

      {/* Solution */}
      <h3>Solution</h3>

      <div className={styles.solutionCard}>
        <div className={styles.solutionBox}>
          <p>Suggested strategies based on data:</p>
          <ol>
            {ANALYSIS_SOLUTIONS.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>

        <div className={styles.messageBox}>
          <div
            style={{
              width: "800px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <input type="text" placeholder="Message" />
            <button
              style={{
                marginLeft: "-50px",
                width: "44px",
                height: "44px",
                justifyContent: "center",
              }}
            >
              ➜
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
