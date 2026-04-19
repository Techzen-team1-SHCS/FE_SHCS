// hooks/useBookings.js
import { useQuery } from '@tanstack/react-query';
import { bookingService } from '../../../../services/bookingService';

export const useBookings = () => {
    return useQuery({
        queryKey: ['all-booking'],
        queryFn: async () => {
            const result = await bookingService.getAllBookings();
            if (result?.data && Array.isArray(result.data)) return result.data;
            if (Array.isArray(result)) return result;
            return [];
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 1,
    });
};