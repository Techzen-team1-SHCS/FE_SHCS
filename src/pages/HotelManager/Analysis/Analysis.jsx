import React, { useState } from "react";
import styles from "./Analysis.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const reasons = [
  "Uncompetitive Pricing",
  "Poor Reviews & Reputation",
  "Unfavorable Location",
  "Poor Visibility on OTAs",
  "Off-Season & Lack of Strategy"
];

const data = [
  { day: "Mon", booking: 90 },
  { day: "Tue", booking: 130 },
  { day: "Wed", booking: 140 },
  { day: "Thu", booking: 230 },
  { day: "Fri", booking: 260 },
  { day: "Sat", booking: 190 },
  { day: "Sun", booking: 220 }
];

export default function Analysis() {
  const [selectedReason, setSelectedReason] = useState("");

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

        {/* Recharts */}
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              {/* Gradient màu xanh */}
              <defs>
                <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f8df5" />
                  <stop offset="100%" stopColor="#2f66e0" />
                </linearGradient>
              </defs>

              {/* Grid ngang mờ */}
              <CartesianGrid
                stroke="#e5e7eb"
                vertical={false}
              />

              {/* Trục X */}
              <XAxis
                dataKey="day"
                tick={{ fill: "#6b7280", fontSize: 14 }}
                axisLine={false}
                tickLine={false}
              />

              {/* Trục Y 0-400 */}
              <YAxis
                domain={[0, 400]}
                tick={{ fill: "#6b7280", fontSize: 14 }}
                axisLine={false}
                tickLine={false}
              />

              {/* Tooltip đẹp */}
              <Tooltip
                contentStyle={{
                  borderRadius: "10px",
                  border: "none",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
                }}
                cursor={{ fill: "rgba(0,0,0,0.04)" }}
              />

              {/* Bar bo tròn + gradient */}
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
        <select
          className={styles.dropdown}
          value={selectedReason}
          onChange={(e) => setSelectedReason(e.target.value)}
        >
          <option value="">Choose reason</option>
          {reasons.map((reason, index) => (
            <option key={index} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </div>

      {/* Solution */}
      <h3>Solution</h3>
      <div className={styles.solutionCard}>
        
        <div className={styles.solutionBox}>
          <p>Suggested strategies based on data:</p>
          <ol>
            <li>Seasonal data analysis</li>
            <li>Smart promotional packages</li>
            <li>Dynamic pricing optimization</li>
            <li>Expand target audience</li>
            <li>Automated marketing campaigns</li>
          </ol>
        </div>

        <div className={styles.messageBox}>
            <div style={{width:'800px',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <input type="text" placeholder="Message" />
          <button style={{marginLeft:'-50px',width:'44px' , height:'44px', justifyContent:'center'}}>➜</button>
            </div>
          
        </div>
      </div>
    </div>
  );
}