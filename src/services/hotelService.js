import api from './api';

export const hotelService = {
  async searchHotels(params = {}) {
  const response = await api.get('/auth/hotels/search', { params });
  if (response.data.status === 200) {
    const data=response.data.data;
  
    return {
      hotels:data.data || [],
      pagination: {
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page
      },
      total:response.data.total_results,
    };
  }
  return { hotels: [], pagination: {},total:[] };
  },
  async getTopHotel(){
    const response=await api.get('/auth/tophotels');
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