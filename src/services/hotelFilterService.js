// src/services/hotelFilterService.js
export const hotelFilterService = {
  async getFilterCounts() {
    try {
      const res = await fetch("http://localhost:5000/api/hotels/counts");
      if (!res.ok) throw new Error("Failed to fetch counts");
      const data = await res.json();

      // API giả định trả về dạng:
      // { "OYO Rooms": 15, "VBA Hospitality Group": 12, "Nhà hàng": 865 }
      return data;
    } catch (error) {
      console.error("Lỗi khi gọi API count:", error);
      return {}; // fallback rỗng
    }
  },
};
