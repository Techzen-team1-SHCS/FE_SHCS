import Hotel from "../../../../../components/Hotel/Hotel";

function HotelCard({ hotel, index }) {

  const firstRoom = hotel.firstroom;

  const duration =
    firstRoom?.available_from && firstRoom?.available_to
      ? `Từ ${firstRoom.available_from} đến ${firstRoom?.available_to}`
      : "Chưa có thông tin";

  return (
    <Hotel
      key={`${hotel.id}-${index || ""}`}
      image={hotel.firstimage?.url || "/default-hotel.jpg"}
      title={hotel.name}
      description={hotel.description}
      location={hotel.province}
      duration={duration}
      guests={firstRoom?.max_guest || 0}
      price={`${hotel.price_formatted || hotel.price} VNĐ`}
      badgeLabel={hotel.badge}
      badgeClass={hotel.hotel_class}
      rating={(hotel.hotel_class / 10).toFixed(1)}
      detailsUrl={`/hotel/${hotel.id}`}
      id={hotel.id}
    />
  );
}

export default HotelCard;