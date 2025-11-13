import React from 'react';
import styles from "./DashboardCard.module.css";

const DashboardCard = ({ cardData }) => {
  const { container, card, cardTitle, cardAmount, cardGrowth, cardLogo, positive, negative } = styles;
  const formatGrowth = (growth) => {
    const number = parseInt(growth);
    if (number >= 0) {
      return {
        text: `+${number}`,
        className: positive,
        arrow: '▲'
      };
    } else {
      return {
        text: `${number}`,
        className: negative,
        arrow: '▼'
      };
    }
  };
  const revenueCard = cardData[0] || {};
  const bookingCard = cardData[1] || {};
  const checkinCard = cardData[2] || {};

  const revenueGrowth = formatGrowth(revenueCard?.growth);
  const bookingGrowth = formatGrowth(bookingCard?.growth);
  const checkinGrowth = formatGrowth(checkinCard?.growth);
  return (
    <div className={container}>
      <div className={card}>
        <div>
          <div className={cardLogo}><img src={"/assets/images/logos/revenue.png"} alt="revenue" /></div>
          <div className={cardTitle}>revenue</div>
        </div>

        <div className='d-flex justify-content-between' style={{ width: '100%' }}>
          <div className={cardAmount}>{revenueCard.amount || '$0'}</div>
          {revenueCard.growth && (
            <div className={`${cardGrowth} ${revenueGrowth.className}`}>
              {revenueGrowth.arrow} {revenueGrowth.text}
            </div>
          )}
        </div>
      </div>
      <div className={card}>
        <div>
          <div className={cardLogo}><img src={"/assets/images/logos/booking.png"} alt="booking" /></div>
          <div className={cardTitle}>booking</div>
        </div>

        <div className='d-flex justify-content-between' style={{ width: '100%' }}>
          <div className={cardAmount}>{bookingCard?.amount || '$0'}</div>
          {bookingGrowth?.growth && (
            <div className={`${cardGrowth} ${bookingGrowth.className}`}>
              {bookingCard?.arrow} {bookingGrowth?.text}
            </div>
          )}
        </div>
      </div>
      <div className={card}>
        <div>
          <div className={cardLogo}><img src={"/assets/images/logos/check-in.png"} alt="check-in" /></div>
          <div className={cardTitle}>check-in</div>
        </div>

        <div className='d-flex justify-content-between' style={{ width: '100%' }}>
          <div className={cardAmount}>{checkinCard?.amount || '$0'}</div>
          {checkinCard.growth && (
            <div className={`${cardGrowth} ${checkinGrowth.className}`}>
              {checkinGrowth.arrow} {checkinGrowth.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;