import { useQuery } from "@tanstack/react-query";
import { bookingService } from "../services/bookingService";

export const useAllBookingQuery = () => {
  return useQuery({
    queryKey: ["all-booking"],

    queryFn: async () => {
      const res = await bookingService.getAllBookings();
      return res?.data || [];
    },

    staleTime: 1000 * 60 * 30, // Cache 5 phút
    retry: 1,
  });
};
