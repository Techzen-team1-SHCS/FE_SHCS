export const calculateDisplayPrice = (hotelData, finalPrice, discountAmount) => {
  const originalPrice = Number(hotelData?.total_price || 0);

  return {
    displayOriginalPrice: originalPrice,
    displayDiscountAmount: Number(discountAmount || 0),
    displayFinalPrice: Number(finalPrice || originalPrice)
  };
};