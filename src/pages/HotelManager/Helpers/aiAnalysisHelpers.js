/**
 * Find the peak forecast value from chart data
 * @param {Array} data - array of { yhat, lower, upper, date }
 * @returns {number} peak yhat value
 */
export function getPeakForecast(data) {
  if (!data || data.length === 0) return 0;
  return Math.max(...data.map((d) => d.yhat));
}

/**
 * Compute the occupancy target percentage (peak / assumed total capacity * 100)
 * @param {number} peak - peak forecasted rooms
 * @param {number} totalCapacity - hotel total capacity
 * @returns {string} formatted percentage string e.g. "61.1%"
 */
export function getOccupancyTarget(peak, totalCapacity) {
  if (!totalCapacity) return "0%";
  const value = ((peak / totalCapacity) * 100).toFixed(1);
  return `${value}%`;
}

/**
 * Filter chart data by number of days from start
 * @param {Array} data
 * @param {number|string} days
 * @returns {Array}
 */
export function filterByDays(data, days) {
  const n = parseInt(days, 10);
  if (isNaN(n)) return data;
  return data.slice(0, n);
}

/**
 * Format a custom tooltip label for the recharts chart
 * @param {string} label - x-axis label
 * @returns {string}
 */
export function formatChartTooltipLabel(label) {
  return `Ngày ${label}`;
}
