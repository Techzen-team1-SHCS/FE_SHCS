import { useEffect, useState } from 'react';
import styles from './BookingTable.module.css';
import { dashboardService } from '../../../services/dashBoardService';

const BookingTable = () => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchRoomData = async () => {
            try {
                const result = await dashboardService.getRoomData();
                setTableData(result || []); // đảm bảo luôn là mảng
            } catch (error) {
                console.error(error.response?.data?.message || 'Failed to fetch room data');
            }
        };
        fetchRoomData();
    }, []);

    // Fallback nếu API chưa trả dữ liệu
    const dataToRender = tableData.length > 0 ? tableData : [
        { roomType: 'Deluxe', totalBookings: 0, occupancyRate: '0%', averageRating: 0 },
        { roomType: 'Standard', totalBookings: 0, occupancyRate: '0%', averageRating: 0 },
        { roomType: 'Normal', totalBookings: 0, occupancyRate: '0%', averageRating: 0 },
    ];

    return (
        <div className={styles.tableCard}>
            <div className={styles.header}>
                <h3 className={styles.title}>Booking Data</h3>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th className={styles.th}>Room Type</th>
                            <th className={styles.th}>Total Bookings</th>
                            <th className={styles.th}>Occupancy Rate</th>
                            <th className={styles.th}>Average Rating</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {dataToRender.map((room, index) => (
                            <tr key={index} className={styles.tr}>
                                <td className={styles.td}>
                                    <span className={styles.roomType}>{room.roomType}</span>
                                </td>
                                <td className={styles.td}>
                                    <span className={styles.bookings}>{room.totalBookings}</span>
                                </td>
                                <td className={styles.td}>
                                    <span className={styles.rateValue}>{room.occupancyRate}</span>
                                </td>
                                <td className={styles.td}>
                                    <span className={styles.ratingValue}>{room.averageRating}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingTable;
