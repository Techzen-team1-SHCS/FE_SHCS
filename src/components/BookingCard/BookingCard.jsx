import React from "react";
import styles from "../../pages/Profile/Profile.module.css";

const BookingCard = ({ booking }) => {
  return (
    <div className={styles.card}>
      <h3>{booking.city}</h3>
      <p>{booking.date}</p>
      <div className={styles.cardBody}>
        <img src={booking.image} alt={booking.name} />
        <div>
          <h4>{booking.name}</h4>
          <p>{booking.date}</p>
          <p>{booking.price}</p>
          <span>{booking.status}</span>
        </div>
      </div>
      <button className={styles.rebookBtn}>Xem chi tiết</button>
    </div>
  );
};

export default BookingCard;
