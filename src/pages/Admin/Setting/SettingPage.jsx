import { useState, useEffect } from 'react';
import { authService } from '../../../services/authService';
import { dashboardService } from '../../../services/dashBoardService';
import { hotelService } from '../../../services/hotelService';
import { bookingService } from '../../../services/bookingService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import styles from './SettingPage.module.css';

const SettingPage = () => {
    const [systemStats, setSystemStats] = useState({
        totalUsers: 0,
        totalHotels: 0,
        totalBookings: 0,
        totalRevenue: 0
    });

    const [settings, setSettings] = useState({
        siteName: 'SHCS Hotel Booking',
        supportEmail: 'vit76404@gmail.com',
        supportPhone: '0774594729',
        maxUploadSize: 5
    });

    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSystemStats();
        fetchMaintenanceStatus();
    }, []);

    const fetchMaintenanceStatus = async () => {
        try {
            const { default: api } = await import('../../../services/api.js');
            const res = await api.get('/auth/maintenance/status');
            setMaintenanceMode(res.data.is_maintenance);
        } catch (error) {
            console.error('Failed to fetch maintenance status:', error);
        }
    };

    const handleToggleMaintenance = async () => {
        const result = await Swal.fire({
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

        if (!result.isConfirmed) return;

        try {
            const { default: api } = await import('../../../services/api.js');
            const res = await api.post('auth/admin/maintenance/toggle');
            setMaintenanceMode(res.data.is_maintenance);
            toast.success(res.data.message);
        } catch (error) {
            toast.error('Lỗi: ' + error.message);
        }
    };

    const fetchSystemStats = async () => {
        try {
            setLoading(true);
            // Lấy thông tin từ các service
            const [users, revenue, bookings, hotels] = await Promise.all([
                authService.getAllUsers(),
                dashboardService.getDashboardRevenue(),
                bookingService.getAllBookings(),
                hotelService.getAllHotels()
            ]);

            setSystemStats({
                totalUsers: users?.length || 0,
                totalHotels: hotels?.data?.data?.length || hotels?.data?.length || 0,
                totalBookings: bookings?.data?.length || bookings?.length || 0,
                totalRevenue: revenue || 0
            });
        } catch (error) {
            console.error('Fetch stats error:', error);
            toast.error('Lỗi khi lấy thông tin thống kê');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        const result = await Swal.fire({
            title: 'Lưu cài đặt?',
            text: 'Bạn có chắc chắn muốn lưu các thay đổi này?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Lưu',
            cancelButtonText: 'Hủy'
        });

        if (!result.isConfirmed) return;

        try {
            toast.success('Lưu cài đặt thành công!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Lưu thất bại: ' + error.message);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Cài đặt hệ thống</h1>
                <p>Quản lý cài đặt chung và xem thống kê hệ thống</p>
            </div>

            {/* System Stats */}
            <div className={styles.statsSection}>
                <h2 className={styles.sectionTitle}>📊 Thống kê hệ thống {loading && '(đang tải...)'}</h2>
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>👥</div>
                        <div className={styles.statContent}>
                            <div className={styles.statNumber}>{loading ? '-' : systemStats.totalUsers}</div>
                            <div className={styles.statLabel}>Tổng người dùng</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>🏨</div>
                        <div className={styles.statContent}>
                            <div className={styles.statNumber}>{loading ? '-' : systemStats.totalHotels}</div>
                            <div className={styles.statLabel}>Tổng khách sạn</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>📅</div>
                        <div className={styles.statContent}>
                            <div className={styles.statNumber}>{loading ? '-' : systemStats.totalBookings}</div>
                            <div className={styles.statLabel}>Tổng đặt phòng</div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>💰</div>
                        <div className={styles.statContent}>
                            <div className={styles.statNumber}>{loading ? '-' : formatCurrency(systemStats.totalRevenue)}</div>
                            <div className={styles.statLabel}>Doanh thu</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* General Settings */}
            <div className={styles.settingsSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>⚙️ Cài đặt chung</h2>
                    {!isEditing && (
                        <button
                            className={styles.editButton}
                            onClick={() => setIsEditing(true)}
                        >
                            ✏️ Chỉnh sửa
                        </button>
                    )}
                </div>

                <div className={styles.settingsForm}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Tên website:</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email hỗ trợ:</label>
                        <input
                            type="email"
                            className={styles.input}
                            value={settings.supportEmail}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Số điện thoại:</label>
                        <input
                            type="tel"
                            className={styles.input}
                            value={settings.supportPhone}
                            onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Kích thước upload tối đa (MB):</label>
                        <input
                            type="number"
                            className={styles.input}
                            value={settings.maxUploadSize}
                            onChange={(e) => setSettings({ ...settings, maxUploadSize: parseInt(e.target.value) })}
                            disabled={!isEditing}
                            min="1"
                            max="100"
                        />
                    </div>

                    <div className={styles.formGroup} style={{ borderTop: '1px solid #eee', paddingTop: '20px', marginTop: '20px' }}>
                        <h3 style={{ marginBottom: '15px', color: maintenanceMode ? '#d33' : '#333' }}>
                            Trạng thái hệ thống: {maintenanceMode ? 'ĐANG BẢO TRÌ' : 'HOẠT ĐỘNG BÌNH THƯỜNG'}
                        </h3>
                        <p style={{ color: '#666', marginBottom: '15px' }}>
                            Lưu ý: Tính năng này thay đổi ngay trạng thái website. Quản trị viên (Admin) vẫn có thể truy cập hệ thống để kiểm tra trong suốt quá trình cài đặt.
                        </p>
                        <button
                            className={styles.button}
                            style={{
                                background: maintenanceMode ? '#d33' : '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                            onClick={handleToggleMaintenance}
                        >
                            {maintenanceMode ? 'Tắt Bảo Trì (Mở Lại Web)' : 'Bật Bảo Trì Hệ Thống'}
                        </button>
                    </div>
                </div>

                {isEditing && (
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.saveButton}
                            onClick={handleSaveSettings}
                        >
                            💾 Lưu Thông Tin
                        </button>
                        <button
                            className={styles.cancelButton}
                            onClick={() => setIsEditing(false)}
                        >
                            ❌ Hủy
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingPage;