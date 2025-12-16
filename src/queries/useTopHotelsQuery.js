import { useQuery } from "@tanstack/react-query";
import { hotelService } from "../services/hotelService";
import { useState, useEffect } from "react";

export const useTopHotelsQuery = (options = {}) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  
  // Tự động delay 500ms để ưu tiên search hotel
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldFetch(true);
    }, 500); // Delay 500ms
    
    return () => clearTimeout(timer);
  }, []);

  return useQuery({
    queryKey: ["top-hotels"],
    queryFn: async () => {
      const res = await hotelService.getTopHotel();
      return res?.data || res;
    },
    staleTime: 1000 * 60 * 5, // Cache 5 phút
    retry: 1,
    // ✅ QUAN TRỌNG: Chỉ fetch khi shouldFetch = true
    enabled: shouldFetch,
    ...options,
  });
};