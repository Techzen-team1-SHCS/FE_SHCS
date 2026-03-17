import styles from "../../Booking.module.css";

import BookingDetailCard from "../BookingDetailCard/BookingDetailCard";
import PriceSummaryCard from "../PriceSummaryCard/PriceSummaryCard";
import CancelPolicyCard from "../CancelPolicyCard/CancelPolicyCard";
import BookingConditionCard from "../BookingConditionCard/BookingConditionCard";

const BookingLeftPanel = ({
  hotel,
  hotelData,
  bookingPrice,
  cancelPolicy,
  hasDiscount,
  displayPrice,
}) => {
  return (
    <div className={styles.bookingLeft}>
      <img
        className={styles.bookingHotelImage}
        src={hotel?.room?.hotel?.images?.[1]?.url}
        alt={hotelData.name}
      />

      <div className={styles.bookingDatePicker}>
        <BookingDetailCard hotel={hotel} />

        <PriceSummaryCard
          hotel={hotel}
          bookingPrice={bookingPrice}
          hasDiscount={hasDiscount}
          displayPrice={displayPrice}
        />

        <CancelPolicyCard cancelPolicy={cancelPolicy} />

        <BookingConditionCard />
      </div>
    </div>
  );
};

export default BookingLeftPanel;