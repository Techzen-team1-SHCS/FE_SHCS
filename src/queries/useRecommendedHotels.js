import { useQuery } from '@tanstack/react-query';
import { hotelService } from '../services/hotelService';

export const useRecommendedHotels = () => {
  return useQuery({
    queryKey: ["recommended-hotels"],
    queryFn: hotelService.getRecommendedHotels,
    refetchInterval: 3 * 60 * 1000, // 3 phút
    staleTime: 3 * 60 * 1000,
    retry: 1
  });
};
