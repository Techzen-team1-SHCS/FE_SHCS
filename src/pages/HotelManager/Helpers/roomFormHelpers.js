export const validateRoomForm = (form) => {
  const errors = {};

  if (!form.hotel_id) errors.hotel_id = "Vui lòng chọn khách sạn";
  if (!form.room_type?.trim()) errors.room_type = "Vui lòng chọn loại phòng";
  if (!form.max_guest || Number(form.max_guest) <= 0) errors.max_guest = "Số khách tối đa không hợp lệ";
  if (!form.price || Number(form.price) <= 0) errors.price = "Giá phải lớn hơn 0";

  return errors;
};
