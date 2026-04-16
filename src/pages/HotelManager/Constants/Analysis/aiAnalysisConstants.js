// ─── Chart colors ────────────────────────────────────────────────────────────
export const AI_CHART_COLORS = {
  LINE: "#00e5ff",
  AREA_FILL: "rgba(0, 229, 255, 0.15)",
  CONFIDENCE_FILL: "rgba(0, 180, 220, 0.12)",
  GRID: "rgba(255,255,255,0.07)",
  AXIS_TICK: "#8ba3b8",
};

// ─── Trust levels ─────────────────────────────────────────────────────────────
export const AI_TRUST_LEVEL = {
  HIGH: "CAO",
  MEDIUM: "TRUNG BÌNH",
  LOW: "THẤP",
};

export const AI_TRUST_COLOR = {
  CAO: "#0070f3",
  "TRUNG BÌNH": "#d97706",
  THẤP: "#dc2626",
};

// ─── Data stability options ───────────────────────────────────────────────────
export const DATA_STABILITY = {
  STABLE: { label: "DỮ LIỆU ỔN ĐỊNH", color: "#0070f3", dot: "#22c55e" },
  UNSTABLE: { label: "DỮ LIỆU KHÔNG ỔN ĐỊNH", color: "#dc2626", dot: "#ef4444" },
};

// ─── Static AI info ──────────────────────────────────────────────────────────
export const AI_TRUST_DESCRIPTION =
  "Mô hình đã học hỏi từ 2,400+ điểm dữ liệu lịch sử và các sự kiện local hiện hành.";

export const AI_OPERATION_ADVICE_TITLE = "LỜI KHUYÊN VẬN HÀNH";

export const AI_OPERATION_ADVICE_BODY =
  "Có xu hướng tăng trưởng tích cực (+10%) trong kỳ dự báo. Lượng khách cao hơn vào Cuối tuần (12%).";

export const AI_OPERATION_ADVICE_QUOTE =
  "\"Phê chuẩn tuyển thêm 2 nhân viên Part-time cho bộ phận buồng phòng vào cuối tuần.\"";

// ─── Section labels ──────────────────────────────────────────────────────────
export const LABEL_OCCUPANCY_TARGET = "OCCUPANCY TARGET";
export const LABEL_STAFF_PLAN = "KẾ HOẠCH NHÂN SỰ NGÀY MAI";
export const LABEL_HOLIDAY = "CẢNH BÁO LỄ TẾT";
export const LABEL_HOLIDAY_SPECIAL = "Sự kiện đặc biệt";
export const LABEL_NO_HOLIDAY = "Không có sự kiện đặc biệt";
export const LABEL_FORECAST_TITLE = "Dự báo số lượng phòng (Forecasted Rooms)";
export const LABEL_TREND = "Xu hướng (yhat)";
export const LABEL_CONFIDENCE = "Biên độ tin cậy";
export const LABEL_ESTIMATED = "ĐỈNH DỰ KIẾN";
export const LABEL_PRICE_ADVICE = "KHUYẾN NGHỊ GIÁ PHÒNG";
export const LABEL_PRICE_CTA = "Giữ nguyên giá bán hiện tại";
export const LABEL_AI_TRUST = "ĐỘ TIN CẬY CỦA AI";
export const LABEL_DATA_FLUCTUATION = "BIẾN ĐỘNG DỮ LIỆU";
export const LABEL_HOUSEKEEPING = "Housekeeping";
export const LABEL_RECEPTION = "Reception";
export const LABEL_ROOMS_FORECAST = "Phòng dự kiến";
export const LABEL_STAFF_UNIT = "nhân viên";
export const LABEL_SHIFT_UNIT = "NV / Ca";
export const LABEL_RUN = "Chạy";
export const LABEL_PERIOD = "Phạm vi";
export const LABEL_SUB_TITLE =
  "Dữ liệu thông minh tích hợp từ các nguồn OTA & Local Events";
