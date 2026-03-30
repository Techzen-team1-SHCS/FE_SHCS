import React, { useState } from 'react';
import styles from './Recently.module.css';
import hueImage from '../../../../public/assets/images/destinations/hue.jpg';  

const Recently = () => {
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
        actionCell,
        deleteButton,
        deleteIcon,
        statusSelect,
        img,
    } = styles;

    const [roomsData, setRoomsData] = useState([
        {
            id: 1,
           img: hueImage,
            hotelName: "Hilton DaNang",
            roomNumber: "101",
            roomType: "Deluxe",
            capacity: 2,
            price: 150,
            status: "occupied", // available, occupied, maintenance, cleaning
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
            currentBooking: null // ✅ QUAN TRỌNG: null khi không có booking
        },
        {
            id: 3,
            hotelName: "Hilton DaNang",
            roomNumber: "102",
            roomType: "Standard",
            capacity: 2,
            price: 100,
            status: "maintenance",
            currentBooking: null // ✅ QUAN TRỌNG: null khi không có booking
        },
        {
            id: 4,
            hotelName: "Hilton DaNang",
            roomNumber: "102",
            roomType: "Standard",
            capacity: 2,
            price: 100,
            status: "cleaning",
            currentBooking: null // ✅ QUAN TRỌNG: null khi không có booking
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

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this rooms?')) {
            setRoomsData(prevData => prevData.filter(rooms => rooms.id !== id));
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setRoomsData(prevData =>
            prevData.map(room =>
                room.id === id ? { ...room, status: newStatus } : room
            )
        );
    };



    return (
        <div className={container}>
            <div className={tableContainer}>
                <table className={table}>
                    <thead className={tableHeader}>
                        <tr>
                            <th className={th}></th>
                            <th className={th}>Hotel Name </th>
                            <th className={th}>Adress</th>
                            <th className={th}>Registration Date</th>
                            <th className={th}>Total Rooms</th>
                            <th className={th}>Status</th>
                            <th className={th}></th>
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {roomsData.map((room) => (
                            <tr key={room.id} className={tr}>
                                <td className={td}><div className={img}><img src={room.img} alt=""></img></div></td>
                                <td className={td}>{room.hotelName}</td>
                                <td className={td}>{room.roomNumber}</td>
                                <td className={td}>{room.roomType}</td>
                                <td className={td}>{room.capacity}</td>
                                <td className={td}>{room.price}</td>
                                <td className={td}>
                                    {room.currentBooking ? room.currentBooking.guestName : '-'}
                                </td>
                                <td className={td}>
                                    {room.currentBooking ? room.currentBooking.checkIn : '-'}
                                </td>
                                <td className={td}>
                                    <select
                                        className={`${statusSelect} ${getStatusClass(room.status)}`}
                                        value={room.status}
                                        onChange={(e) => handleStatusChange(room.id, e.target.value)}
                                    >
                                        <option value="available">Available</option>
                                        <option value="occupied">Occupied</option>
                                        <option value="maintenance">Maintenance</option>
                                        <option value="cleaning">Cleaning</option>
                                    </select>
                                </td>
                                <td className={`${td} ${actionCell}`}>
                                    <button
                                        className={deleteButton}
                                        onClick={() => handleDelete(room.id)}
                                        title="Delete room"
                                    >
                                        <svg className={deleteIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Recently;