import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useUserQuery = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await axios.get('/api/auth/me'); // API get user hiện tại
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 phút không refetch lại
    cacheTime: 1000 * 60 * 30, // 30 phút không xóa cache
  });
};
