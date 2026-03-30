export const hotels = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  name: "Tran Vy Homestay",
  hotelId: "12345",
  rating: 4.2,
  revenue: "250,000,000 vnd",
  totalRooms: 120,
  availableRooms: 50,
  date: "14-Aug-2023 at 12:00 AM",
  status: i % 2 === 0 ? "Open" : "Close",
}));