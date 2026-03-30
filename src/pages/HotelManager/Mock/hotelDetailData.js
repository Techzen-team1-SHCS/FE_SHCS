export const hotelDetail = {
  id: 1,
  name: "Hilton Danang",
  address: "50 Bach Dang, Hai Chau, Da Nang",
  description:
    "Centrally located along the Han River, Hilton Danang offers modern rooms with stunning views and premium amenities.",
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
  ],
  services: ["Television", "Private bathroom", "Welcome Drink", "Swimming Pool"],
  rooms: [
    { id: 1, name: "Deluxe Room", price: 120 },
    { id: 2, name: "Suite Room", price: 220 },
  ],
  reviews: [
    {
      id: 1,
      name: "Phan Van A",
      comment: "Very nice hotel, clean and friendly staff",
      rating: 5,
    },
    {
      id: 2,
      name: "Tran Van B",
      comment: "Good location but a bit noisy",
      rating: 4,
    },
  ],
};