export function getPeakForecast(data) {
  if (!data || data.length === 0) return 0;
  return Math.max(...data.map((d) => d.yhat));
}