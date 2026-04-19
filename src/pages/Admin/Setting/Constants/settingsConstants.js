// DEFAULT SYSTEM STATS
export const DEFAULT_SYSTEM_STATS = {
    totalUsers: 0,
    totalHotels: 0,
    totalBookings: 0,
    totalRevenue: 0
};

// DEFAULT SETTINGS
export const DEFAULT_SETTINGS = {
    siteName: 'SHCS Hotel Booking',
    supportEmail: 'vit76404@gmail.com',
    supportPhone: '0774594729',
    maxUploadSize: 5
};

// SWEETALERT CONFIG
export const MAINTENANCE_ALERT_CONFIG = (maintenanceMode) => ({
    title: maintenanceMode ? 'Tắt bảo trì?' : 'Bật chế độ bảo trì?',
    text: maintenanceMode
        ? 'Hệ thống sẽ hoạt động bình thường, người dùng có thể truy cập.'
        : 'CHÚ Ý: Tất cả người dùng sẽ không thể truy cập hệ thống ngoài Admin!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: maintenanceMode ? '#28a745' : '#d33',
    cancelButtonColor: '#aaa',
    confirmButtonText: maintenanceMode ? 'Tắt ngay' : 'Bật ngay',
    cancelButtonText: 'Hủy'
});

export const SAVE_SETTINGS_ALERT_CONFIG = {
    title: 'Lưu cài đặt?',
    text: 'Bạn có chắc chắn muốn lưu các thay đổi này?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#aaa',
    confirmButtonText: 'Lưu',
    cancelButtonText: 'Hủy'
};

// API ENDPOINTS
export const API_ENDPOINTS = {
    MAINTENANCE_STATUS: '/auth/maintenance/status',
    TOGGLE_MAINTENANCE: 'auth/admin/maintenance/toggle'
};

// FORMATTER
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};