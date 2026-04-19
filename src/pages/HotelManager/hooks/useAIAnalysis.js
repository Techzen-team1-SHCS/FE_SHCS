import { useState, useCallback, useMemo, useEffect } from "react";
import api from "../../../services/api";
import { AI_FORECAST_CHART_DATA, AI_PERIOD_OPTIONS } from "../Mock/aiForecastData";
import { filterByDays, getPeakForecast, getOccupancyTarget } from "../Helpers/aiAnalysisHelpers";

const DEFAULT_HOTEL_CAPACITY = 30;

function mapConfidenceToVietnamese(confidence) {
  const value = (confidence || "").toLowerCase();
  if (value === "high") return "CAO";
  if (value === "medium") return "TRUNG BÌNH";
  if (value === "low") return "THẤP";
  return "CAO";
}

function mapForecastToChartData(forecast = []) {
  return forecast.map((item) => ({
    date: item.date,
    yhat: Number(item.yhat ?? 0),
    lower: Number(item.yhat_lower ?? 0),
    upper: Number(item.yhat_upper ?? 0),
  }));
}

export function useAIAnalysis() {
  const [selectedPeriod, setSelectedPeriod] = useState(AI_PERIOD_OPTIONS[1]);
  const [isRunning, setIsRunning] = useState(false);
  const [apiError, setApiError] = useState("");
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState("");

  const [rawChartData, setRawChartData] = useState(AI_FORECAST_CHART_DATA);
  const [confidenceLevel, setConfidenceLevel] = useState("CAO");
  const [isStable, setIsStable] = useState(true);
  const [suggestedAction, setSuggestedAction] = useState("");
  const [explanation, setExplanation] = useState("");
  const [dynamicPricing, setDynamicPricing] = useState("");
  const [staffing, setStaffing] = useState("");
  const [holidayWarnings, setHolidayWarnings] = useState([]);

  const chartData = useMemo(
    () => filterByDays(rawChartData, selectedPeriod.value),
    [rawChartData, selectedPeriod.value],
  );

  const peakForecast = getPeakForecast(chartData);
  const occupancyTarget = getOccupancyTarget(peakForecast, DEFAULT_HOTEL_CAPACITY);
 
  useEffect(() => {
    let mounted = true;

    const fetchHotels = async () => {
      try {
        const response = await api.get("/auth/hotel-manager/hotels");
        const payload = response?.data;

        const list = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        if (!mounted) return;

        const normalized = list
          .filter((hotel) => hotel?.id != null)
          .map((hotel) => ({
            id: String(hotel.id),
            name: hotel.name || `Hotel #${hotel.id}`,
          }));

        setHotels(normalized);

        if (normalized.length > 0) {
          setSelectedHotelId((prev) => prev || normalized[0].id);
          setApiError("");
        } else {
          setApiError("Tài khoản hiện chưa có khách sạn để phân tích.");
        }
      } catch (error) {
        if (!mounted) return;
        setHotels([]);

        const status = error?.response?.status;
        if (status === 401) {
          setApiError("Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn.");
        } else if (status === 403) {
          setApiError("Bạn không có quyền Hotel Manager để xem danh sách khách sạn.");
        } else {
          setApiError("Không tải được danh sách khách sạn. Vui lòng thử lại.");
        }
      }
    };

    fetchHotels();

    return () => {
      mounted = false;
    };
  }, []);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setApiError("");

    try {
      if (!selectedHotelId) {
        throw new Error("Vui lòng chọn khách sạn trước khi chạy phân tích.");
      }

      const response = await api.post("/auth/forecast", {
        hotel_id: selectedHotelId,
        hotel_capacity: DEFAULT_HOTEL_CAPACITY,
        horizon_days: Number(selectedPeriod.value),
      });

      const aiResult = response?.data?.ai_result || {};
      const forecast = aiResult.forecast || [];

      if (!forecast.length) {
        throw new Error("AI không trả về dữ liệu forecast.");
      }

      setRawChartData(mapForecastToChartData(forecast));
      setConfidenceLevel(mapConfidenceToVietnamese(aiResult.confidence));
      setIsStable(!aiResult.deviation);
      setSuggestedAction(aiResult.suggested_action || "");
      setExplanation(aiResult.explanation || "");
      setDynamicPricing(aiResult?.advanced_insights?.dynamic_pricing || "");
      setStaffing(aiResult?.advanced_insights?.staffing || "");
      setHolidayWarnings(aiResult?.advanced_insights?.holiday_warnings || []);
    } catch (error) {
      setApiError(error?.response?.data?.message || error.message || "Không thể lấy dữ liệu AI");
    } finally {
      setIsRunning(false);
    }
  }, [selectedHotelId, selectedPeriod.value]);

  const handlePeriodChange = useCallback((option) => {
    setSelectedPeriod(option);
  }, []);

  const handleHotelChange = useCallback((hotelId) => {
    setSelectedHotelId(String(hotelId));
  }, []);

  return {
    selectedPeriod,
    hotels,
    selectedHotelId,
    isRunning,
    apiError,
    chartData,
    peakForecast,
    occupancyTarget,
    confidenceLevel,
    isStable,
    suggestedAction,
    explanation,
    dynamicPricing,
    staffing,
    holidayWarnings,
    handleRun,
    handlePeriodChange,
    handleHotelChange,
    periodOptions: AI_PERIOD_OPTIONS,
  };
}
