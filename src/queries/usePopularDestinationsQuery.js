import { useQuery } from "@tanstack/react-query";
import { hotelService } from "../services/hotelService";

const provinceImages = {
  "hà nội": "assets/images/destinations/haNoi.jpg",
  "đà nẵng": "assets/images/destinations/daNang.jpg",
  "hồ chí minh": "assets/images/destinations/hoChiMinh.jpg",
  "nha trang": "assets/images/destinations/nhaTrang.jpg",
  "huế": "assets/images/destinations/hue.jpg",
  "hải phòng": "assets/images/destinations/haiPhong.jpg",
  "đà lạt": "assets/images/destinations/dalat.jpg",
  "phú quốc": "assets/images/destinations/phuquoc.jpg"
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
        img: provinceImages[item.province?.toLowerCase()] || "assets/images/destinations/default.jpg",
        delay: index * 100,
      }));
    },

    staleTime: 1000 * 60 * 5, // 5 phút không refetch
    retry: 1,
  });
};
