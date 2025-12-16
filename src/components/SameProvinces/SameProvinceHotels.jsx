// SameProvinceHotels.jsx - SỬA LẠI HOÀN TOÀN
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { hotelService } from '../../services/hotelService';
import './style.css';
import { useNavigate } from 'react-router-dom';
import PartLoading from '../Loading/PartLoading';

const SameProvinceHotels = ({ currentHotelId }) => {
  const navigate = useNavigate();
  
  console.log('🔴 [SameProvinceHotels] RENDER, hotelId:', currentHotelId);

  // QUAN TRỌNG: Đảm bảo queryKey là UNIQUE và STABLE
  const { data: sameProvinceHotels, isLoading, isError, error } = useQuery({
    queryKey: ['same-province-hotels', currentHotelId],
    queryFn: () => {
      console.log('🚀 [SameProvinceHotels] queryFn executing...');
      return hotelService.getSameProvince(currentHotelId);
    },
    enabled: !!currentHotelId, // Chỉ chạy khi có hotelId
    // THÊM CÁC OPTIONS QUAN TRỌNG
    staleTime: 60 * 60 * 1000, // 1 giờ
    gcTime: 2 * 60 * 60 * 1000, // 2 giờ (React Query v5 dùng gcTime thay cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: 'always', // Thử đổi thành 'always' xem sao
    refetchOnReconnect: false,
    retry: 1,
    // QUAN TRỌNG: Thêm refetchInterval: false để tắt refetch tự động
    refetchInterval: false,
  });

  if (isLoading) {
    console.log('⏳ [SameProvinceHotels] Loading...');
    return <div><PartLoading /></div>;
  }
  
  if (isError) {
    console.error('💥 [SameProvinceHotels] Error:', error);
    return <div>Lỗi khi tải khách sạn cùng tỉnh</div>;
  }

  console.log('✅ [SameProvinceHotels] Data loaded, count:', sameProvinceHotels?.length || 0);

  return (
    <div className="same-province-hotels">
      <h2>Khách sạn cùng tỉnh</h2>
      <div className="hotels-grid">
        {sameProvinceHotels?.map(hotel => (
          <div key={hotel.id} className="hotel-card" onClick={() => navigate(`/hotel/${hotel.id}`)} style={{ cursor: 'pointer' }}>
            <img 
              src={hotel.images?.[0]?.url || '/default-hotel.jpg'} 
              alt={hotel.name}
            />
            <div className='content'>
              <span>{hotel.name}</span>
              <p>{hotel.province}</p>
              <div className="ratting">
                {[...Array(Math.floor(hotel.hotel_class/10))].map((_, i) => (
                  <i key={i} className="fas fa-star" style={{ color: "#FFD700" }}></i>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// THÊM React.memo để tránh re-render
export default React.memo(SameProvinceHotels);