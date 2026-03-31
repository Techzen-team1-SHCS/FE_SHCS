import DashboardCard from '../../../components/Admin/Dashboard/DashboardCard'
import styles from "./Dashboard.module.css"
import GuestVisitsChart from '../../../components/Admin/Charts/GuestVisitsChart/GuestVisitsChart';
import BookingTable from '../../../components/Admin/BookingTable/BookingTable';
import RightPanel from '../../../components/Admin/RightPanel/RightPanel';
import MostBookedChart from '../../../components/Admin/Charts/MostBookedChart/MostBookedChart';
import RecentBookTable from '../../../components/Admin/RecentBookTable/RecentBookTable';
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

    return (
        <div className={container}>
            <div className={mainData}>
                <div className={left}>
                    <DashboardCard />
                    <GuestVisitsChart />
                    <MostBookedChart />
                </div>
                <div className={right}>
                    <RightPanel />
                </div>
            </div>
            <div className={tableData}>
                <div className={tableLeft}>
                    <BookingTable/>
                </div>
                <div className={tableRight}>
                    <RecentBookTable />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
