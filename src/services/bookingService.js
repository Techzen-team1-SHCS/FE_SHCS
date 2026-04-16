import api from './api';

export const bookingService={
   async getAllBookings() {
    try {
      const response=await api.get('auth/booking');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
   },
   async createBooking(bookingData) {
    try {      
      // Lấy token từ localStorage hoặc context
      const token = localStorage.getItem('token');      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const response = await api.post('auth/booking', bookingData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
            return response.data;
      
    } catch (error) {      
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

  async getRealtimeRoomStatus(id) {
  try {
    const response = await api.get(`auth/rooms/${id}/realtime`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch room status');
  }
},

  async holdRoomNumber(roomId, roomNumber) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await api.post('auth/rooms/hold', {
        room_id: roomId,
        room_number: roomNumber,
      }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to hold room');
    }
  },

  async releaseRoomNumber(roomId, roomNumber) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await api.post('auth/rooms/release-hold', {
        room_id: roomId,
        room_number: roomNumber,
      }, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to release room');
    }
  },

   async getUserBookings() {
    try {
      const token=localStorage.getItem('token');
      if(!token){
        throw new Error('Authentication token not found');
      }
      const response = await api.get('auth/bookings/user',{
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type':'application/json',
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },

  // Hủy booking
  async cancelBooking(id){
    try {
      const token=localStorage.getItem('token');
      if(!token){
        throw new Error('Authentication token not found');
      }
      const response=await api.post(`auth/booking/cancel/${id}`,{},{
        headers:{
          Authorization:`Bearer ${token}`,
          'Content-Type':'application/json'
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  },
  async DeleteBooking(id){
    try {
      const token=localStorage.getItem('token');
      if(!token){
        throw new Error('Authentication no token not found')
      }
      const response=await api.delete(`/auth/booking/${id}`,{
        headers:{Authorization:`Bearer ${token}`}
      });
      return response.data;
    } catch (error) {
      console.log('Không thể xóa người dùng');
    }
  },
  async updateBooking(id,data){
    try {
      const token=localStorage.getItem('token');
      if(!token){
        throw new Error('Authentication no token not found')
      }
      const response=await api.put(`auth/booking/${id}`,data,{
        headers:{Authorization:`Bearer ${token}`}
      });
      return response.data;
    } catch (error) {
      console.log('Không thể cập nhật khách sạn');
    }
  }
  
}