import { useQuery } from "@tanstack/react-query";
import { hotelService } from "../services/hotelService";

export const useHotelsQuery = (filters) => {
  return useQuery({
    queryKey: ["hotels", filters], // cache theo filter
    queryFn: () => hotelService.searchHotels(filters),
    keepPreviousData: true, // giữ data cũ khi đổi trang → mượt
    staleTime: 1000 * 60 * 2, // 2 mins
  });
};
