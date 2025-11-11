// components/FavoriteButton/FavoriteButton.jsx
import React, { useState, useEffect } from 'react';
import styles from './FavoriteButton.module.css';

const FavoriteButton = ({ 
  hotel,  // ← ĐÃ ĐỔI TỪ hotelData THÀNH hotel
  size = 'medium',
  onToggle 
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Kiểm tra xem khách sạn có trong danh sách yêu thích không
  useEffect(() => {
    const savedHotels = JSON.parse(localStorage.getItem('favoriteHotels') || '[]');
    const isHotelFavorite = savedHotels.some(savedHotel => savedHotel.id === hotel?.id); 
    setIsFavorite(isHotelFavorite);
  }, [hotel]); 

  const toggleFavorite = () => {
    const savedHotels = JSON.parse(localStorage.getItem('favoriteHotels') || '[]');
    
    let newFavorites;
    if (isFavorite) {
      // Xóa khỏi danh sách yêu thích
      newFavorites = savedHotels.filter(savedHotel => savedHotel.id !== hotel?.id); 
    } else {
      // Thêm vào danh sách yêu thích
      if (hotel && !savedHotels.some(savedHotel => savedHotel.id === hotel?.id)) { 
        newFavorites = [...savedHotels, { ...hotel, isFavorite: true }];
      } else {
        return;
      }
    }

    // Lưu vào localStorage
    localStorage.setItem('favoriteHotels', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    
    // Gọi callback function nếu có
    if (onToggle) {
      onToggle(!isFavorite, hotel?.id); 
    }
  };

  return (
    <button
      className={`${styles.favoriteButton} ${styles[size]} ${
        isFavorite ? styles.active : ''
      }`}
      onClick={toggleFavorite}
      aria-label={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
    >
      <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
    </button>
  );
};

export default FavoriteButton;