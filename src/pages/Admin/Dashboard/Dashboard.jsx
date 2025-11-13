import React from 'react'
import DashboardCard from '../../../components/Admin/Dashboard/DashboardCard'
import styles from "./Dashboard.module.css"
import GuestVisitsChart from '../../../components/Admin/Charts/GuestVisitsChart/GuestVisitsChart';
import BookingTable from '../../../components/Admin/BookingTable/BookingTable';
import RightPanel from '../../../components/Admin/RightPanel/RightPanel';
const Dashboard = () => {
    const {
        left,
        container,
        right
    } = styles;
    // Dữ liệu giả cho dashboard
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
            growth: "+201"
        },
        {
            id: 3,
            logo: "/assets/images/logos/check-in.png",
            title: "New Check-in",
            amount: "$1,537",
            growth: "+201"
        }
    ];

    const GuestVisitData = {
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [180, 220, 190, 250, 280, 320, 300, 350, 380, 340, 290, 260]
        },
        weekly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [320, 280, 350, 380]
        },
        daily: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [45, 52, 38, 60, 75, 85, 65]
        }
    };

    const bookingData = [
        { roomType: 'Deluxe', totalBookings: 45, occupancyRate: '92%', averageRating: 4.6 },
        { roomType: 'Standard', totalBookings: 32, occupancyRate: '88%', averageRating: 4.9 },
        { roomType: 'Classic', totalBookings: 20, occupancyRate: '63%', averageRating: 4.2 },
        { roomType: 'Poetic', totalBookings: 20, occupancyRate: '63%', averageRating: 4.2 },
    ];

    const hotelStats = {
        totalGuests: 4260,
        totalRevenue: '32.1k',
        averageRating: 4.8
    };

    const upcomingReservations = [
        { 
            hotelName: 'Nurse hotels', 
            guestInfo: 'Net Check: On Range, Visit Team',
            checkIn: '14:00 am 16/09/2025',
            checkOut: '12:00 am 21/09/2025'
        },
        { 
            hotelName: 'Annual Inventory', 
            guestInfo: 'Cost Gbps, No HKV, Visit Team',
            checkIn: '14:00 am 22/09/2025',
            checkOut: '12:00 am 24/09/2025'
        }
    ];

    const satisfactionData = {
        data: [75, 20, 5],
        total: 4551,
        labels: ['Excellent', 'Good', 'Poor']
    };

    return (
        <div className={container}>
            <div className={left}>
                <DashboardCard cardData={cardData}/>
                <GuestVisitsChart GuestVisitData={GuestVisitData}/>
                <BookingTable bookingData={bookingData}/>
            </div>
            <div className={right}>
                <RightPanel hotelStats={hotelStats} upcomingReservations={upcomingReservations} satisfactionData={satisfactionData}/>
            </div>
        </div>
    )
}

export default Dashboard
