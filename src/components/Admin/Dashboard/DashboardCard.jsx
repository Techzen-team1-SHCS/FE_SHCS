import React, { useEffect, useRef, useState } from 'react';
import styles from "./DashboardCard.module.css";
import { dashboardService } from '../../../services/dashBoardService';
import { formatVND } from '../../../utils/dateUtils';

const DashboardCard = () => {
  const {
    container,
    card,
    cardTitle,
    cardAmount,
    cardGrowth,
    cardLogo,
    positive,
    negative
  } = styles;

  const [revenue, setRevenue] = useState(0);
  const [month, setMonth] = useState(0);
  const [userActive, setUserActive] = useState(0);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchData = async () => {
      const data = await dashboardService.dashboardSummary();
      setRevenue(data.revenue || 0);
      setMonth(data.new_booking || 0);
      setUserActive(data.user_active || 0);
    };

    fetchData();
  }, []);

  const cardData = [
    {
      id: 1,
      logo: "/assets/images/logos/revenue.png",
      title: "Revenue",
      amount: revenue,
      growth: "+201",
    },
    {
      id: 2,
      logo: "/assets/images/logos/booking.png",
      title: "New Booking",
      amount: month,
      growth: "+201",
    },
    {
      id: 3,
      logo: "/assets/images/logos/check-in.png",
      title: "User Active",
      amount: userActive,
      growth: "+201",
    },
  ];

  const formatGrowth = (growth) => {
    const number = parseInt(growth);
    if (number >= 0) {
      return { text: `+${number}`, className: positive, arrow: '▲' };
    }
    return { text: `${number}`, className: negative, arrow: '▼' };
  };

  const revenueGrowth = formatGrowth(cardData[0].growth);
  const bookingGrowth = formatGrowth(cardData[1].growth);
  const checkinGrowth = formatGrowth(cardData[2].growth);

  return (
    <div className={container}>
      {/* Revenue */}
      <div className={card}>
        <div>
          <div className={cardLogo}>
            <img src={cardData[0].logo} alt="revenue" />
          </div>
          <div className={cardTitle}>Revenue</div>
        </div>
        <div className="d-flex justify-content-between" style={{ width: '100%' }}>
          <div className={cardAmount}>{formatVND(revenue)}</div>
          <div className={`${cardGrowth} ${revenueGrowth.className}`}>
            {revenueGrowth.arrow} {revenueGrowth.text}
          </div>
        </div>
      </div>

      {/* Booking */}
      <div className={card}>
        <div>
          <div className={cardLogo}>
            <img src={cardData[1].logo} alt="booking" />
          </div>
          <div className={cardTitle}>New Booking</div>
        </div>
        <div className="d-flex justify-content-between" style={{ width: '100%' }}>
          <div className={cardAmount}>{month}</div>
          <div className={`${cardGrowth} ${bookingGrowth.className}`}>
            {bookingGrowth.arrow} {bookingGrowth.text}
          </div>
        </div>
      </div>

      {/* User Active */}
      <div className={card}>
        <div>
          <div className={cardLogo}>
            <img src={cardData[2].logo} alt="check-in" />
          </div>
          <div className={cardTitle}>User Active</div>
        </div>
        <div className="d-flex justify-content-between" style={{ width: '100%' }}>
          <div className={cardAmount}>{userActive}</div>
          <div className={`${cardGrowth} ${checkinGrowth.className}`}>
            {checkinGrowth.arrow} {checkinGrowth.text}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
