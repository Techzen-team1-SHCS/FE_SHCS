import React, { useEffect, useState } from 'react';
import styles from './RecentBookTable.module.css';
import { dashboardService } from '../../../services/dashBoardService';
import { formatDateTime } from '../../../utils/dateUtils';

const RecentBookTable = () => {
    const {
        container,
        tableContainer,
        table,
        tableHeader,
        th,
        tableBody,
        tr,
        td,
        statusAvailable,
        statusOccupied,
        statusMaintenance,
        statusCleaning,
    } = styles;

    // Sử dụng prop recentBookData nếu có, nếu không dùng dữ liệu mẫu
    const [roomsData, setRoomsData] = useState([]);
    useEffect(()=>{
        const fetchRoom=async()=>{
            try {
                const result=await dashboardService.getHotelBookingToday();
                setRoomsData(result)
            } catch (error) {
                console.error(error.response?.data?.message || 'Failed to fetch dashboard revenue');
            }
        }
        fetchRoom();
    },[]);
    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return statusAvailable;
            case 'completed': return statusOccupied;
            case 'confirm': return statusMaintenance;
            case 'cancelled': return statusCleaning;
            default: return '';
        }
    };


    return (
        <div className={container}>
            <div className={styles.header}>
                <h3 className={styles.title}>Recently Booked Rooms</h3>
            </div>
            <div className={tableContainer}>
                <table className={table}>
                    <thead className={tableHeader}>
                        <tr>
                            <th className={th}>Hotel</th>
                            <th className={th}>Room</th>
                            <th className={th}>Guest</th>
                            <th className={th}>Check-In</th>
                            <th className={th}>Status</th>
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {roomsData.slice(0, 4).map((room) => (
                            <tr key={room.id} className={tr}>
                                <td className={td}>
                                    <span>{room?.room?.hotel?.name}</span>
                                </td>
                                <td className={td}>
                                    <span>{room?.room?.room_type}</span>
                                </td>
                                <td className={td}>
                                    <span>
                                        {room?.user?.name}
                                    </span>
                                </td>
                                <td className={td}>
                                    <span>
                                        {formatDateTime(room?.check_in)}
                                    </span>
                                </td>
                                <td className={td}>
                                    <span className={getStatusClass(room?.status)}>
                                        {room?.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentBookTable;