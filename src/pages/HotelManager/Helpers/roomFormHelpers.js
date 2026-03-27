export const validateRoomForm = (form) => {
  const errors = {};

  if (!form.roomNo?.toString().trim()) errors.roomNo = "Vui lòng nhập số phòng";
  if (!form.floor?.toString().trim()) errors.floor = "Vui lòng nhập tầng";
  if (!form.capacity || Number(form.capacity) <= 0) errors.capacity = "Sức chứa không hợp lệ";
  if (!form.pricePerNight || Number(form.pricePerNight) <= 0) errors.pricePerNight = "Giá phải lớn hơn 0";
  if (!form.description?.trim()) errors.description = "Vui lòng nhập mô tả";

  return errors;
};
