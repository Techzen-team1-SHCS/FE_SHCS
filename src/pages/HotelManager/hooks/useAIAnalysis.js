import { useState, useCallback, useMemo, useEffect } from "react";
import api from "../../../services/api";
import {
  AI_FORECAST_CHART_DATA,
  AI_PERIOD_OPTIONS,
} from "../Mock/aiForecastData";
import {
  filterByDays,
  getPeakForecast,
  getOccupancyTarget,
} from "../Helpers/aiAnalysisHelpers";

const DEFAULT_HOTEL_CAPACITY = 30;

function toPositiveNumber(value) {
  if (value == null) return 0;
  if (typeof value === "number")
    return Number.isFinite(value) && value > 0 ? value : 0;

  const raw = String(value).trim();
  if (!raw) return 0;

  const onlyNumeric = raw.replace(/[^\d.,-]/g, "");
  if (!onlyNumeric) return 0;

  const hasDot = onlyNumeric.includes(".");
  const hasComma = onlyNumeric.includes(",");

  let normalized = onlyNumeric;

  if (hasDot && hasComma) {
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  } else if (hasComma) {
    normalized = normalized.replace(",", ".");
  }

  const n = Number(normalized);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function pickFromObjectByKeys(source = {}, keys = []) {
  for (const key of keys) {
    const n = toPositiveNumber(source?.[key]);
    if (n > 0) return n;
  }
  return 0;
}

function pickNormalRoomPrice(hotel = {}) {
  const roomTypes = Array.isArray(hotel?.rooms) ? hotel.rooms : [];

  const roomPriceKeys = [
    "price",
    "room_price",
    "roomPrice",
    "price_per_night",
    "pricePerNight",
    "base_price",
    "basePrice",
  ];

  const normalRoom = roomTypes.find((room) => {
    const label = String(room?.room_type || room?.roomType || "")
      .trim()
      .toLowerCase();
    return label === "normal";
  });

  if (normalRoom) {
    return pickFromObjectByKeys(normalRoom, roomPriceKeys);
  }

  const standardRoom = roomTypes.find((room) => {
    const label = String(room?.room_type || room?.roomType || "")
      .trim()
      .toLowerCase();
    return label === "standard";
  });

  if (standardRoom) {
    return pickFromObjectByKeys(standardRoom, roomPriceKeys);
  }

  return 0;
}

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
  const [selectedHotelNormalPrice, setSelectedHotelNormalPrice] = useState(0);

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
  const occupancyTarget = getOccupancyTarget(
    peakForecast,
    DEFAULT_HOTEL_CAPACITY,
  );

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
            normalPrice: pickNormalRoomPrice(hotel),
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
          setApiError(
            "Bạn không có quyền Hotel Manager để xem danh sách khách sạn.",
          );
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
  useEffect(() => {
  if (!selectedHotelId) return;
  if (isRunning) return;

  const fetchLatest = async () => {
    try {
      const res = await api.get("/auth/forecast/latest", {
        params: { hotel_id: selectedHotelId },
      });

      const ai = res?.data?.ai_result;
      if (!ai) return;

      // 1. CHART
      setRawChartData(mapForecastToChartData(ai.forecast || []));

      // 2. TRUST PANEL
      setConfidenceLevel(mapConfidenceToVietnamese(ai.confidence));
      setIsStable(!ai.deviation);

      // 3. ADVICE PANEL
      setSuggestedAction(ai.suggested_action || "");
      setExplanation(ai.explanation || "");

      // 4. ADVANCED INSIGHTS (BOTTOM ROW)
      setDynamicPricing(ai?.advanced_insights?.dynamic_pricing || "");
      setStaffing(ai?.advanced_insights?.staffing || "");
      setHolidayWarnings(ai?.advanced_insights?.holiday_warnings || []);

    } catch (err) {
      console.log("cache load error", err);
    }
  };

  fetchLatest();
}, [selectedHotelId, isRunning]);
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
      setApiError(
        error?.response?.data?.message ||
          error.message ||
          "Không thể lấy dữ liệu AI",
      );
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

  useEffect(() => {
    const selected = hotels.find((hotel) => hotel.id === selectedHotelId);
    setSelectedHotelNormalPrice(selected?.normalPrice || 0);
  }, [hotels, selectedHotelId]);

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
    selectedHotelNormalPrice,
    handleRun,
    handlePeriodChange,
    handleHotelChange,
    periodOptions: AI_PERIOD_OPTIONS,
  };
}
