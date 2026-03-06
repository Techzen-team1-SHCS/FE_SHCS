import api from './api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined') {
    throw new Error('Authentication token not found');
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const notificationService = {
  // Dùng cho trang Admin - lấy tất cả thông báo
  async getNotifications() {
    try {
      const response = await api.get('/auth/Allnotifications', {
        headers: getAuthHeaders(),
      });
      return response.data?.data || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },

  // Dùng cho Hotel Manager / User - lấy thông báo theo user hiện tại
  async getHotelManagerNotifications() {
    try {
      const response = await api.get('/auth/notifications', {
        headers: getAuthHeaders(),
      });
      return response.data?.notifications || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },

  async markAsRead(id) {
    try {
      await api.put(`/auth/notifications/${id}/read`, null, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  },

  async markAllAsRead() {
    try {
      await api.put('/auth/notifications/mark-all-read', null, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  },
};

