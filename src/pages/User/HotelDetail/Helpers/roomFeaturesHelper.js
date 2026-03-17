export const getRoomFeatureValue = (key, room) => {
  switch (key) {
    case "guest":
      return `${room?.max_guest || 2} người`;

    case "area":
      return "70 m²";

    case "price":
      return `${Number(room?.price || 0).toLocaleString("vi-VN")}₫`;

    case "discount":
      return "-15%";

    default:
      return "";
  }
};