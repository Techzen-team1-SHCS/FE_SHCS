import { useState } from "react";
import { discountService } from "../../../../services/discountService";
import { toast } from "react-toastify";

export const useDiscount = (hotelData, onPriceChange) => {
  const [finalPrice, setFinalPrice] = useState(
    hotelData?.final_price || hotelData?.total_price || 0
  );

  const [discountAmount, setDiscountAmount] = useState(
    hotelData?.discount_amount || 0
  );

  const [appliedCoupon, setAppliedCoupon] = useState(
    hotelData?.discount_code || ""
  );

  const [discountError, setDiscountError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const applyDiscount = async (coupon) => {
    if (!coupon.trim()) {
      setDiscountError("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      setIsApplying(true);
      setDiscountError("");

      const res = await discountService.applyDiscount(
        hotelData?.id,
        coupon
      );

      const newFinalPrice = res.final_price || res.data?.final_price;
      const newDiscountAmount = res.discount_amount || res.data?.discount_amount;

      setFinalPrice(newFinalPrice);
      setDiscountAmount(newDiscountAmount);
      setAppliedCoupon(coupon);

      toast.success(
        `Áp dụng mã ${coupon} thành công!`
      );

      if (onPriceChange) {
        onPriceChange({
          finalPrice: newFinalPrice,
          discountAmount: newDiscountAmount,
          originalPrice: hotelData?.total_price
        });
      }

    } catch (err) {
      const errorMsg =
        err.message || "Mã giảm giá không hợp lệ";

      setDiscountError(errorMsg);
      toast.error(errorMsg);

    } finally {
      setIsApplying(false);
    }
  };

  return {
    finalPrice,
    discountAmount,
    appliedCoupon,
    discountError,
    isApplying,
    applyDiscount
  };
};