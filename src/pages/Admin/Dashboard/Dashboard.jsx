import React from 'react'
import DashboardCard from '../../../components/Dashboard/DashboardCard'
import styles from "./Dashboard.module.css"
import GuestVisitsChart from '../../../components/GuestVisitsChart/GuestVisitsChart';
import BookingTable from '../../../components/BookingTable/BookingTable';
import RightPanel from '../../../components/RightPanel/RightPanel';
const Dashboard = () => {
    const {
        left,
        container,
        right
    } = styles;
    return (
        <div className={container}>
            <div className={left}>
                <DashboardCard />
                <GuestVisitsChart/>
                <BookingTable />
            </div>
            <div className={right}>
                <RightPanel/>
            </div>
        </div>
    )
}

export default Dashboard
