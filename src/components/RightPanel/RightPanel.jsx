import React from 'react';
import styles from './RightPanel.module.css';
import GuestSatisfactionChart from '../GuestSatisfactionChart/GuestSatisfactionChart';

const RightPanel = () => {
    const {
        rightPanel,
        section,
        sectionTitle,
        statsGrid,
        statItem,
        statLabel,
        statValue,
        reservationsList,
        reservationCard,
        hotelName,
        location,
        checkInOut,
        timeSlot,
        timeLabel,
        timeValue,
        divider,
        divider2,
        divider3,
        title,
        time
    } = styles;

    const hotelStats = {
        appointments: '4,250',
        totalRevenue: '32.1k',
        rating: '4.8'
    };

    const upcomingReservations = [
        {
            id: 1,
            hotel: ' hotels',
            location: 'Hal Chau, Da Nang, Viet Nam',
            checkIn: '14:00 am 18/09/2025',
        },
        {
            id: 2,
            hotel: 'Annual homestay',
            location: 'Cau Giay, Ha Noi, Viet Nam',
            checkIn: '14:00 am 23/09/2025',
        }
    ];

    const satisfactionData = [
        { level: 'Excellent', percentage: '75%', count: '45,251' },
        { level: 'Good', percentage: '20%', count: '12,067' },
        { level: 'Poor', percentage: '5%', count: '3,017' }
    ];

    return (
        <div className={rightPanel}>
            {/* Hotel Manager Stats */}
            <div className={section}>
                <h3 className={sectionTitle}>Hotel Manager Dashboard</h3>
                <div className={statsGrid}>
                    <div className={statItem}>
                        <span className={statLabel}>Appointment</span>
                        <span className={statValue}>{hotelStats.appointments}</span>
                    </div>
                    <hr className={divider}></hr>
                    <div className={statItem}>
                        <span className={statLabel}>Total Revenue</span>
                        <span className={statValue}>{hotelStats.totalRevenue}</span>
                    </div>
                    <hr className={divider}></hr>
                    <div className={statItem}>
                        <span className={statLabel}>Rating</span>
                        <span className={statValue}>{hotelStats.rating}</span>
                    </div>
                </div>
                <hr className={divider2}></hr>

            </div>
            {/* Reservations */}
            <div className={section}>
                <h3 className={title}>Reservations</h3>
                <div className={reservationsList}>
                    <div className={time}>Sep, 2025
                        <hr className={divider3} />
                    </div>
                    {upcomingReservations.slice(0, 2).map(reservation => (
                        <div key={reservation.id} className={reservationCard}>
                            <div style={{ paddingLeft: "30px", paddingTop: "15px" }}>
                                <h4 className={hotelName}>{reservation.hotel}</h4>
                                <p className={location}>{reservation.location}</p>
                                <div className={checkInOut}>
                                    <div className={timeSlot}>
                                        <span className={timeLabel}>check in</span>
                                        <span className={timeValue}>{reservation.checkIn}</span>
                                    </div>
                                </div>
                            </div>

                            <hr className={divider2}></hr>
                        </div>
                    ))}
                </div>
            </div>

            {/* Guest Satisfaction */}
            <GuestSatisfactionChart />
        </div>
    );
};

export default RightPanel;