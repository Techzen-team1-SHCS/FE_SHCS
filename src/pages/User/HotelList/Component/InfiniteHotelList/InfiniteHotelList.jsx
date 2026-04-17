import HotelCard from "../HotelCard/HotelCard";

function InfiniteHotelList({
  hotels,
  sentinelPosition,
  hasNextPage,
  isFetchingNextPage,
  loadMoreRef,
  totalResults
}) {
  return (
    <div className="hotel-list-infinite">

      {hotels.map((hotel, index) => (
        <div key={`${hotel.id}-${index}`}>
          <HotelCard hotel={hotel} index={index} />

          {index === sentinelPosition && hasNextPage && (
            <div
              ref={loadMoreRef}
              className="mid-list-sentinel"
              style={{
                height: "1px",
                width: "100%",
                background: "transparent",
                margin: "10px 0",
              }}
            />
          )}
        </div>
      ))}

      {isFetchingNextPage && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Đang tải thêm khách sạn...
        </div>
      )}

      {!hasNextPage && hotels.length > 0 && (
        <div className="infinite-end-message">
          <p>🎉 Bạn đã xem hết tất cả {totalResults} khách sạn!</p>
        </div>
      )}

    </div>
  );
}

export default InfiniteHotelList;