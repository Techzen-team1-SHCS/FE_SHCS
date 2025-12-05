import React, { useEffect, useState } from 'react';
import styles from './BookingManage.module.css';
import { bookingService } from '../../../services/bookingService';
import { toast } from 'react-toastify';
import { formatDateTime, formatVND } from '../../../utils/dateUtils';
import DetailSidebar from '../../../components/Admin/DetailSidebar/DetailSidebar';
import BookingSidebarContent from '../../../components/Admin/DetailSidebar/BookingSidebarContent'; // Tạo component mới cho edit modal
import Swal from "sweetalert2";

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
        buttonIcon,
        modalBackdrop,
        modalContent,
        modalHeader,
        modalTitle,
        modalClose,
        modalBody,
        modalFooter,
        saveButton,
        cancelButton,
        formGroup,
        formLabel,
        formInput,
        formSelect
    } = styles;

    const [bookingData, setBookingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch bookings
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const result = await bookingService.getAllBookings();

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

    // View booking details
    const handleView = (bookingId) => {
        const booking = bookingData.find(b => b.id === bookingId);
        setSelectedBooking(booking);
        setIsSidebarOpen(true);
    };

    // Open edit modal
    const handleEdit = (bookingId) => {
        const booking = bookingData.find(b => b.id === bookingId);
        setEditingBooking(booking);
        setIsEditModalOpen(true);
    };

    // Handle booking update
    const handleUpdate = async (updatedData) => {
        try {
            await bookingService.updateBooking(editingBooking.id, updatedData);
            toast.success('Cập nhật đặt phòng thành công');
            
            // Refresh data
            fetchBookings();
            setIsEditModalOpen(false);
            setEditingBooking(null);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Không thể cập nhật đặt phòng');
            console.error('Update error:', error);
        }
    };

    // Handle booking deletion
    const handleDelete = async (bookingId) => {
    const confirm = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Bạn có chắc chắn muốn xóa đặt phòng này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6"
    });

    if (confirm.isConfirmed) {
        try {
            setIsDeleting(true);

            await bookingService.DeleteBooking(bookingId);

            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Xóa đặt phòng thành công",
                timer: 1500,
                showConfirmButton: false
            });

            // Cập nhật lại danh sách sau khi xóa
            setBookingData(prevData =>
                prevData.filter((booking) => booking.id !== bookingId)
            );

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: error?.response?.data?.message || "Không thể xóa đặt phòng"
            });

            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
        }
    }
};


    // Handle status change
    const handleStatusChange = async (id, newStatus) => {
        try {
            await bookingService.updateBookingStatus(id, { status: newStatus });
            
            setBookingData(prevData =>
                prevData.map(booking =>
                    booking.id === id ? { ...booking, status: newStatus } : booking
                )
            );
            toast.success('Cập nhật trạng thái thành công');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Không thể cập nhật trạng thái');
        }
    };

    // Handle payment status change
    const handlePaymentStatusChange = async (id, newPaymentStatus) => {
        try {
            await bookingService.updateBooking(id, { payment_status: newPaymentStatus });
            
            setBookingData(prevData =>
                prevData.map(booking =>
                    booking.id === id ? { ...booking, payment_status: newPaymentStatus } : booking
                )
            );
            toast.success('Cập nhật trạng thái thanh toán thành công');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Không thể cập nhật trạng thái thanh toán');
        }
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedBooking(null);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingBooking(null);
    };

    if (loading) {
        return <div className={container}>Đang tải...</div>;
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
                            <th className={th}>Check-In</th>
                            <th className={th}>Check-out</th>
                            <th className={th}>Trạng thái thanh toán</th>
                            <th className={th}>Trạng thái đặt phòng</th>
                            <th className={th}>Tổng tiền</th>
                            <th className={th}>Hành động</th>
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
                                        <select
                                            className={`${statusSelect} ${getPaymentClass(booking.payment_status)}`}
                                            value={booking.payment_status || 'bonding'}
                                            onChange={(e) => handlePaymentStatusChange(booking.id, e.target.value)}
                                            disabled={isDeleting}
                                        >
                                            <option value="bonding">Chờ thanh toán</option>
                                            <option value="paid">Đã thanh toán</option>
                                            <option value="canceled">Đã hủy</option>
                                        </select>
                                    </td>
                                    <td className={td}>
                                        <select
                                            className={`${statusSelect} ${getStatusClass(booking.status)}`}
                                            value={booking.status || 'confirmed'}
                                            onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                                            disabled={isDeleting}
                                        >
                                            <option value="confirmed">Xác nhận</option>
                                            <option value="checked-in">Đã nhận phòng</option>
                                            <option value="completed">Hoàn thành</option>
                                            <option value="canceled">Đã hủy</option>
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
                                                disabled={isDeleting}
                                            >
                                                <span className={buttonIcon}>👁️</span>
                                            </button>
                                            <button
                                                className={`${actionButton} ${editButton}`}
                                                onClick={() => handleEdit(booking.id)}
                                                title="Chỉnh sửa"
                                                disabled={isDeleting}
                                            >
                                                <span className={buttonIcon}>✏️</span>
                                            </button>
                                            <button
                                                className={`${actionButton} ${deleteButton}`}
                                                onClick={() => handleDelete(booking.id)}
                                                title="Xóa"
                                                disabled={isDeleting}
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
                                    Không tìm thấy đặt phòng nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && editingBooking && (
                <div className={modalBackdrop}>
                    <div className={modalContent}>
                        <div className={modalHeader}>
                            <h3 className={modalTitle}>Chỉnh sửa đặt phòng #{editingBooking.id}</h3>
                            <button className={modalClose} onClick={handleCloseEditModal}>×</button>
                        </div>
                        <div className={modalBody}>
                            <div className={formGroup}>
                                <label className={formLabel}>Số phòng</label>
                                <input
                                    type="number"
                                    className={formInput}
                                    defaultValue={editingBooking.quantity}
                                    min="1"
                                />
                            </div>
                            <div className={formGroup}>
                                <label className={formLabel}>Số người</label>
                                <input
                                    type="number"
                                    className={formInput}
                                    defaultValue={editingBooking.guests}
                                    min="1"
                                />
                            </div>
                            <div className={formGroup}>
                                <label className={formLabel}>Ngày check-in</label>
                                <input
                                    type="datetime-local"
                                    className={formInput}
                                    defaultValue={editingBooking.check_in?.replace(' ', 'T') || ''}
                                />
                            </div>
                            <div className={formGroup}>
                                <label className={formLabel}>Ngày check-out</label>
                                <input
                                    type="datetime-local"
                                    className={formInput}
                                    defaultValue={editingBooking.check_out?.replace(' ', 'T') || ''}
                                />
                            </div>
                            <div className={formGroup}>
                                <label className={formLabel}>Tổng tiền</label>
                                <input
                                    type="number"
                                    className={formInput}
                                    defaultValue={editingBooking.total_price}
                                />
                            </div>
                        </div>
                        <div className={modalFooter}>
                            <button className={cancelButton} onClick={handleCloseEditModal}>
                                Hủy
                            </button>
                            <button className={saveButton} onClick={() => handleUpdate({
                                quantity: document.querySelector('.modalContent .formInput[type="number"]:nth-child(1)')?.value,
                                guests: document.querySelector('.modalContent .formInput[type="number"]:nth-child(2)')?.value,
                                check_in: document.querySelector('.modalContent .formInput[type="datetime-local"]:nth-child(1)')?.value,
                                check_out: document.querySelector('.modalContent .formInput[type="datetime-local"]:nth-child(2)')?.value,
                                total_price: document.querySelector('.modalContent .formInput[type="number"]:nth-child(3)')?.value
                            })}>
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Sidebar */}
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