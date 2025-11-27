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
  }
}