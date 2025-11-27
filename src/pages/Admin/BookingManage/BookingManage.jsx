import React, { useEffect, useState } from 'react';
import styles from './BookingManage.module.css';
import { bookingService } from '../../../services/bookingService';
import { toast } from 'react-toastify';
import { formatDateTime, formatVND } from '../../../utils/dateUtils';

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

    const [bookingData, setBookingData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const result = await bookingService.getAllBookings();
                
                // Kiểm tra cấu trúc response
                if (result && Array.isArray(result.data)) {
                    setBookingData(result.data);
                } else if (Array.isArray(result)) {
                    setBookingData(result);
                } else {
                    console.error('Unexpected response structure:', result);
                    setBookingData([]);
                }
            } catch (error) {
                console.error('Fetch bookings error:', error);
                toast.error(error?.response?.data?.message || error?.message || "Failed to fetch bookings");
                setBookingData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const getStatusClass = (status) => {
        if (!status) return '';
        
        switch (status.toLowerCase()) {
            case 'confirmed': return statusConfirmed;
            case 'checked-in': return statusCheckedIn;
            case 'completed': return statusCompleted;
            case 'canceled': return statusCanceled;
            default: return '';
        }
    };

    const getPaymentClass = (status) => {
        if (!status) return '';
        
        switch (status.toLowerCase()) {
            case 'paid': return paymentPaid;
            case 'bonding': return paymentBonding;
            case 'canceled': return paymentCanceled;
            default: return '';
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await bookingService.deleteBooking(id);
                setBookingData(prevData => prevData.filter(booking => booking.id !== id));
                toast.success('Booking deleted successfully');
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to delete booking');
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            // Gọi API để update status
            await bookingService.updateBookingStatus(id, { status: newStatus });
            
            // Update local state
            setBookingData(prevData =>
                prevData.map(booking =>
                    booking.id === id ? { ...booking, status: newStatus } : booking
                )
            );
            toast.success('Booking status updated successfully');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update status');
        }
    };

    if (loading) {
        return <div className={container}>Loading...</div>;
    }

    return (
        <div className={container}>
            <div className={tableContainer}>
                <table className={table}>
                    <thead className={tableHeader}>
                        <tr>
                            <th className={th}>ID</th>
                            <th className={th}>Tên Khách</th>
                            <th className={th}>Thông tin liên hệ</th>
                            <th className={th}>Số phòng</th>
                            <th className={th}>Số người</th>
                            <th className={th}>Check-In Date</th>
                            <th className={th}>Check-out Date</th>
                            <th className={th}>Payment Status</th>
                            <th className={th}>Booking Status</th>
                            <th className={th}>Giá Tổng</th>
                            <th className={th}>Actions</th>
                        </tr>   
                    </thead>
                    <tbody className={tableBody}>
                        {bookingData.length > 0 ? (
                            bookingData.map((booking) => (
                                <tr key={booking.id} className={tr}>
                                    <td className={td}>{booking?.id}</td>
                                    <td className={td}>{booking?.user?.name || 'N/A'}</td>
                                    <td className={td}>
                                        {booking?.user?.email || 'N/A'}<br/>
                                        {booking?.user?.phone || 'N/A'}
                                    </td>
                                    <td className={td}>{booking?.quantity || 'N/A'}</td>
                                    <td className={td}>{booking?.guests || booking?.room?.max_guest || 'N/A'}</td>
                                    <td className={td}>{formatDateTime(booking?.check_in || booking?.checkInDate)}</td>
                                    <td className={td}>{formatDateTime(booking?.check_out || booking?.checkOutDate)}</td>
                                    <td className={td}>
                                        <span className={getPaymentClass(booking.payment_status)}>
                                            {booking.payment_status || 'N/A'}
                                        </span>
                                    </td>
                                    <td className={td}>
                                        <select
                                            className={`${statusSelect} ${getStatusClass(booking.status)}`}
                                            value={booking.status || 'confirmed'}
                                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                        >
                                            <option value="confirmed">Confirmed</option>
                                            <option value="checked-in">Checked-in</option>
                                            <option value="completed">Completed</option>
                                            <option value="canceled">Canceled</option>
                                        </select>
                                    </td>
                                    <td className={td}>
                                        {formatVND(booking?.total_price || booking?.totalPrice)}
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
                            ))
                        ) : (
                            <tr className={tr}>
                                <td colSpan="11" className={td} style={{ textAlign: 'center' }}>
                                    No bookings found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingManage;