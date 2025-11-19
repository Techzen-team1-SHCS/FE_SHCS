import React, { useState } from 'react';
import styles from './RecentBookTable.module.css';

const RecentBookTable = ({ recentBookData }) => {
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
        statusSelect,
        header,
        title
    } = styles;

    // Sử dụng prop recentBookData nếu có, nếu không dùng dữ liệu mẫu
    const [roomsData, setRoomsData] = useState(recentBookData || [
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
            hotelName: "Hilton DaNang",
            roomNumber: "102",
            roomType: "Standard",
            capacity: 2,
            price: 100,
            status: "available",
            currentBooking: null
        },
        {
            id: 3,
            hotelName: "Hilton DaNang",
            roomNumber: "103",
            roomType: "Standard",
            capacity: 2,
            price: 100,
            status: "maintenance",
            currentBooking: null
        },
        {
            id: 4,
            hotelName: "Hilton DaNang",
            roomNumber: "104",
            roomType: "Standard",
            capacity: 2,
            price: 100,
            status: "cleaning",
            currentBooking: null
        }
    ]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'available': return statusAvailable;
            case 'occupied': return statusOccupied;
            case 'maintenance': return statusMaintenance;
            case 'cleaning': return statusCleaning;
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
                                    <span>{room.hotelName}</span>
                                </td>
                                <td className={td}>
                                    <span>{room.roomNumber}</span>
                                </td>
                                <td className={td}>
                                    <span>
                                        {room.currentBooking ? room.currentBooking.guestName : '-'}
                                    </span>
                                </td>
                                <td className={td}>
                                    <span>
                                        {room.currentBooking ? room.currentBooking.checkIn : '-'}
                                    </span>
                                </td>
                                <td className={td}>
                                    <span className={getStatusClass(room.status)}>
                                        {room.status}
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