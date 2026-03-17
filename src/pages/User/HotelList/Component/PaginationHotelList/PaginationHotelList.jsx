import HotelCard from "../HotelCard/HotelCard";

function PaginationHotelList({ hotels }) {

  return (
    <div className="hotel-list-pagination">

      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}

    </div>
  );
}

export default PaginationHotelList;