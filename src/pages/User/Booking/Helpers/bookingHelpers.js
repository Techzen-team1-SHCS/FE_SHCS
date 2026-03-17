export const getDisplayPrice = (price) => {
  return price.finalPrice || price.originalPrice;
};

export const hasDiscount = (price) => {
  return price.discountAmount > 0;
};