import React, { useEffect, useState } from 'react';
import styles from './BookingManage.module.css';
import { bookingService } from '../../../services/bookingService';
import { toast } from 'react-toastify';
import { formatDateTime, formatVND } from '../../../utils/dateUtils';
import DetailSidebar from '../../../components/Admin/DetailSidebar/DetailSidebar';
import BookingSidebarContent from '../../../components/Admin/DetailSidebar/BookingSidebarContent';

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
        statusSelect,
        actionButton,
        viewButton,
        editButton,
        buttonGroup,
        buttonIcon
    } = styles;

    const [bookingData, setBookingData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    const handleView = (bookingId) => {
        const booking = bookingData.find(b => b.id === bookingId);
        setSelectedBooking(booking);
        setIsSidebarOpen(true);
    };
    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedBooking(null);
    };
    const handleEdit = (bookingId) => {
        console.log('Edit booking:', bookingId);
        // Xử lý chỉnh sửa
    };

    const handleDelete = (bookingId) => {
        console.log('Delete booking:', bookingId);
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            // Xử lý xóa
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
                                        {booking?.user?.email || 'N/A'}<br />
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
                                        <div className={buttonGroup}>
                                            <button
                                                className={`${actionButton} ${viewButton}`}
                                                onClick={() => handleView(booking.id)}
                                                title="Xem chi tiết"
                                            >
                                                <span className={buttonIcon}>👁️</span>
                                            </button>
                                            <button
                                                className={`${actionButton} ${editButton}`}
                                                onClick={() => handleEdit(booking.id)}
                                                title="Chỉnh sửa"
                                            >
                                                <span className={buttonIcon}>✏️</span>
                                            </button>
                                            <button
                                                className={`${actionButton} ${deleteButton}`}
                                                onClick={() => handleDelete(booking.id)}
                                                title="Xóa"
                                            >
                                                <span className={buttonIcon}>🗑️</span>
                                            </button>
                                        </div>
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
            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={handleCloseSidebar}
                title="Chi tiết đặt phòng"
                type="booking"
            >
                {selectedBooking && <BookingSidebarContent booking={selectedBooking} />}
            </DetailSidebar>
        </div>
    );
};

export default BookingManage;