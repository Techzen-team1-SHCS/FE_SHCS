export const getPaginationPages = (totalPages) => {
  return Array.from({ length: totalPages }, (_, i) => i + 1);
};

export function filterHotels(hotels, activeTab) {
  if (activeTab === "All") return hotels;

  return hotels.filter((hotel) => hotel.status === activeTab);
}

export const renderStars = (rating) => {
  return "⭐".repeat(rating);
};
export const disableButton = (status) => {
  return status === 'pending';
};
