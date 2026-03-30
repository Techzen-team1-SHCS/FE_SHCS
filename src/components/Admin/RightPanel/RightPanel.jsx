import { useEffect, useState } from 'react';
import styles from './RightPanel.module.css';
import GuestSatisfactionChart from '../Charts/GuestSatisfactionChart/GuestSatisfactionChart';
import { dashboardService } from '../../../services/dashBoardService';

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
     const [hotelStats, setHotelStats] = useState(null);
    const [upcomingReservations] = useState([]); // nếu có API riêng
    const [satisfactionData, setSatisfactionData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const data = await dashboardService.getBookingStats();
            if (data) {
                setHotelStats({
                    occupancyRate: data.occupancyRate,
                    pendingReservations: data.pendingReservations,
                    averageRating: data.averageRating
                });
                setSatisfactionData({
                    data: [
                        data.guestSatisfaction.excellent,
                        data.guestSatisfaction.good,
                        data.guestSatisfaction.poor
                    ],
                    labels: ['Excellent', 'Good', 'Poor'],
                    total: data.pendingReservations + data.guestSatisfaction.excellent + data.guestSatisfaction.good + data.guestSatisfaction.poor
                });
            }
        };

        fetchData();
    }, []);
     return (
        <div className={rightPanel}>
            {/* Hotel Manager Stats */}
            <div className={section}>
                <h3 className={sectionTitle}>Hotel Manager Dashboard</h3>
                <div className={statsGrid}>
                    <div className={statItem}>
                        <span className={statLabel}>Occupancy Rate</span>
                        <span className={statValue}>{hotelStats?.occupancyRate || '0%'}</span>
                    </div>
                    <hr className={divider} />
                    <div className={statItem}>
                        <span className={statLabel}>Pending Reservations</span>
                        <span className={statValue}>{hotelStats?.pendingReservations ?? 0}</span>
                    </div>
                    <hr className={divider} />
                    <div className={statItem}>
                        <span className={statLabel}>Average Rating</span>
                        <span className={statValue}>{hotelStats?.averageRating ?? 0}</span>
                    </div>
                </div>
                <hr className={divider2} />
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
                            <hr className={divider2} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Guest Satisfaction */}
            {satisfactionData && (
                <GuestSatisfactionChart satisfactionData={satisfactionData} />
            )}
        </div>
    );
};

export default RightPanel;