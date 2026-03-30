export const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }) + " từ " + date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
};
export const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const getNights = (checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end - start;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
export const getFreeCancelDeadline = (checkInDate, freeDays) => {
  const checkIn = new Date(checkInDate);
  checkIn.setDate(checkIn.getDate() - freeDays);
  return checkIn;
};

// Tính phí huỷ thực tế
export const calculateCancelFee = (booking, percent = 50) => {
  if (booking.cancel_fee) return booking.cancel_fee;
  // Nếu cancel_fee null, tính theo % total_price
  return (Number(booking.total_price) * percent) / 100;
};
export const getCancelPolicy = (booking) => {
  const checkIn = new Date(booking.check_in);
  const createdAt = new Date(booking.created_at);
  const freeDays = booking.cancel_free_days ?? 0;

  // Nếu backend có cancel_fee cố định thì dùng, ngược lại tính theo % giá phòng
  const cancelFee = booking.cancel_fee
    ? Number(booking.cancel_fee)
    : Number(booking.total_price) * 0.5; // mặc định 50%

  // Tính hạn chót hủy miễn phí (check_in - freeDays)
  const freeCancelDeadline = new Date(checkIn);
  freeCancelDeadline.setDate(checkIn.getDate() - freeDays);

  // Tính số ngày giữa ngày đặt và ngày check_in
  const diffDays = Math.ceil((checkIn - createdAt) / (1000 * 60 * 60 * 24));

  // Nếu khách đặt phòng sát ngày check-in (dưới số ngày miễn phí)
  if (diffDays < freeDays) {
    return {
      hasFreeCancel: false,
      message: "Đặt phòng sát ngày, huỷ sẽ bị tính phí ngay.",
      cancelFee,
    };
  }

  // Ngược lại, vẫn có khoảng thời gian miễn phí
  return {
    hasFreeCancel: true,
    freeCancelDeadline,
    cancelFee,
  };
};
