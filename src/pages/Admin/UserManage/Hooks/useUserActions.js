import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { authService } from '../../../../services/authService';

export const useUserActions = (usersData, fetchUsers, setSelectedUser, setIsDetailModalOpen) => {

    const handleView = (userId) => {
        const user = usersData.find(u => u.id === userId);
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (userId) => {
        const user = usersData.find(u => u.id === userId);
        if (!user) return;

        Swal.fire({
            title: 'Chỉnh sửa thông tin người dùng',
            html: `
                <div style="text-align: left;">
                    <input id="editName" class="swal2-input" value="${user.name || ''}" placeholder="Tên">
                    <input id="editEmail" class="swal2-input" value="${user.email || ''}" placeholder="Email">
                    <input id="editPhone" class="swal2-input" value="${user.phone || ''}" placeholder="Điện thoại">
                    <input id="editAddress" class="swal2-input" value="${user.address || ''}" placeholder="Địa chỉ">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Lưu',
            cancelButtonText: 'Hủy',
            preConfirm: async () => {
                const updatedData = {
                    name: document.getElementById('editName').value,
                    email: document.getElementById('editEmail').value,
                    phone: document.getElementById('editPhone').value,
                    address: document.getElementById('editAddress').value
                };

                try {
                    await authService.updateUser(userId, updatedData);
                    toast.success('Cập nhật thành công!');
                    fetchUsers();
                } catch (error) {
                    toast.error('Thất bại: ' + error.message);
                }
            }
        });
    };

    const handleToggleBan = async (user) => {
        const isUnban = user.is_blocked === 1;
        const actionText = isUnban ? "bỏ chặn" : "chặn";

        const result = await Swal.fire({
            title: `Xác nhận ${actionText}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Có, ${actionText}`,
            cancelButtonText: "Hủy"
        });

        if (!result.isConfirmed) return;

        try {
            if (isUnban) {
                await authService.unblockUser(user.id);
            } else {
                await authService.blockUser(user.id);
            }

            toast.success(`Đã ${actionText} thành công`);
            fetchUsers();
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra");
        }
    };

    return {
        handleView,
        handleEdit,
        handleToggleBan
    };
};