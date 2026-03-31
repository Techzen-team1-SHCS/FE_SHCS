import React from 'react';
import './style.css';
import Button from '../../../../../components/Button/Button';
import PartLoading from '../../../../../components/Loading/PartLoading';
import { useSimilarHotels } from '../../Hooks/useSimilarHotels';
import { getHotelImage, getHotelGuest } from '../../Helpers/hotelHelper';

function SimilarHotel({ currentHotelId }) {

  // SỬA: Dùng React Query thay vì useState + useEffect
  const {
    data: similarHotels,
    isLoading,
    isError,
    error,
  } = useSimilarHotels(currentHotelId);

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

  console.log('✅ [SimilarHotel] Data loaded, items:', similarHotels?.length || 0);

  return (
    <>
      <h3
        style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '24px',
          color: '#1a1a1a',
        }}
      >
        Khách sạn tương tự
      </h3>
      <div className='similar-hotels'>
        {similarHotels?.map((hotel) => (
          <div className='maincontent' key={hotel.id}>
            <div className='container'>
              <div className='similar-hotels-img'>
                <img src={getHotelImage(hotel)} alt={hotel.name} />
              </div>
              <div className='content1'>
                <span>{hotel.name}</span>
                <div className='content3'>
                  <div className='guest'>
                    <img src="/assets/images/about/icon-user-grey.svg" alt="guest icon" />
                    <span>{getHotelGuest(hotel)}</span>
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
    </>
  );
}

// THÊM: React.memo để tránh re-render không cần thiết
export default React.memo(SimilarHotel);