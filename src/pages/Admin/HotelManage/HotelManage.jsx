import React, { useState } from 'react';
import styles from './HotelManage.module.css';

const HotelManage = () => {
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
        statusSelect
    } = styles;

    const [hotelsData, setHotelsData] = useState([
        {
            id: 1,
            hotelName: "Hilton DaNang",
            phone: "0236 123 4567",
            email: "info@hiltondanang.com",
            address: "123 Beach Street, Da Nang",
            roomNumber: 150,
            roomOccupied: 120,
            revenue: 125000000,
            star: 4.432234
        },
        {
            id: 2,
            hotelName: "Sheraton Hanoi",
            phone: "024 1234 5678",
            email: "reservation@sheratonhanoi.com",
            address: "456 Lake Side, Hanoi",
            roomNumber: 200,
            roomOccupied: 180,
            revenue: 89000000,
            star: 4
        },
        {
            id: 3,
            hotelName: "InterContinental Nha Trang",
            phone: "0258 123 4567",
            email: "book@icnhatrang.com",
            address: "789 Coastal Road, Nha Trang",
            roomNumber: 180,
            roomOccupied: 150,
            revenue: 152000000,
            star: 5
        },
        {
            id: 4,
            hotelName: "Melia Ho Tram",
            phone: "0254 123 4567",
            email: "contact@meliahotram.com",
            address: "321 Resort Area, Ho Tram",
            roomNumber: 120,
            roomOccupied: 95,
            revenue: 76000000,
            star: 4
        }
    ]);
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };
    return (
        <div className={container}>
            <div className={tableContainer}>
                <table className={table}>
                    <thead className={tableHeader}>
                        <tr>
                            <th className={th}>Hotel ID </th>
                            <th className={th}>Hotel Name </th>
                            <th className={th}>Phone</th>
                            <th className={th}>Email</th>
                            <th className={th}>Address</th>
                            <th className={th}>Room Occupied</th>
                            <th className={th}>Revenue</th>
                            <th className={th}>Star </th>
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {hotelsData.map((hotel) => (
                            <tr key={hotel.id} className={tr}>
                                <td className={td}>{hotel.id}</td>
                                <td className={td}>{hotel.hotelName}</td>
                                <td className={td}>{hotel.phone}</td>
                                <td className={td}>{hotel.email}</td>
                                <td className={td}>{hotel.address}</td>
                                <td className={td}>{hotel.roomOccupied}/{hotel.roomNumber}</td>
                                <td className={td}>{formatCurrency(hotel.revenue)}</td>
                                <td className={td}>{hotel.star}/5</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HotelManage;