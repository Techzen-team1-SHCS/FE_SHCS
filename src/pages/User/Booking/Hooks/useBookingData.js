import { useEffect, useState } from "react";
import { bookingService } from "../../../../services/bookingService";
import { toast } from "react-toastify";

export const useBookingData = (bookingId) => {
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bookingPrice, setBookingPrice] = useState({
    finalPrice: 0,
    discountAmount: 0,
    originalPrice: 0,
  });

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);

        const response = await bookingService.getBooking(bookingId);
        const data = response.data;

        setHotelData(data);

        setBookingPrice({
          originalPrice: Number(data.total_price),
          finalPrice: Number(data.total_price),
          discountAmount: 0,
        });
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu đặt phòng");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [bookingId]);

  return {
    hotelData,
    loading,
    bookingPrice,
    setBookingPrice,
  };
};