import { useState, useEffect, useCallback } from 'react';
import { authService } from '../../../../services/authService';
import { dashboardService } from '../../../../services/dashBoardService';
import { hotelService } from '../../../../services/hotelService';
import { bookingService } from '../../../../services/bookingService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export const useSettings = () => {
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

    const fetchMaintenanceStatus = useCallback(async () => {
        try {
            const { default: api } = await import('../../../../services/api.js');
            const res = await api.get('/auth/maintenance/status');
            setMaintenanceMode(res.data.is_maintenance);
        } catch (error) {
            console.error('Failed to fetch maintenance status:', error);
        }
    }, []);

    const fetchSystemStats = useCallback(async () => {
        try {
            setLoading(true);
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
    }, []);

    useEffect(() => {
        fetchSystemStats();
        fetchMaintenanceStatus();
    }, [fetchSystemStats, fetchMaintenanceStatus]);

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
            const { default: api } = await import('../../../../services/api.js');
            const res = await api.post('auth/admin/maintenance/toggle');
            setMaintenanceMode(res.data.is_maintenance);
            toast.success(res.data.message);
        } catch (error) {
            toast.error('Lỗi: ' + error.message);
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

    return {
        systemStats,
        settings,
        setSettings,
        maintenanceMode,
        isEditing,
        setIsEditing,
        loading,
        handleToggleMaintenance,
        handleSaveSettings
    };
};
