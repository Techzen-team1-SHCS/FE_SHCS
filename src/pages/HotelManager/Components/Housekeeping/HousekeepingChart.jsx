import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./HousekeepingChart.module.css";

const HousekeepingChart = ({ title, subtitle, data, colors, loading }) => {
  const chartData = Object.entries(data).map(([key, value], index) => ({
    name: key,
    value: Number(value),
    color: colors[index % colors.length],
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className={styles.tooltip}>
          <span className={styles.tooltipDot} style={{ background: item.payload.color }} />
          <span>{item.name}: <strong>{item.value}</strong></span>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardTitle}>{title}</p>
          {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
        </div>
      </div>

      {loading ? (
        <div className={styles.skeleton}>
          <div className={styles.skeletonCircle} />
          <div className={styles.skeletonLegend}>
            {[1, 2, 3, 4].map((i) => <div key={i} className={styles.skeletonLine} />)}
          </div>
        </div>
      ) : (
        <div className={styles.body}>
          {/* Donut chart */}
          <div className={styles.chartWrap}>
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className={styles.centerLabel}>
              <span className={styles.centerNum}>{total}</span>
              <span className={styles.centerText}>tổng</span>
            </div>
          </div>

          {/* Legend */}
          <div className={styles.legend}>
            {chartData.map((item) => {
              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={item.name} className={styles.legendItem}>
                  <div className={styles.legendLeft}>
                    <span className={styles.dot} style={{ background: item.color }} />
                    <span className={styles.legendLabel}>{item.name}</span>
                  </div>
                  <div className={styles.legendRight}>
                    <span className={styles.legendValue}>{item.value}</span>
                    <span className={styles.legendPct}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HousekeepingChart;
