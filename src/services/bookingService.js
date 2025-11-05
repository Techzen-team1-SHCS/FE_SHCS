import axios from 'axios';
import api from './api';

export const bookingService={
   async createBooking(bookingData) {
    try {
      console.log('🛠️ [bookingService] Gọi API booking...');
      
      // Lấy token từ localStorage hoặc context
      const token = localStorage.getItem('token');
      console.log('🔑 Token có tồn tại?:', !!token);
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await api.post('auth/booking', bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ [bookingService] Booking thành công:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ [bookingService] Lỗi:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Unauthorized - Vui lòng đăng nhập lại');
      } else if (error.response?.status === 422) {
        // Validation errors từ Laravel
        const errors = error.response.data.errors;
        const errorMessage = Object.values(errors).flat().join(', ');
        throw new Error(errorMessage);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message || 'Booking failed');
      }
    }
  },
  async getBooking(id) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await api.get(`auth/booking/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch booking');
  }
},

   async getUserBookings(userId) {
    try {
      const response = await api.get(`/users/${userId}/bookings`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },

  // Hủy booking
  async cancelBooking(bookingId) {
    try {
      const response = await api.post(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Cancel failed');
    }
  },
  async getMyBookings() {
    try {
      const response = await api.get('/bookings/me');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách booking:', error);
      throw error;
    }
  },
}