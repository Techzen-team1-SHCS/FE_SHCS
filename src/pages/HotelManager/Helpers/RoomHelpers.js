export const filterRoomsByTab = (rooms, activeTab) => {
  if (activeTab === "All") return rooms;

  if (activeTab === "Available") return rooms.filter((room) => room.availability === "Vacant");
  if (activeTab === "Booked")
    return rooms.filter((room) => ["Occupied", "Reserved"].includes(room.availability));
  if (activeTab === "Needs Cleaning") return rooms.filter((room) => room.availability === "Dirty");

  return rooms;
};

export const searchRooms = (rooms, search) => {
  if (!search) return rooms;
  const term = search.trim().toLowerCase();
  return rooms.filter((room) =>
    room.roomNo.toLowerCase().includes(term) || room.roomType.toLowerCase().includes(term) || room.description.toLowerCase().includes(term)
  );
};

export const getRoomStatusClass = (status) => {
  switch (status) {
    case "Vacant":
      return "vacant";
    case "Occupied":
      return "occupied";
    case "Reserved":
      return "reserved";
    case "Dirty":
      return "dirty";
    case "Out of stock":
      return "outOfStock";
    case "Pending":
      return "pending";
    default:
      return "";
  }
};
