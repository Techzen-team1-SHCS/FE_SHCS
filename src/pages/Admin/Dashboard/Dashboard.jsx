import React from 'react'
import DashboardCard from '../../../components/Admin/Dashboard/DashboardCard'
import styles from "./Dashboard.module.css"
import GuestVisitsChart from '../../../components/Admin/Charts/GuestVisitsChart/GuestVisitsChart';
import BookingTable from '../../../components/Admin/BookingTable/BookingTable';
import RightPanel from '../../../components/Admin/RightPanel/RightPanel';
import MostBookedChart from '../../../components/Admin/Charts/MostBookedChart/MostBookedChart';
import RecentBookTable from '../../../components/Admin/RecentBookTable/RecentBookTable';
import { use } from 'react';
const Dashboard = () => {
    const {
        left,
        container,
        right,
        mainData,
        tableData,
        tableLeft,
        tableRight
    } = styles;
    
    // Dữ liệu giả cho dashboar

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
        occupancyRate: 4260,
        pendingReservations: '32.1k',
        averageRating: 4.8
    };

    const upcomingReservations = [
        {
            hotel: 'Nurse hotels',
            location: 'VN',
            checkIn: '14:00 am 16/09/2025',
            checkOut: '12:00 am 21/09/2025'
        },
        {
            hotel: 'Annual Inventory',
            location: 'My',
            checkIn: '14:00 am 22/09/2025',
            checkOut: '12:00 am 24/09/2025'
        }
    ];

    const satisfactionData = {
        data: [75, 20, 5],
        total: 4551,
        labels: ['Excellent', 'Good', 'Poor']
    };
    const MostBookedData = {
        labels: ['Hilton DaNang', 'Sheraton Hanoi', 'Intercontinental', 'Marriott', 'Sofitel'],
        data: [45, 38, 32, 28, 25]
    };
    const recentBookData = [
        {
            id: 1,
            hotelName: "Hilton DaNang",
            roomNumber: "101",
            roomType: "Deluxe",
            capacity: 2,
            price: 150,
            status: "occupied",
            currentBooking: {
                guestName: "Nguyen Van A",
                checkIn: "2024-01-15 14:00",
            }
        },
        {
            id: 2,
            hotelName: "Sheraton Hanoi",
            roomNumber: "205",
            roomType: "Standard",
            capacity: 2,
            price: 100,
            status: "available",
            currentBooking: null
        },
        {
            id: 3,
            hotelName: "Intercontinental",
            roomNumber: "301",
            roomType: "Suite",
            capacity: 4,
            price: 300,
            status: "maintenance",
            currentBooking: null
        },
        {
            id: 4,
            hotelName: "Marriott",
            roomNumber: "412",
            roomType: "Deluxe",
            capacity: 3,
            price: 200,
            status: "cleaning",
            currentBooking: null
        }
    ];

    return (
        <div className={container}>
            <div className={mainData}>
                <div className={left}>
                    <DashboardCard />
                    <GuestVisitsChart />
                    <MostBookedChart />
                </div>
                <div className={right}>
                    <RightPanel hotelStats={hotelStats} upcomingReservations={upcomingReservations} satisfactionData={satisfactionData} />
                </div>
            </div>
            <div className={tableData}>
                <div className={tableLeft}>
                    <BookingTable bookingData={bookingData} />
                </div>
                <div className={tableRight}>
                    <RecentBookTable recentBookData={recentBookData}/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
