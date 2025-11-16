import React from 'react';
import styles from './BookingTable.module.css';

const BookingTable = ({bookingData}) => {
    const fallbackData = [
        { roomType: 'Deluxe', totalBookings: 45, occupancyRate: '92%', averageRating: 4.6 },
        { roomType: 'Standard', totalBookings: 32, occupancyRate: '88%', averageRating: 4.9 },
        { roomType: 'Classic', totalBookings: 20, occupancyRate: '63%', averageRating: 4.2 },
        { roomType: 'Poetic', totalBookings: 20, occupancyRate: '63%', averageRating: 4.2 },
    ];
    const getTableData = () => {
        if (bookingData && bookingData.length > 0) {
            return bookingData;
        }
        return fallbackData;
    };

    const tableData = getTableData();
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
                        {tableData.map((room, index) => (
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