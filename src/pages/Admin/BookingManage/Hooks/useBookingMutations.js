// hooks/useBookingMutations.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { bookingService } from '../../../../services/bookingService';

export const useBookingMutations = () => {
    const queryClient = useQueryClient();

    const invalidate = () => {
        queryClient.invalidateQueries(['all-booking']);
    };

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) =>
            bookingService.updateBooking(id, { status }),
        onSuccess: () => {
            invalidate();
            toast.success('Cập nhật trạng thái thành công');
        },
        onError: () => {
            toast.error('Không thể cập nhật trạng thái');
        }
    });

    const updatePaymentMutation = useMutation({
        mutationFn: ({ id, payment_status }) =>
            bookingService.updateBooking(id, { payment_status }),
        onSuccess: () => {
            invalidate();
            toast.success('Cập nhật thanh toán thành công');
        },
        onError: () => {
            toast.error('Không thể cập nhật thanh toán');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => bookingService.DeleteBooking(id),
        onSuccess: () => {
            invalidate();
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Xóa đặt phòng thành công",
                timer: 1500,
                showConfirmButton: false
            });
        },
        onError: () => {
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Không thể xóa đặt phòng"
            });
        }
    });

    const updateBookingMutation = useMutation({
        mutationFn: ({ id, data }) =>
            bookingService.updateBooking(id, data),
        onSuccess: () => {
            invalidate();
            toast.success('Cập nhật thành công');
        },
        onError: () => {
            toast.error('Không thể cập nhật');
        }
    });

    return {
        updateStatusMutation,
        updatePaymentMutation,
        deleteMutation,
        updateBookingMutation
    };
};