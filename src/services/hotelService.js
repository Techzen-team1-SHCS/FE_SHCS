import api from './api';

export const hotelService = {
  async searchHotels(params = {}) {
    const response = await api.get('/auth/hotels/search', { params });
    return response.data;
  },

  async getHotelById(id) {
    const response = await api.get(`/auth/hotel/${id}`);
    return response.data;
  },

  async getAllHotels() {
    const response = await api.get('/auth/hotel');
    return response.data;
  }
};