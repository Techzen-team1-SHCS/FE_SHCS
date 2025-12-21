// components/AmenityIcon.jsx
import React from 'react';

const AmenityIcon = ({ amenityName, className = "" }) => {
  const getAmenityIcon = (name) => {
    const nameLower = name.toLowerCase();
    
    const iconMap = {
      // WiFi & Internet
      'wifi': 'fas fa-wifi',
      'wi-fi': 'fas fa-wifi',
      'internet': 'fas fa-wifi',
      
      // Parking
      'đỗ xe': 'fas fa-parking',
      'parking': 'fas fa-parking',
      'chỗ đỗ': 'fas fa-parking',
      
      // Pool
      'hồ bơi': 'fas fa-swimming-pool',
      'bơi': 'fas fa-swimming-pool',
      'pool': 'fas fa-swimming-pool',
      'hồ bơi riêng': 'fas fa-swimming-pool',
      
      // Gym & Fitness
      'thể dục': 'fas fa-dumbbell',
      'gym': 'fas fa-dumbbell',
      'thể hình': 'fas fa-dumbbell',
      'trung tâm thể dục': 'fas fa-dumbbell',
      
      // Spa & Wellness
      'spa': 'fas fa-spa',
      'chăm sóc sức khoẻ': 'fas fa-spa',
      'wellness': 'fas fa-spa',
      'massage': 'fas fa-spa',
      
      // Restaurant & Bar
      'nhà hàng': 'fas fa-utensils',
      'restaurant': 'fas fa-utensils',
      'bar': 'fas fa-glass-martini-alt',
      'quầy bar': 'fas fa-glass-martini-alt',
      'sky bar': 'fas fa-glass-martini-alt',
      
      // Room Services
      'dịch vụ phòng': 'fas fa-concierge-bell',
      'phòng': 'fas fa-concierge-bell',
      'lễ tân': 'fas fa-concierge-bell',
      'lễ tân 24 giờ': 'fas fa-clock',
      'Family rooms':'fas fa-users',
      
      // Kitchen
      'kitchenette': 'fas fa-utensils',
      'shared kitchen': 'fas fa-utensils',
      'bếp': 'fas fa-utensils',
      'kitchen': 'fas fa-utensils',
      
      // Bathroom
      'phòng tắm riêng': 'fas fa-bath',
      'bathroom': 'fas fa-bath',
      'bể sục': 'fas fa-hot-tub',
      'jacuzzi': 'fas fa-hot-tub',
      
      // Balcony & Terrace
      'ban công': 'fas fa-vector-square',
      'balcony': 'fas fa-vector-square',
      'terrace': 'fas fa-vector-square',
      
      // Beach & Garden
      'beach': 'fas fa-umbrella-beach',
      'biển': 'fas fa-umbrella-beach',
      'nhìn ra biển': 'fas fa-umbrella-beach',
      'garden': 'fas fa-seedling',
      'vườn': 'fas fa-seedling',
      
      // Laundry
      'laundry': 'fas fa-tshirt',
      'giặt': 'fas fa-tshirt',
      
      // Tour & Activities
      'quầy tour': 'fas fa-map-marked-alt',
      'tour': 'fas fa-map-marked-alt',
      
      // Common Areas
      'common area': 'fas fa-users',
      'khu vực chung': 'fas fa-users',
      
      // Accommodation Types
      'căn hộ': 'fas fa-building',
      'apartment': 'fas fa-building',
      'nhà dân': 'fas fa-home',
      'homestay': 'fas fa-home',
      'nhà khách': 'fas fa-house-user',
      'guesthouse': 'fas fa-house-user',
      'nhà trọ': 'fas fa-bed',
      'hostel': 'fas fa-bed',
      'bed and breakfast': 'fas fa-coffee',
      'biệt thự': 'fas fa-chess-rook',
      'villa': 'fas fa-chess-rook',
      'nhà nghỉ mát': 'fas fa-umbrella-beach',
      'resort': 'fas fa-umbrella-beach',
      'khách sạn': 'fas fa-hotel',
      'hotel': 'fas fa-hotel',
      'cắm trại': 'fas fa-campground',
      'camping': 'fas fa-campground',
      
      // Ratings & Certificates
      'sao': 'fas fa-star',
      'điểm': 'fas fa-star',
      'rating': 'fas fa-star',
      'chứng chỉ': 'fas fa-award',
      'OYO Rooms':'fas fa-award',
      'certificate': 'fas fa-award',
      'bền vững': 'fas fa-leaf',
      'sustainable': 'fas fa-leaf',
    };

    // Tìm icon phù hợp
    const matchedKey = Object.keys(iconMap).find(key => 
      nameLower.includes(key.toLowerCase())
    );

    return iconMap[matchedKey] || 'fas fa-check';
  };

  return (
    <i style={{color:'white'}} className={`${getAmenityIcon(amenityName)} ${className}`}></i>
  );
};

export default AmenityIcon;