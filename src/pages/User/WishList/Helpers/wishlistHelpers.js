export const getRatingColor = (rating) => {
  if (rating >= 4.5) return "#10B981";
  if (rating >= 4.0) return "#F59E0B";
  if (rating >= 3.5) return "#EF4444";
  return "#6B7280";
};

export const getRatingText = (rating) => {
  if (rating >= 4.5) return "Xuất sắc";
  if (rating >= 4.0) return "Tốt";
  if (rating >= 3.5) return "Khá";
  return "Trung bình";
};

export const filterWishlistByRating = (wishList, selected, options) => {
  if (selected === 0) return wishList;

  const optionSelected = options.find((opt) => opt.value === selected);

  return wishList.filter((item) => {
    const rating = item.hotel.hotel_class / 10;

    if (optionSelected.exact) {
      return rating === selected;
    }

    return rating >= selected;
  });
};