import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styles from "./HousekeepingChart.module.css";

const HousekeepingChart = ({ title, data, colors }) => {
  const chartData = Object.entries(data).map(([key, value], index) => ({
    name: key,
    value: value,
    color: colors[index]
  }));

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show label if slice is too small

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={styles.chartCard}>
      <div className={styles.chartLabel}>{title}</div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomizedLabel}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className={styles.legend}>
          {chartData.map((item) => (
            <div key={item.name} className={styles.legendItem}>
              <span className={styles.colorBox} style={{ backgroundColor: item.color }} />
              <span className={styles.label}>
                {item.name}
              </span>
              <span className={styles.value}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HousekeepingChart;
