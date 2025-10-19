import api from "./api";
import qs from "qs";

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

  async getHotelById(id) {
    const response = await api.get(`/auth/hotel/${id}`);
    return response.data;
  },

  async getAllHotels() {
    const response = await api.get("/auth/hotel");
    return response.data;
  },
};
