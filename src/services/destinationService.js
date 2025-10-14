    // src/services/destinationService.js
import api from './api';

export const destinationService = {
  async getTopHotels() {
    const response = await api.get('/auth/tophotels');
    return response.data;
  },
};