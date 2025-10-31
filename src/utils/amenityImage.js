// utils/amenityMapping.js
export const amenityImages = {
  // Các bộ lọc phổ biến
  'wifi': '/assets/images/amenities/wifi.png',
  'hồ bơi': '/assets/images/amenities/pool.jpg',
  'trung tâm spa & chăm sóc sức khoẻ': '/assets/images/amenities/spa.jpg',
  'ban công': '/assets/images/amenities/balcony.jpg',
  'phòng tắm riêng': '/assets/images/amenities/bathroom.jpg',
  'bể sục': '/assets/images/amenities/jacuzzi1.jpg',
  'kitchenette': '/assets/images/amenities/kitchen.jpg',

  // Chứng chỉ
  // Thương hiệu
  'oyo rooms': '/assets/images/amenities/oyo.jpg',
  'vba hospitality group': '/assets/images/amenities/vba.jpg',
  'somerset': '/assets/images/amenities/somerset.jpg',
  'belvilla': '/assets/images/amenities/belvilla.jpg',
  'muong thanh hospitality': '/assets/images/amenities/muong-thanh.jpg',
  'intercontinental hotels & resorts': '/assets/images/amenities/intercontinental.jpg',

  // Tiện nghi
  'nhà hàng': '/assets/images/amenities/restaurant.jpg',
  'dịch vụ phòng': '/assets/images/amenities/room-service.jpg',
  'lễ tân 24 giờ': '/assets/images/amenities/reception.jpg',
  'trung tâm thể dục': '/assets/images/amenities/gym.jpg',
  'bar': '/assets/images/amenities/bar.jpg',
  'quầy tour': '/assets/images/amenities/tour-desk.jpg',
  'shared kitchen': '/assets/images/amenities/shared-kitchen.jpg',
  'laundry': '/assets/images/amenities/laundry.jpg',
  'sky bar': '/assets/images/amenities/sky-bar.jpg',
  'beach access': '/assets/images/amenities/beach.jpg',
  'garden': '/assets/images/amenities/garden.jpg',
  'Terrace': '/assets/images/amenities/terrace.jpg',
  'restaurant': '/assets/images/amenities/restaurant.jpg',
  'Family rooms': '/assets/images/amenities/family-room.jpg',
  // Tiện nghi phòng
  'hồ bơi riêng': '/assets/images/amenities/private-pool.jpg',
  'nhìn ra biển': '/assets/images/amenities/sea-view.jpg',
  'common area': '/assets/images/amenities/common-area.jpg',
  'căn hộ': '/assets/images/amenities/apartment.jpg',
  'phòng gia đình': '/assets/images/amenities/family-room.jpg',

  // Điểm đánh giá
  'tuyệt hảo: 9 điểm trở lên': '/assets/images/amenities/excellent.jpg',
  'rất tốt: 8 điểm trở lên': '/assets/images/amenities/very-good.jpg',
  'tốt: 7 điểm trở lên': '/assets/images/amenities/good.jpg',
  'dễ chịu: 6 điểm trở lên': '/assets/images/amenities/pleasant.jpg',

  // Loại chỗ ở
  'chỗ nghỉ nhà dân': '/assets/images/amenities/homestay.jpg',
  'nhà khách': '/assets/images/amenities/guesthouse.jpg',
  'nhà trọ': '/assets/images/amenities/hostel.jpg',
  'nhà nghỉ b&b': '/assets/images/amenities/bnb.jpg',
  'biệt thự': '/assets/images/amenities/villa.jpg',
  'nhà nghỉ mát': '/assets/images/amenities/holiday-home.jpg',
  'khách sạn tình nhân': '/assets/images/amenities/love-hotel.jpg',
  'khách sạn khoang ngủ': '/assets/images/amenities/capsule-hotel.jpg',
  'resort': '/assets/images/amenities/resort.jpg',
  'khu cắm trại': '/assets/images/amenities/camping.jpg',
  'nhà nghỉ giữa thiên nhiên': '/assets/images/amenities/nature-lodge.jpg'
};

export const getAmenityImage = (amenityName) => {
  if (!amenityName) return '/assets/images/amenities/default.jpg';

  const nameLower = amenityName.toLowerCase().trim();
  
  // Tìm exact match trước
  let matchedKey = Object.keys(amenityImages).find(key => 
    nameLower === key.toLowerCase()
  );

  // Không tìm thấy thì tìm partial match
  if (!matchedKey) {
    matchedKey = Object.keys(amenityImages).find(key => 
      nameLower.includes(key.toLowerCase()) || key.toLowerCase().includes(nameLower)
    );
  }

  return amenityImages[matchedKey] || '/assets/images/amenities/default.jpg';
};