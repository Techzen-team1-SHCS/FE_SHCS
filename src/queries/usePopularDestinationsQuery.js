import { useQuery } from "@tanstack/react-query";
import { hotelService } from "../services/hotelService";

const provinceImages = {
  "Hà nội": "assets/images/destinations/haNoi.jpg",
  "Đà nẵng": "assets/images/destinations/daNang.jpg",
  "Hồ chí minh": "assets/images/destinations/hoChiMinh.jpg",
  "Nha trang": "assets/images/destinations/nhaTrang.jpg",
  "Huế": "assets/images/destinations/hue.jpg",
  "Hải phòng": "assets/images/destinations/haiPhong.jpg",
  "Đà Lạt": "assets/images/destinations/dalat.jpg",
  "Phú Quốc": "assets/images/destinations/phuquoc.jpg"
};

export const usePopularDestinationsQuery = () => {
  return useQuery({
    queryKey: ["popular-destinations"],

    queryFn: async () => {
      const res = await hotelService.getDestinationsCount();
      const data = res?.data || res;

      return data.map((item, index) => ({
        id: index + 1,
        title: item.province,
        hotels: `${item.count} hotels`,
        hotelCount: item.count,
        img: provinceImages[item.province] || "assets/images/destinations/default.jpg",
        delay: index * 100,
      }));
    },

    staleTime: 1000 * 60 * 5, // 5 phút không refetch
    retry: 1,
  });
};
