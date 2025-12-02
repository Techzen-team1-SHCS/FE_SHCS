import React, { useEffect, useState } from 'react';
import styles from "./DashboardCard.module.css";
import { dashboardService } from '../../../services/dashBoardService';
import { formatVND } from '../../../utils/dateUtils';
import { authService } from '../../../services/authService';
const DashboardCard = () => {
  const { container, card, cardTitle, cardAmount, cardGrowth, cardLogo, positive, negative } = styles;
  const [revenue,setRevenue] = useState(0);
  const [month,setMonth]=useState(0);
  const [userData,setUserData]=useState(0);
  useEffect(() => {
  const fetchData = async () => {
    try {
      const revenueData = await dashboardService.getDashboardRevenue();
      setRevenue(revenueData);
      const getByMonth=await dashboardService.getBookingsByMonth();
      setMonth(getByMonth);
      const getUserActive=await authService.getAllUsers();
      setUserData(getUserActive);
    } catch (error) {
      console.error(error.response?.data?.message || 'Failed to fetch dashboard revenue');
    }
  };
  fetchData();
}, []);
  const cardData = [
        {
            id: 1,
            logo: "/assets/images/logos/revenue.png",
            title: "Revenue",
            amount: revenue,
            growth: "+201"
        },
        {
            id: 2,
            logo: "/assets/images/logos/booking.png",
            title: "New Booking",
            amount: month,
            growth: "+201"
        },
        {
            id: 3,
            logo: "/assets/images/logos/check-in.png",
            title: "User Active",
            amount: userData.length,
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
          <div className={cardTitle}>Revenue</div>
        </div>

        <div className='d-flex justify-content-between' style={{ width: '100%' }}>
          <div className={cardAmount}>{formatVND(revenueCard.amount) || 0}</div>
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
          <div className={cardTitle}>New Booking</div>
        </div>

        <div className='d-flex justify-content-between' style={{ width: '100%' }}>
          <div className={cardAmount}>{bookingCard?.amount || '0'}</div>
          {bookingCard?.growth && (
            <div className={`${cardGrowth} ${bookingGrowth.className}`}>
              {bookingGrowth?.arrow} {bookingGrowth?.text}
            </div>
          )}
        </div>
      </div>
      <div className={card}>
        <div>
          <div className={cardLogo}><img src={"/assets/images/logos/check-in.png"} alt="check-in" /></div>
          <div className={cardTitle}>User Active</div>
        </div>
        <div className='d-flex justify-content-between' style={{ width: '100%' }}>
          <div className={cardAmount}>{checkinCard?.amount || '0'}</div>
          {checkinCard.growth && (
            <div className={`${cardGrowth} ${checkinGrowth.className}`}>
              {checkinGrowth?.arrow} {checkinGrowth?.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;