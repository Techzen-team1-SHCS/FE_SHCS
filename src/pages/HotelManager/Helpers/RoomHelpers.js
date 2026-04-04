export const filterRoomsByTab = (rooms, activeTab) => {
  if (activeTab === "All") return rooms;

  if (activeTab === "Available")
    return rooms.filter((room) => room.availability_status === "available");
  if (activeTab === "Booked")
    return rooms.filter((room) => room.availability_status === "unavailable");
  if (activeTab === "Needs Cleaning")
    return rooms.filter((room) => room.availability_status === "dirty");

  return rooms;
};

export const searchRooms = (rooms, search) => {
  if (!search) return rooms;
  const term = search.trim().toLowerCase();
  return rooms.filter((room) => {
    const roomId = (room.id || "").toString().toLowerCase();
    const roomType = (room.room_type || "").toLowerCase();
    const amenities = Array.isArray(room.amenities)
      ? room.amenities.join(", ").toLowerCase()
      : (room.amenities || "").toLowerCase();
    return roomId.includes(term) || roomType.includes(term) || amenities.includes(term);
  });
};

export const getRoomStatusClass = (status) => {
  switch (status) {
    case "available":
      return "vacant";
    case "unavailable":
      return "occupied";
    case "dirty":
      return "dirty";
    default:
      return "";
  }
};

export const getAvailabilityLabel = (status) => {
  switch (status) {
    case "available":
      return "Available";
    case "unavailable":
      return "Unavailable";
    case "dirty":
      return "Needs Cleaning";
    default:
      return status || "Unknown";
  }
};
