// pages/SavedHotels/SavedHotels.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SavedHotels.module.css';
import SaveHotelCard from '../../components/SaveHotelCard/SaveHotelCard.jsx';

const SavedHotels = () => {
  const [savedHotels, setSavedHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  // Destructure styles
  const {
    container,
    header,
    title,
    subtitle,
    controls,
    filterButtons,
    filterBtn,
    active,
    hotelsGrid,
    loadingContainer,
    spinner,
    emptyState,
    emptyIcon,
    exploreBtn
  } = styles;

  // Mock data - thay thế bằng API call thực tế
  useEffect(() => {
    const mockHotels = [
      {
        id: 1,
        name: 'Khách sạn Luxury Riverside',
        image: '/assets/images/destinations/hue.jpg',
        location: 'Quận 1, TP.HCM',
        rating: 4.8,
        price: 120,
        description: 'Khách sạn 5 sao với view sông tuyệt đẹp, phòng nghỉ sang trọng và dịch vụ đẳng cấp.',
        isFavorite: true
      },
      {
        id: 2,
        name: 'Boutique Hotel Saigon',
        image: '/assets/images/destinations/hue.jpg',
        location: 'Quận 3, TP.HCM',
        rating: 4.5,
        price: 85,
        description: 'Khách sạn boutique với thiết kế độc đáo, không gian ấm cúng và tiện nghi hiện đại.',
        isFavorite: true
      },
      {
        id: 3,
        name: 'Seaside Resort Nha Trang',
        image: '/assets/images/destinations/hue.jpg',
        location: 'Nha Trang, Khánh Hòa',
        rating: 4.9,
        price: 150,
        description: 'Khu nghỉ dưỡng biển với bãi biển riêng, hồ bơi vô cực và spa cao cấp.',
        isFavorite: true
      },
      {
        id: 4,
        name: 'Mountain View Đà Lạt',
        image: '/assets/images/destinations/hue.jpg',
        location: 'Đà Lạt, Lâm Đồng',
        rating: 4.6,
        price: 75,
        description: 'Khách sạn view núi với không khí trong lành, thiết kế cổ điển và ẩm thực đặc sắc.',
        isFavorite: true
      }
    ];

    setTimeout(() => {
      setSavedHotels(mockHotels);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewDetails = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  const filteredHotels = savedHotels.filter(hotel => {
    switch (filter) {
      case 'excellent':
        return hotel.rating >= 4.5;
      case 'good':
        return hotel.rating >= 4.0 && hotel.rating < 4.5;
      case 'average':
        return hotel.rating >= 3.5 && hotel.rating < 4.0;
      case 'all':
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className={loadingContainer}>
        <div className={spinner}></div>
        <p>Đang tải khách sạn yêu thích...</p>
      </div>
    );
  }

  return (
    <div className={container}>
      <div className={header}>
        <h1 className={title}>Khách sạn yêu thích</h1>
        <p className={subtitle}>
          Danh sách {savedHotels.length} khách sạn bạn đã lưu
        </p>
      </div>

       <div className={controls}>
      <div className={filterButtons}>
        <button className={`${filterBtn} ${filter === 'all' ? active : ''}`}
          onClick={() => setFilter('all')}>
          Tất cả
        </button>
        <button className={`${filterBtn} ${filter === 'excellent' ? active : ''}`}
          onClick={() => setFilter('excellent')}>
           <i className="fas fa-star"></i> 4.5+
        </button>
        <button className={`${filterBtn} ${filter === 'good' ? active : ''}`}
          onClick={() => setFilter('good')}>
           <i className="fas fa-star"></i> 4.0+
        </button>
        <button className={`${filterBtn} ${filter === 'average' ? active : ''}`}
          onClick={() => setFilter('average')}>
           <i className="fas fa-star"></i> 3.5+
        </button>
      </div>
    </div>

      {filteredHotels.length === 0 ? (
        <div className={emptyState}>
          <div className={emptyIcon}>💔</div>
          <h3>Chưa có khách sạn yêu thích</h3>
          <p>Hãy lưu những khách sạn bạn yêu thích để xem lại sau</p>
          <button 
            className={exploreBtn}
            onClick={() => navigate('/hotels')}
          >
            Khám phá khách sạn
          </button>
        </div>
      ) : (
        <div className={hotelsGrid}>
          {filteredHotels.map(hotel => (
            <SaveHotelCard
              key={hotel.id}
              hotel={hotel}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedHotels;