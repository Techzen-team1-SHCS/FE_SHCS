import { useState } from "react";
import { initialFormData } from "../Constants/bookingInitialState";

export const useBookingForm = (initialCoupon) => {
  const [formData, setFormData] = useState({
    ...initialFormData,
    coupon: initialCoupon || ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    formData,
    setFormData,
    handleInputChange
  };
};