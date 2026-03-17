import { useQuery } from "@tanstack/react-query";
import { hotelService } from "../../../../services/hotelService";

export const useSimilarHotels = (hotelId) => {

  return useQuery({
    queryKey: ['similar-hotels', hotelId],
    queryFn: () => hotelService.getSimilarHotel(hotelId),

    enabled: !!hotelId,

    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,

    retry: 1,
  });

};