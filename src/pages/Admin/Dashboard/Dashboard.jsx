import React from 'react'
import DashboardCard from '../../../components/Dashboard/DashboardCard'
import styles from "./Dashboard.module.css"
const Dashboard = () => {
    const {
        dashboardCardContent
    } = styles;
    return (
        <div>
            <div className={dashboardCardContent}>
                <DashboardCard />
                db
            </div>
        </div>
    )
}

export default Dashboard
