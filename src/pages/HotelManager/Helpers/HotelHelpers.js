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
export const formatHotelClass = (value) => {
  if (!value) return "1.0";
  return value.toString().includes(".") ? value : `${value}.0`;
};

export const getImageUrl = (item) => {
  if (!item) return "/default-hotel.jpg";
  if (typeof item === "string") return item;
  if (typeof item === "object" && item.url) return item.url;
  return "/default-hotel.jpg";
};

export const extractImageRefs = (images) => {
  return images
    .map((image) => {
      if (!image) return null;
      if (typeof image === "string") return image;
      if (image.id) return image.id;
      if (image.image_id) return image.image_id;
      return image.url || image;
    })
    .filter(Boolean);
};

export const disableButton = (status) => {
  return status === "approved";
};
