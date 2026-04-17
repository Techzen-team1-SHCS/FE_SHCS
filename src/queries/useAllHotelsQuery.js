import { useQuery } from "@tanstack/react-query";
import { hotelService } from "../services/hotelService";

export const useAllHotelsQuery = () => {
  return useQuery({
    queryKey: ["all-hotels"],

    queryFn: async () => {
      const res = await hotelService.getAllHotels();
      return res?.data || res;
    },

    staleTime: 1000 * 60 * 30, // Cache 5 phút
    retry: 1,
  });
};