import React from 'react';
import styles from './RightPanel.module.css';
import GuestSatisfactionChart from '../Charts/GuestSatisfactionChart/GuestSatisfactionChart';

const RightPanel = ({ hotelStats, upcomingReservations,satisfactionData }) => {
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

    return (
        <div className={rightPanel}>
            {/* Hotel Manager Stats */}
            <div className={section}>
                <h3 className={sectionTitle}>Hotel Manager Dashboard</h3>
                <div className={statsGrid}>
                    <div className={statItem}>
                        <span className={statLabel}>Occupancy Rate</span>
                        <span className={statValue}>{hotelStats?.occupancyRate}</span>
                    </div>
                    <hr className={divider}></hr>
                    <div className={statItem}>
                        <span className={statLabel}>Pending Reservations</span>
                        <span className={statValue}>{hotelStats?.pendingReservations}</span>
                    </div>
                    <hr className={divider}></hr>
                    <div className={statItem}>
                        <span className={statLabel}>Average Rating</span>
                        <span className={statValue}>{hotelStats?.averageRating}</span>
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
                    {upcomingReservations?.slice(0, 2).map(reservation => (
                        <div key={reservation?.id} className={reservationCard}>
                            <div style={{ paddingLeft: "30px", paddingTop: "15px" }}>
                                <h4 className={hotelName}>{reservation?.hotel}</h4>
                                <p className={location}>{reservation?.location}</p>
                                <div className={checkInOut}>
                                    <div className={timeSlot}>
                                        <span className={timeLabel}>check in</span>
                                        <span className={timeValue}>{reservation?.checkIn}</span>
                                    </div>
                                </div>
                            </div>

                            <hr className={divider2}></hr>
                        </div>
                    ))}
                </div>
            </div>

            {/* Guest Satisfaction */}
            <GuestSatisfactionChart satisfactionData={satisfactionData}/>
        </div>
    );
};

export default RightPanel;