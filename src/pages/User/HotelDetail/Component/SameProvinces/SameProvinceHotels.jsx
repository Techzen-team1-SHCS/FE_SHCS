// SameProvinceHotels.jsx - SỬA LẠI HOÀN TOÀN
import React from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import PartLoading from '../../../../../components/Loading/PartLoading';
import { getHotelImage, getHotelStars } from "../../Helpers/hotelHelper";
import { useSameProvinceHotels } from '../../Hooks/useSameProvinceHotels';

const SameProvinceHotels = ({ currentHotelId }) => {
  const navigate = useNavigate();
  console.log('🔴 [SameProvinceHotels] RENDER, hotelId:', currentHotelId);

  // QUAN TRỌNG: Đảm bảo queryKey là UNIQUE và STABLE
    const {
    data: hotels,
    isLoading,
    isError,
    error
  } = useSameProvinceHotels(currentHotelId);
    const stars = getHotelStars(hotels);

  if (isLoading) {
    console.log('⏳ [SameProvinceHotels] Loading...');
    return <div><PartLoading /></div>;
  }

  if (isError) {
    console.error('💥 [SameProvinceHotels] Error:', error);
    return <div>Lỗi khi tải khách sạn cùng tỉnh</div>;
  }

  console.log('✅ [SameProvinceHotels] Data loaded, count:', hotels?.length || 0);

  return (
    <div className="same-province-hotels">
      <h2>Khách sạn cùng tỉnh</h2>
      <div className="hotels-grid">
        {hotels?.map(hotel => (
          <div key={hotel.id} className="hotel-card" onClick={() => navigate(`/hotel/${hotel.id}`)} style={{ cursor: 'pointer' }}>
            <img
              src={getHotelImage(hotel)}
              alt={hotel.name}
            />
            <div className='content'>
              <span>{hotel.name}</span>
              <p>{hotel.province}</p>
              <div className="ratting">
                {[...Array(stars)].map((_, i) => (
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