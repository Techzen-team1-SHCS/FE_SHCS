import { useState, useCallback } from "react";
import { AI_FORECAST_CHART_DATA, AI_PERIOD_OPTIONS } from "../Mock/aiForecastData";
import { filterByDays, getPeakForecast, getOccupancyTarget } from "../Helpers/aiAnalysisHelpers";

const TOTAL_HOTEL_CAPACITY = 200;

export function useAIAnalysis() {
  const [selectedPeriod, setSelectedPeriod] = useState(AI_PERIOD_OPTIONS[1]); // default 14 ngày
  const [isRunning, setIsRunning] = useState(false);

  const chartData = filterByDays(AI_FORECAST_CHART_DATA, selectedPeriod.value);
  const peakForecast = getPeakForecast(chartData);
  const occupancyTarget = getOccupancyTarget(peakForecast, TOTAL_HOTEL_CAPACITY);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
  }, []);

  const handlePeriodChange = useCallback((option) => {
    setSelectedPeriod(option);
  }, []);

  return {
    selectedPeriod,
    isRunning,
    chartData,
    peakForecast,
    occupancyTarget,
    handleRun,
    handlePeriodChange,
    periodOptions: AI_PERIOD_OPTIONS,
  };
}
