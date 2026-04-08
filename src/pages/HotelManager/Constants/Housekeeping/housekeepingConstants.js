export const HK_STATUS_CONFIG = {
  dirty: {
    label: "Dirty",
    labelVi: "Cần dọn",
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
    dot: "🔴",
  },
  clean: {
    label: "Clean",
    labelVi: "Sạch sẽ",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    dot: "🟢",
  },
  cleaning: {
    label: "Cleaning",
    labelVi: "Đang dọn",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    dot: "🟡",
  },
  inspected: {
    label: "Inspected",
    labelVi: "Đã kiểm tra",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
    dot: "🔵",
  },
  "out-of-order": {
    label: "Out of Order",
    labelVi: "Bảo trì",
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
    dot: "⚫",
  },
};

export const TASK_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    labelVi: "Chờ làm",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
  },
  "in-progress": {
    label: "In Progress",
    labelVi: "Đang làm",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  completed: {
    label: "Completed",
    labelVi: "Hoàn thành",
    color: "#10b981",
    bg: "#f0fdf4",
    border: "#bbf7d0",
  },
  skipped: {
    label: "Skipped",
    labelVi: "Bỏ qua",
    color: "#6b7280",
    bg: "#f9fafb",
    border: "#e5e7eb",
  },
};

export const PRIORITY_CONFIG = {
  low: { label: "Thấp", color: "#6b7280", bg: "#f3f4f6" },
  normal: { label: "Bình thường", color: "#3b82f6", bg: "#eff6ff" },
  high: { label: "Cao", color: "#f59e0b", bg: "#fffbeb" },
  urgent: { label: "Khẩn cấp", color: "#ef4444", bg: "#fef2f2" },
};

export const TASK_TYPE_CONFIG = {
  "stay-over": { label: "Stay-over", labelVi: "Dọn hằng ngày", icon: "🛏️" },
  checkout:    { label: "Checkout",  labelVi: "Dọn trả phòng",  icon: "🚪" },
  "turn-down": { label: "Turn-down", labelVi: "Dọn buổi tối",   icon: "🌙" },
  "deep-clean":{ label: "Deep Clean",labelVi: "Vệ sinh sâu",    icon: "🧹" },
};

export const ISSUE_STATUS_CONFIG = {
  open:     { label: "Open",     labelVi: "Mới báo cáo", color: "#ef4444", bg: "#fef2f2" },
  fixing:   { label: "Fixing",   labelVi: "Đang sửa",    color: "#f59e0b", bg: "#fffbeb" },
  resolved: { label: "Resolved", labelVi: "Đã xử lý",    color: "#10b981", bg: "#f0fdf4" },
};

export const HK_TABS = [
  { id: "tasks",      label: "📋 Task Board",        icon: "📋" },
  { id: "rooms",      label: "🏨 Trạng thái phòng", icon: "🏨" },
  { id: "issues",     label: "🔧 Sự cố bảo trì",    icon: "🔧" },
];
