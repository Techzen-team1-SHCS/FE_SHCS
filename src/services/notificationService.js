import api from './api';

export const notificationService = {
  // Dùng cho trang Admin - lấy tất cả thông báo
  async getNotifications() {
    try {
      const response = await api.get('/auth/Allnotifications');
      return response.data?.data || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },

  // Lấy danh sách thông báo (có phân trang và filter)
  async getNotifications(params = {}) {
    try {
      const response = await api.get('/auth/notifications', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },

  // Dùng cho Hotel Manager / User - lấy thông báo theo user hiện tại (giữ lại compatibility)
  async getHotelManagerNotifications() {
    try {
      const response = await api.get('/auth/notifications');
      return response.data?.notifications || response.data?.data || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },

  // Lấy số lượng thông báo chưa đọc (nhẹ)
  async getUnreadCount() {
    try {
      const response = await api.get('/auth/notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      return { status: "error", unread_count: 0 };
    }
  },

  async markAsRead(id) {
    try {
      const response = await api.put(`/auth/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  },

  async markAllAsRead() {
    try {
      const response = await api.put('/auth/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
    }
  },

  // Xóa 1 thông báo
  async deleteNotification(id) {
    try {
      const response = await api.delete(`/auth/notifications/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete notification');
    }
  },

  // Xóa tất cả thông báo đã đọc
  async clearReadNotifications() {
    try {
      const response = await api.delete('/auth/notifications/clear-read');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to clear read notifications');
    }
  },

  // Lấy danh sách khách sạn chờ duyệt
  async getPendingHotels() {
    try {
      const response = await api.get('/auth/admin/hotels/pending');
      return response.data?.data || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pending hotels');
    }
  },

  // Duyệt khách sạn
  async approveHotel(hotelId) {
    try {
      const response = await api.post(`/auth/admin/hotel/${hotelId}/approve`, {});
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to approve hotel');
    }
  },

  // Từ chối khách sạn
  async rejectHotel(hotelId, reason) {
    try {
      const response = await api.post(
        `/auth/admin/hotel/${hotelId}/reject`,
        { reason }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to reject hotel');
    }
  },
};

