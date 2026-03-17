export const getHotelImage = (hotel) => {
  return hotel?.images?.[0]?.url || "/default-hotel.jpg";
};

export const getHotelGuest = (hotel) => {
  return hotel?.rooms?.[0]?.max_guest || "N/A";
};
export const getHotelStars = (hotel) => {
  return Math.floor((hotel?.hotel_class || 0) / 10);
};