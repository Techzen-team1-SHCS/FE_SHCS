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

  // Dùng cho Hotel Manager / User - lấy thông báo theo user hiện tại
  async getHotelManagerNotifications() {
    try {
      const response = await api.get('/auth/notifications');
      return response.data?.notifications || [];
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
    }
  },

  async markAsRead(id) {
    try {
      await api.put(`/auth/notifications/${id}/read`);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
    }
  },

  async markAllAsRead() {
    try {
      await api.put('/auth/notifications/mark-all-read');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to mark all notifications as read');
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

