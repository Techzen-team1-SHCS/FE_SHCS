import api from "./api";
import qs from "qs";
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  // Nếu là Date object
  if (dateString instanceof Date) {
    return dateString.toISOString().split('T')[0];
  }
  
  // Nếu là string date
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};
export const hotelService = {
  async searchHotels(params = {}) {
    const response = await api.get("/auth/hotels/search", {
      params,
      paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "brackets", encode: true }),
    });

    if (response.data.status === 200) {
      const data = response.data.data;
      return {
        hotels: data.data || [],
        pagination: {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
        },
        total: response.data.total_results || 0,
      };
    }

    return { hotels: [], pagination: {}, total: 0 };
  },

  async getTopHotel() {
    const response = await api.get("/auth/tophotels");
    return response.data.data;
  },
  async getAvailableRooms(hotelId, checkIn, checkOut, guests = 1) {
    try {
      const response = await api.get(`/auth/hotels/${hotelId}/available-rooms`, {
        params: {
          checkIn: formatDate(checkIn),
          checkOut: formatDate(checkOut),
          guests
        }
      });
      
      // Dựa trên cấu trúc response của bạn
      if (response.data.status === 200 || response.data.success) {
        return response.data.data || []; // Trả về data từ API
      } else {
        throw new Error(response.data.message || 'Failed to fetch available rooms');
      }
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      throw error;
    }
  },
  async getSameProvince(id){
    const response=await api.get(`/auth/hotels/${id}/same-province`);
    return response.data.data;
  },
  async getSimilarHotel(id){
    const response=await api.get(`/auth/hotels/${id}/same-style`);
    return response.data.data;
  },
  async getHotelById(id) {
    const response = await api.get(`/auth/hotel/${id}`);
    return response.data.data;
  },

  async getAllHotels() {
    const response = await api.get("/auth/hotel");
    return response.data.data;
  },
  async getRecommendedHotels(userId) {
    const token = localStorage.getItem("token");
    const headers = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await api.get(`/auth/recommendations/${userId}`, {
      headers,
    });

    return response.data.data || [];
  },
};

