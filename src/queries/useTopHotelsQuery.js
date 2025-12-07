import { useQuery } from "@tanstack/react-query";
import { hotelService } from "../services/hotelService";

export const useTopHotelsQuery = () => {
  return useQuery({
    queryKey: ["top-hotels"],

    queryFn: async () => {
      const res = await hotelService.getTopHotel();
      return res?.data || res;
    },

    staleTime: 1000 * 60 * 5, // Cache 5 phút
    retry: 1,
  });
};
