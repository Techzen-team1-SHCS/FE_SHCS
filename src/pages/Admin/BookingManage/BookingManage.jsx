import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './BookingManage.module.css';
import { bookingService } from '../../../services/bookingService';
import { toast } from 'react-toastify';
import { formatDateTime, formatVND } from '../../../utils/dateUtils';
import DetailSidebar from '../../../components/Admin/DetailSidebar/DetailSidebar';
import BookingSidebarContent from '../../../components/Admin/DetailSidebar/BookingSidebarContent';
import Swal from "sweetalert2";
import PartLoading from '../../../components/Loading/PartLoading';
import { AuthContext } from '../../../contexts/AuthContext';

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

    const queryClient = useQueryClient();
    const { login, user } = useContext(AuthContext);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [editFormData, setEditFormData] = useState({
        quantity: '',
        guests: '',
        check_in: '',
        check_out: '',
        total_price: ''
    });

    // Sử dụng TanStack Query để fetch bookings với caching
    const { data: bookingData = [], isLoading, error, refetch } = useQuery({
        queryKey: ['all-booking'],
        queryFn: async () => {
            const result = await bookingService.getAllBookings();
            if (result && Array.isArray(result.data)) {
                return result.data;
            } else if (Array.isArray(result)) {
                return result;
            } else {
                console.error('Unexpected response structure:', result);
                return [];
            }
        },
        staleTime: 1000 * 60 * 5, // Cache 5 phút
        gcTime: 1000 * 60 * 10, // Giữ cache 10 phút
        retry: 1,
    });

    // Mutation cho cập nhật trạng thái
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => bookingService.updateBooking(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['all-booking']);
            toast.success('Cập nhật trạng thái thành công');
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Không thể cập nhật trạng thái');
        }
    });

    // Mutation cho cập nhật trạng thái thanh toán
    const updatePaymentMutation = useMutation({
        mutationFn: ({ id, payment_status }) => bookingService.updateBooking(id, { payment_status }),
        onSuccess: () => {
            queryClient.invalidateQueries(['all-booking']);
            toast.success('Cập nhật trạng thái thanh toán thành công');
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Không thể cập nhật trạng thái thanh toán');
        }
    });

    // Mutation cho xóa booking
    const deleteMutation = useMutation({
        mutationFn: (id) => bookingService.DeleteBooking(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['all-booking']);
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Xóa đặt phòng thành công",
                timer: 1500,
                showConfirmButton: false
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: error?.response?.data?.message || "Không thể xóa đặt phòng"
            });
        }
    });

    // Mutation cho cập nhật booking
    const updateBookingMutation = useMutation({
        mutationFn: ({ id, data }) => bookingService.updateBooking(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['all-booking']);
            toast.success('Cập nhật đặt phòng thành công');
            setIsEditModalOpen(false);
            setEditingBooking(null);
            setEditFormData({
                quantity: '',
                guests: '',
                check_in: '',
                check_out: '',
                total_price: ''
            });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Không thể cập nhật đặt phòng');
        }
    });

    // Khi mở modal edit, load dữ liệu cũ vào form
    useEffect(() => {
        if (editingBooking && isEditModalOpen) {
            setEditFormData({
                quantity: editingBooking.quantity || editingBooking.room?.quantity || '',
                guests: editingBooking.guests || editingBooking.room?.max_guest || '',
                check_in: editingBooking.check_in 
                    ? editingBooking.check_in.replace(' ', 'T').substring(0, 16)
                    : editingBooking.checkInDate 
                    ? editingBooking.checkInDate.replace(' ', 'T').substring(0, 16)
                    : '',
                check_out: editingBooking.check_out 
                    ? editingBooking.check_out.replace(' ', 'T').substring(0, 16)
                    : editingBooking.checkOutDate 
                    ? editingBooking.checkOutDate.replace(' ', 'T').substring(0, 16)
                    : '',
                total_price: editingBooking.total_price || editingBooking.totalPrice || ''
            });
        }
    }, [editingBooking, isEditModalOpen]);

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

    // Handle input change in edit form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle booking update
    const handleUpdate = () => {
        if (editingBooking?.id) {
            // Format lại datetime trước khi gửi lên server
            const formattedData = {
                ...editFormData,
                check_in: editFormData.check_in.replace('T', ' '),
                check_out: editFormData.check_out.replace('T', ' ')
            };
            
            updateBookingMutation.mutate({
                id: editingBooking.id,
                data: formattedData
            });
        }
    };

    // Handle booking deletion với optimistic updates
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
            // Optimistic update
            const previousBookings = queryClient.getQueryData(['all-booking']);
            queryClient.setQueryData(['all-booking'], (old) => 
                old.filter((booking) => booking.id !== bookingId)
            );

            // Thực hiện mutation
            deleteMutation.mutate(bookingId, {
                onError: () => {
                    // Rollback nếu có lỗi
                    queryClient.setQueryData(['all-booking'], previousBookings);
                }
            });
        }
    };

    // Handle status change
    const handleStatusChange = (id, newStatus) => {
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    // Handle payment status change
    const handlePaymentStatusChange = (id, newPaymentStatus) => {
        updatePaymentMutation.mutate({ id, payment_status: newPaymentStatus });
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedBooking(null);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingBooking(null);
        setEditFormData({
            quantity: '',
            guests: '',
            check_in: '',
            check_out: '',
            total_price: ''
        });
    };

    // Hiển thị loading
    if (isLoading) {
        return <div className='mt-40'><PartLoading /></div>;
    }

    // Hiển thị lỗi
    if (error) {
        return (
            <div className={container}>
                <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>
                    <p>Đã xảy ra lỗi khi tải dữ liệu</p>
                    <button 
                        onClick={() => refetch()}
                        style={{ 
                            padding: '10px 20px', 
                            marginTop: '20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
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
                                    <td className={td}>{user?.name || 'N/A'}</td>
                                    <td className={td}>
                                        {user?.email || 'N/A'}<br />
                                        {user?.phone || 'N/A'}
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
                                            disabled={deleteMutation.isPending || updatePaymentMutation.isPending}
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
                                            disabled={deleteMutation.isPending || updateStatusMutation.isPending}
                                        >
                                            <option value="confirmed">Xác nhận</option>
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
                                                disabled={deleteMutation.isPending}
                                            >
                                                <span className={buttonIcon}>👁️</span>
                                            </button>
                                            <button
                                                className={`${actionButton} ${editButton}`}
                                                onClick={() => handleEdit(booking.id)}
                                                title="Chỉnh sửa"
                                                disabled={deleteMutation.isPending}
                                            >
                                                <span className={buttonIcon}>✏️</span>
                                            </button>
                                            <button
                                                className={`${actionButton} ${deleteButton}`}
                                                onClick={() => handleDelete(booking.id)}
                                                title="Xóa"
                                                disabled={deleteMutation.isPending}
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
                                    name="quantity"
                                    className={formInput}
                                    value={editFormData.quantity}
                                    onChange={handleInputChange}
                                    min="1"
                                />
                            </div>
                            <div className={formGroup}>
                                <label className={formLabel}>Số người</label>
                                <input
                                    type="number"
                                    name="guests"
                                    className={formInput}
                                    value={editFormData.guests}
                                    onChange={handleInputChange}
                                    min="1"
                                />
                            </div>
                            <div className={formGroup}>
                                <label className={formLabel}>Ngày check-in</label>
                                <input
                                    type="datetime-local"
                                    name="check_in"
                                    className={formInput}
                                    value={editFormData.check_in}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={formGroup}>
                                <label className={formLabel}>Ngày check-out</label>
                                <input
                                    type="datetime-local"
                                    name="check_out"
                                    className={formInput}
                                    value={editFormData.check_out}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className={formGroup}>
                                <label className={formLabel}>Tổng tiền (VND)</label>
                                <input
                                    type="number"
                                    name="total_price"
                                    className={formInput}
                                    value={editFormData.total_price}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>
                        </div>
                        <div className={modalFooter}>
                            <button 
                                className={cancelButton} 
                                onClick={handleCloseEditModal}
                                disabled={updateBookingMutation.isPending}
                            >
                                Hủy
                            </button>
                            <button 
                                className={saveButton} 
                                onClick={handleUpdate}
                                disabled={updateBookingMutation.isPending}
                            >
                                {updateBookingMutation.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
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