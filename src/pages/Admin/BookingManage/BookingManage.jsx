import React, { useState } from 'react';
import styles from './BookingManage.module.css';

const BookingManage = () => {
    const {
        container,
        tableContainer,
        table,
        tableHeader,
        th,
        tableBody,
        tr,
        td,
        statusConfirmed,
        statusCheckedIn,
        statusCompleted,
        statusCanceled,
        paymentPaid,
        paymentBonding,
        paymentCanceled,
        actionCell,
        deleteButton,
        deleteIcon,
        statusSelect
    } = styles;

    const [bookingData, setBookingData] = useState([
        {
            id: 1,
            guestName: 'Quyen',
            phoneNumber: '070605223',
            roomType: 'Luxury',
            guests: 2,
            checkInDate: '13-Aug-2023 at 14:00 AM',
            checkOutDate: '14-Aug-2023 at 12:00 AM',
            paymentStatus: 'Paid',
            bookingStatus: 'Confirmed'
        },
        {
            id: 2,
            guestName: 'Quyen',
            phoneNumber: '070605223',
            roomType: 'Luxury',
            guests: 2,
            checkInDate: '13-Aug-2023 at 14:00 AM',
            checkOutDate: '14-Aug-2023 at 12:00 AM',
            paymentStatus: 'Bonding',
            bookingStatus: 'Checked-in'
        },
        {
            id: 3,
            guestName: 'Quyen',
            phoneNumber: '070605223',
            roomType: 'Luxury',
            guests: 2,
            checkInDate: '13-Aug-2023 at 14:00 AM',
            checkOutDate: '14-Aug-2023 at 12:00 AM',
            paymentStatus: 'Paid',
            bookingStatus: 'Completed'
        },
        {
            id: 4,
            guestName: 'Quyen',
            phoneNumber: '070605223',
            roomType: 'Luxury',
            guests: 2,
            checkInDate: '13-Aug-2023 at 14:00 AM',
            checkOutDate: '14-Aug-2023 at 12:00 AM',
            paymentStatus: 'Canceled',
            bookingStatus: 'Canceled'
        }
    ]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Confirmed': return statusConfirmed;
            case 'Checked-in': return statusCheckedIn;
            case 'Completed': return statusCompleted;
            case 'Canceled': return statusCanceled;
            default: return '';
        }
    };

    const getPaymentClass = (status) => {
        switch (status) {
            case 'Paid': return paymentPaid;
            case 'Bonding': return paymentBonding;
            case 'Canceled': return paymentCanceled;
            default: return '';
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            setBookingData(prevData => prevData.filter(booking => booking.id !== id));
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setBookingData(prevData =>
            prevData.map(booking =>
                booking.id === id ? { ...booking, bookingStatus: newStatus } : booking
            )
        );
    };



    return (
        <div className={container}>
            <div className={tableContainer}>
                <table className={table}>
                    <thead className={tableHeader}>
                        <tr>
                            <th className={th}>Guest Name</th>
                            <th className={th}>Phone Number</th>
                            <th className={th}>Room Type</th>
                            <th className={th}>Guests</th>
                            <th className={th}>Check-In Date</th>
                            <th className={th}>Check-out Date</th>
                            <th className={th}>Payment Status</th>
                            <th className={th}>Booking Status</th>
                            <th className={th}></th>
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {bookingData.map((booking) => (
                            <tr key={booking.id} className={tr}>
                                <td className={td}>{booking.guestName}</td>
                                <td className={td}>{booking.phoneNumber}</td>
                                <td className={td}>{booking.roomType}</td>
                                <td className={td}>{booking.guests}</td>
                                <td className={td}>{booking.checkInDate}</td>
                                <td className={td}>{booking.checkOutDate}</td>
                                <td className={td}>
                                    <span className={getPaymentClass(booking.paymentStatus)}>
                                        {booking.paymentStatus}
                                    </span>
                                </td>
                                <td className={td}>
                                    <select
                                        className={`${statusSelect} ${getStatusClass(booking.bookingStatus)}`}
                                        value={booking.bookingStatus}
                                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                    >
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Checked-in">Checked-in</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Canceled">Canceled</option>
                                    </select>
                                </td>
                                <td className={`${td} ${actionCell}`}>
                                    <button
                                        className={deleteButton}
                                        onClick={() => handleDelete(booking.id)}
                                        title="Delete booking"
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

export default BookingManage;