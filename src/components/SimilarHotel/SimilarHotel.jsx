import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { hotelService } from '../../services/hotelService';
import './style.css';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import PartLoading from '../Loading/PartLoading';

function SimilarHotel({ currentHotelId }) {
  const navigate = useNavigate();

  // SỬA: Dùng React Query thay vì useState + useEffect
  const { data: similarHotel, isLoading, isError, error } = useQuery({
    queryKey: ['similar-hotels', currentHotelId],
    queryFn: () => {
      console.log('📞 [SimilarHotel] Fetching data for hotel:', currentHotelId);
      return hotelService.getSimilarHotel(currentHotelId);
    },
    enabled: !!currentHotelId, // Chỉ fetch khi có hotelId
    staleTime: 10 * 60 * 1000, // 10 phút
    gcTime: 30 * 60 * 1000, // 30 phút
    // QUAN TRỌNG: Tắt các refetch tự động
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    retry: 1,
  });

  // Debug: Xem component có bị re-render không
  React.useEffect(() => {
    console.log('🔄 [SimilarHotel] Component rendered/re-rendered');
  });

  if (isLoading) {
    console.log('⏳ [SimilarHotel] Loading data...');
    return <div><PartLoading /></div>;
  }
  
  if (isError) {
    console.error('❌ [SimilarHotel] Error:', error);
    return <div>Lỗi: Không thể tải danh sách khách sạn tương tự</div>;
  }

  console.log('✅ [SimilarHotel] Data loaded, items:', similarHotel?.length || 0);

  return (
    <div className='similar-hotels'>
      {similarHotel?.map((hotel) => (
        <div className='maincontent' key={hotel.id}>
          <div className='container'>
            <div className='similar-hotels-img'>
              <img src={hotel.images?.[0]?.url || '/default-hotel.jpg'} alt={hotel.name} />
            </div>
            <div className='content1'>
              <span>{hotel.name}</span>
              <div className='content3'>
                <div className='guest'>
                  <img src="/assets/images/about/icon-user-grey.svg" alt="guest icon" />
                  <span>{hotel.rooms?.[0]?.max_guest || 'N/A'}</span>
                </div>
                <div className='ft'>
                  <img src="/assets/images/about/icon-plan-grey.svg" alt="size icon" />
                  <span>70 ft</span>
                </div>
              </div>
              <span className='contentDescription'>{hotel.description}</span>
              <Button props={'Book Now'} />
            </div>
          </div>
        </div>
      ))} 
    </div>
  );
}

// THÊM: React.memo để tránh re-render không cần thiết
export default React.memo(SimilarHotel);