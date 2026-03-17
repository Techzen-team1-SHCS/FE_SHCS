import React from "react";
import styles from "./HotelDescriptionSection.module.css";
import Loader from "../../../../../components/Loading/Loader";
import AvailableRooms from "../AvailableRooms/AvailableRooms";

const HotelDescriptionSection = ({
  hotelData,
  showAvailableRooms,
  availableRooms,
  searchParams,
  handleRoomSelect,
  searchAvailableRoomsMutation,
  availableRoomsSectionRef
}) => {

  return (
    <div className={styles.hotelDescription}>

      {/* Hotel Description */}
      <h2 className={styles.title}>
        Mô tả khách sạn
      </h2>

      <p className={styles.description}>
        {hotelData?.text || "Description"}
      </p>


      {/* Loading State */}
      {searchAvailableRoomsMutation.isLoading && (
        <div className={styles.availableLoading}>
          <Loader />
          <p>Đang tìm phòng trống...</p>
        </div>
      )}


      {/* Error State */}
      {searchAvailableRoomsMutation.isError && (
        <div className={styles.availableError}>
          😕 Không thể tìm phòng lúc này, vui lòng thử lại
        </div>
      )}


      {/* Available Rooms */}
      {showAvailableRooms && !searchAvailableRoomsMutation.isLoading && (
        <section
          id="available-rooms-section"
          ref={availableRoomsSectionRef}
          className={styles.availableRoomsSection}
        >

          <h3 className={styles.availableTitle}>
            Phòng có sẵn ({availableRooms.length})
          </h3>

          {availableRooms.length > 0 ? (
            <AvailableRooms
              availableRooms={availableRooms}
              searchParams={searchParams}
              onRoomSelect={handleRoomSelect}
            />
          ) : (
            <div className={styles.noRooms}>
              <div className={styles.noRoomsIcon}>🏨</div>

              <h4 className={styles.noRoomsTitle}>
                Không có phòng trống
              </h4>

              <p className={styles.noRoomsText}>
                Không tìm thấy phòng trống cho khoảng thời gian đã chọn
              </p>
            </div>
          )}

        </section>
      )}

    </div>
  );
};

export default React.memo(HotelDescriptionSection);