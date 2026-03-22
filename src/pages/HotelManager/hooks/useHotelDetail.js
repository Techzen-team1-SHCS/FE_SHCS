import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hotelService } from '../../../services/hotelService.js';

export const useHotelDetail = (hotelId) => {
  const queryClient = useQueryClient();

  const {
    data: hotel,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['hotel-manager-detail', hotelId],
    queryFn: () => hotelService.getHotelManagerHotelById(hotelId),
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const updateHotelMutation = useMutation({
    mutationFn: ({ id, data }) => hotelService.updateHotelManagerHotel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['hotel-manager-detail', hotelId]);
      queryClient.invalidateQueries(['hotel-manager-list']);
    },
    onError: (error) => {
      console.error('Lỗi cập nhật khách sạn:', error);
      alert('Cập nhật thất bại. Vui lòng thử lại.');
    },
  });

  return {
    hotel: hotel || {},
    isLoading,
    isError,
    error,
    updateHotelMutation,
  };
};