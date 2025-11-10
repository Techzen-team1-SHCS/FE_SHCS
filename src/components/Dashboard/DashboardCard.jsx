import React from 'react';
import styles from "./DashboardCard.module.css";

const DashboardCard = () => {
  const { container, card, cardTitle, cardAmount, cardGrowth, cardLogo, positive, negative } = styles;

  const cardData = [
    {
      id: 1,
      logo: "/assets/images/logos/revenue.png",
      title: "Revenue",
      amount: "$23,425",
      growth: "+201"
    },
    {
      id: 2,
      logo: "/assets/images/logos/booking.png",
      title: "New Booking",
      amount: "$1,925",
      growth: "-50" // Số âm ví dụ
    },
    {
      id: 3,
      logo: "/assets/images/logos/check-in.png",
      title: "New Check-in",
      amount: "$1537",
      growth: "+201"
    }
  ];

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

  return (
    <div className={container}>
      {cardData.map((item) => {
        const growthInfo = formatGrowth(item.growth);
        
        return (
          <div key={item.id} className={card}>
            <div>
              <div className={cardLogo}><img src={item.logo} alt={item.title} /></div>
              <div className={cardTitle}>{item.title}</div>
            </div>

            <div className='d-flex justify-content-between' style={{ width: '100%' }}>
              <div className={cardAmount}>{item.amount}</div>
              <div className={`${cardGrowth} ${growthInfo.className}`}>
                {growthInfo.arrow} {growthInfo.text}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCard;