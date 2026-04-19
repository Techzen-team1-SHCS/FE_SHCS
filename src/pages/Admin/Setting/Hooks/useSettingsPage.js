import { useState, useEffect } from 'react';
import { authService } from '../../../../services/authService.js';
import { dashboardService } from '../../../../services/dashBoardService.js';
import { hotelService } from '../../../../services/hotelService.js';
import { bookingService } from '../../../../services/bookingService.js';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

import {
    DEFAULT_SYSTEM_STATS,
    DEFAULT_SETTINGS,
    MAINTENANCE_ALERT_CONFIG,
    SAVE_SETTINGS_ALERT_CONFIG,
    API_ENDPOINTS
} from '../Constants/settingsConstants.js';

import { buildSystemStats } from '../Helpers/settingsHelpers.js';

const useSettingsPage = () => {
    const [systemStats, setSystemStats] = useState(DEFAULT_SYSTEM_STATS);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSystemStats();
        fetchMaintenanceStatus();
    }, []);

    const fetchMaintenanceStatus = async () => {
        try {
            const { default: api } = await import('../../../../services/api.js');
            const res = await api.get(API_ENDPOINTS.MAINTENANCE_STATUS);
            setMaintenanceMode(res.data.is_maintenance);
        } catch (error) {
            console.error('Failed to fetch maintenance status:', error);
        }
    };

    const handleToggleMaintenance = async () => {
        const result = await Swal.fire(MAINTENANCE_ALERT_CONFIG(maintenanceMode));
        if (!result.isConfirmed) return;

        try {
            const { default: api } = await import('../../../../services/api.js');
            const res = await api.post(API_ENDPOINTS.TOGGLE_MAINTENANCE);
            setMaintenanceMode(res.data.is_maintenance);
            toast.success(res.data.message);
        } catch (error) {
            toast.error('Lỗi: ' + error.message);
        }
    };

    const fetchSystemStats = async () => {
        try {
            setLoading(true);

            const [users, revenue, bookings, hotels] = await Promise.all([
                authService.getAllUsers(),
                dashboardService.getDashboardRevenue(),
                bookingService.getAllBookings(),
                hotelService.getAllHotels()
            ]);

            setSystemStats(
                buildSystemStats({
                    users,
                    hotels,
                    bookings,
                    revenue
                })
            );
        } catch (error) {
            console.error('Fetch stats error:', error);
            toast.error('Lỗi khi lấy thông tin thống kê');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        const result = await Swal.fire(SAVE_SETTINGS_ALERT_CONFIG);
        if (!result.isConfirmed) return;

        try {
            toast.success('Lưu cài đặt thành công!');
            setIsEditing(false);
        } catch (error) {
            toast.error('Lưu thất bại: ' + error.message);
        }
    };

    return {
        // state
        systemStats,
        settings,
        maintenanceMode,
        isEditing,
        loading,

        // setters
        setSettings,
        setIsEditing,

        // actions
        handleToggleMaintenance,
        handleSaveSettings
    };
};

export default useSettingsPage;