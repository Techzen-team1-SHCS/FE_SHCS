import { useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import styles from '../BookingManage.module.css';
import { formatDateTime, formatVND } from '../../../../utils/dateUtils';
import DetailSidebar from '../../../../components/Admin/DetailSidebar/DetailSidebar';
import BookingSidebarContent from '../../../../components/Admin/DetailSidebar/BookingSidebarContent';
import PartLoading from '../../../../components/Loading/PartLoading';
import { AuthContext } from '../../../../contexts/AuthContext';
import { useBookings } from '../Hooks/useBookings';
import { useBookingMutations } from '../Hooks/useBookingMutations';
import { useBookingUI } from '../Hooks/useBookingUI';
import {
    findBookingById,
    buildUpdatePayload,
    getStatusKey,
    getPaymentKey
} from '../Helpers/bookingHelpers';
import {
    BOOKING_STATUS_MAP,
    PAYMENT_STATUS_MAP,
    DEFAULT_BOOKING_FORM,
    BOOKING_STATUS_OPTIONS,
    PAYMENT_STATUS_OPTIONS
} from '../Constants/bookingConstants';
import ErrorState from '../Component/ErrorState/ErrorState';
import BookingTable from '../Component/BookingTable/BookingTable';
import EditBookingModal from '../Component/EditBookingModal/EditBookingModal';
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
    } = styles;
    const { data: bookingData = [], isLoading, error, refetch } = useBookings();
    const {
        updateStatusMutation,
        updatePaymentMutation,
        deleteMutation,
        updateBookingMutation
    } = useBookingMutations();
    const {
        selectedBooking,
        setSelectedBooking,
        isSidebarOpen,
        setIsSidebarOpen,
        isEditModalOpen,
        setIsEditModalOpen,
        editingBooking,
        setEditingBooking,
        editFormData,
        setEditFormData
    } = useBookingUI();
    const handleStatusChange = (id, status) => {
        updateStatusMutation.mutate({ id, status });
    };
    const handleDelete = (id) => {
        deleteMutation.mutate(id);
    };
    const handleUpdate = () => {
        updateBookingMutation.mutate({
            id: editingBooking.id,
            data: buildUpdatePayload(editFormData)
        });
    };
    const queryClient = useQueryClient();
    const { user } = useContext(AuthContext);
    const getStatusClass = (status) => {
        if (!status) return '';
        return styles[BOOKING_STATUS_MAP[status.toLowerCase()]] || '';
    };

    const getPaymentClass = (status) => {
        if (!status) return '';
        return styles[PAYMENT_STATUS_MAP[status.toLowerCase()]] || '';
    };
    // View booking details
    const handleView = (bookingId) => {
        const booking = findBookingById(bookingData, bookingId);
        setSelectedBooking(booking);
        setIsSidebarOpen(true);
    };

    // Open edit modal
    const handleEdit = (bookingId) => {
        const booking = findBookingById(bookingData, bookingId);
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
        setEditFormData(DEFAULT_BOOKING_FORM);
    };
    // Hiển thị loading
    if (isLoading) {
        return <div className='mt-40'><PartLoading /></div>;
    }
    // Hiển thị lỗi
    if (error) {
        return (
            <div className={container}>
                <ErrorState
                    message="Đã xảy ra lỗi khi tải dữ liệu"
                    onRetry={refetch}
                />
            </div>
        );
    }
    return (
        <div className={container}>
            <BookingTable
                styles={styles}
                bookingData={bookingData}
                user={user}
                formatDateTime={formatDateTime}
                formatVND={formatVND}
                getStatusClass={getStatusClass}
                getPaymentClass={getPaymentClass}
                handleStatusChange={handleStatusChange}
                handlePaymentStatusChange={handlePaymentStatusChange}
                handleView={handleView}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                PAYMENT_STATUS_OPTIONS={PAYMENT_STATUS_OPTIONS}
                BOOKING_STATUS_OPTIONS={BOOKING_STATUS_OPTIONS}
                isDeleting={deleteMutation.isPending}
            />
            {/* Edit Modal */}
            <EditBookingModal
                styles={styles}
                isOpen={isEditModalOpen}
                booking={editingBooking}
                formData={editFormData}
                onChange={handleInputChange}
                onClose={handleCloseEditModal}
                onSave={handleUpdate}
                isLoading={updateBookingMutation.isPending}
            />
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