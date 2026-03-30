import { useQuery } from "@tanstack/react-query";
import { hotelService } from '../../../../services/hotelService.js';

export const useSameProvinceHotels = (hotelId) => {

  return useQuery({
    queryKey: ['same-province-hotels', hotelId],

    queryFn: () => hotelService.getSameProvince(hotelId),

    enabled: !!hotelId,

    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,

    retry: 1
  });

};