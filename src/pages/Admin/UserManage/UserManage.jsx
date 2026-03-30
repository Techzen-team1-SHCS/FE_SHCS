import { useEffect, useState } from 'react';
import styles from './UserManage.module.css';
import { authService } from '../../../services/authService';
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import PartLoading from '../../../components/Loading/PartLoading';

const UserManage = () => {
    const {
        container,
        header,
        tableContainer,
        table,
        tableHeader,
        th,
        tableBody,
        tr,
        td,
        statusActive,
        statusSuspended,
        actionCell,
        actionButton,
        viewButton,
        editButton,
        banButton,
        unbanButton,
        buttonGroup,
        buttonIcon,
        userAvatar,
        avatarContainer,
        userInfo,
        userName,
        userEmail,
        roleBadge,
        roleAdmin,
        roleUser,
        statusBadge
    } = styles;

    const [usersData, setUsersData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const fetchUsers = async () => {  // ⬅ đưa ra ngoài để nơi khác gọi được
        try {
            setLoading(true);
            const response = await authService.getAllUsers();
            setUsersData(response || []);
        } catch (error) {
            console.error('Fetch users error:', error);
            setUsersData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(); // gọi khi load trang
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getRoleText = (role) => {
        return role === 1 ? 'Quản trị viên' : 'Người dùng';
    };

    const getRoleClass = (role) => {
        return role === 1 ? roleAdmin : roleUser;
    };

    const getStatusInfo = (user) => {
        // Check is_blocked (0 = không bị chặn, 1 = đang bị chặn)
        if (user.is_blocked === 1) {
            return { text: 'Bị chặn', class: statusSuspended };
        } else {
            return { text: 'Hoạt động', class: statusActive };
        }
    };

    // const handleView = (userId) => {
    //     const user = usersData.find(u => u.id === userId);
    //     setSelectedUser(user);
    //     setIsSidebarOpen(true);
    // };

    // const handleEdit = (userId) => {
    //     console.log('Edit user:', userId);
    //     // Xử lý chỉnh sửa
    // };

    // const handleDelete = (userId) => {
    //     console.log('Delete user:', userId);
    //     if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
    //         // Xử lý xóa
    //     }
    // };

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
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Tên:</label>
                        <input id="editName" type="text" class="swal2-input" value="${user.name || ''}" placeholder="Tên người dùng">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Email:</label>
                        <input id="editEmail" type="email" class="swal2-input" value="${user.email || ''}" placeholder="Email">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Điện thoại:</label>
                        <input id="editPhone" type="text" class="swal2-input" value="${user.phone || ''}" placeholder="Điện thoại">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Địa chỉ:</label>
                        <input id="editAddress" type="text" class="swal2-input" value="${user.address || ''}" placeholder="Địa chỉ">
                    </div>
                </div>
            `,
            focusConfirm: false,
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
                    toast.success('Cập nhật thông tin thành công!');
                    fetchUsers();
                } catch (error) {
                    toast.error('Cập nhật thất bại: ' + error.message);
                }
            }
        });
    };

    const handleToggleBan = async (user) => {
        const isUnban = user.is_blocked === 1;  // 1 = đang bị chặn, cần bỏ chặn
        const actionText = isUnban ? "bỏ chặn" : "chặn";
        const actionColor = isUnban ? "#3085d6" : "#d33";

        const result = await Swal.fire({
            title: `Xác nhận ${actionText}?`,
            text: `Bạn có chắc chắn muốn ${actionText} người dùng này?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: actionColor,
            cancelButtonColor: "#aaa",
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

            await Swal.fire({
                icon: "success",
                title: `Đã ${actionText} thành công!`,
                showConfirmButton: false,
                timer: 1500
            });

            fetchUsers(); // reload lại danh sách
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Lỗi!",
                text: error.message || "Có lỗi xảy ra"
            });
        }
    };


    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return <div className='mt-40'><PartLoading /></div>;
    }

    return (
        <div className={container}>
            <div className={header}>
                <div className={styles.headerStats}>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>{usersData.length}</span>
                        <span className={styles.statLabel}>Tổng người dùng</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>
                            {usersData.filter(user => user.role === 1).length}
                        </span>
                        <span className={styles.statLabel}>Quản trị viên</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statNumber}>
                            {usersData.filter(user => getStatusInfo(user).class === statusActive).length}
                        </span>
                        <span className={styles.statLabel}>Đang hoạt động</span>
                    </div>
                </div>
            </div>

            <div className={tableContainer}>
                <table className={table}>
                    <thead className={tableHeader}>
                        <tr>
                            <th className={th}>Người dùng</th>
                            <th className={th}>Thông tin</th>
                            <th className={th}>Vai trò</th>
                            <th className={th}>Trạng thái</th>
                            <th className={th}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {usersData.map((user) => {
                            const statusInfo = getStatusInfo(user);
                            return (
                                <tr key={user.id} className={tr}>
                                    <td className={td}>
                                        <div className={userInfo}>
                                            <div className={avatarContainer}>
                                                {user.image ? (
                                                    <img
                                                        src={user.image}
                                                        alt={user.name}
                                                        className={userAvatar}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div
                                                    className={styles.avatarPlaceholder}
                                                    style={{ display: user.image ? 'none' : 'flex' }}
                                                >
                                                    {getInitials(user.name)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className={userName}>{user.name || 'Chưa đặt tên'}</div>
                                                <div className={userEmail}>ID: {user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={td}>
                                        <div className={styles.userDetails}>
                                            <div className={styles.detailItem}>
                                                <strong>📞</strong> {user.phone || 'N/A'}
                                            </div>
                                            <div className={styles.detailItem}>
                                                <strong>📧</strong> {user.email}
                                            </div>
                                            <div className={styles.detailItem}>
                                                <strong>👤</strong> {user.gender === 'Male' ? 'Nam' : user.gender === 'Female' ? 'Nữ' : 'N/A'}
                                            </div>
                                            <div className={styles.detailItem}>
                                                <strong>🎂</strong> {formatDate(user.birth)}
                                            </div>
                                            {user.address && (
                                                <div className={styles.detailItem}>
                                                    <strong>📍</strong>
                                                    <span className={styles.address}>{user.address.substring(0, 30)}...</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className={td}>
                                        <span className={`${roleBadge} ${getRoleClass(user.role)}`}>
                                            {getRoleText(user.role)}
                                        </span>
                                    </td>
                                    <td className={td}>
                                        <span className={`${statusBadge} ${statusInfo.class}`}>
                                            {statusInfo.text}
                                        </span>
                                    </td>
                                    <td className={td}>
                                        <div className={actionCell}>
                                            <div className={buttonGroup}>
                                                <button
                                                    className={`${actionButton} ${viewButton}`}
                                                    onClick={() => handleView(user.id)}
                                                    title="Xem chi tiết"
                                                >
                                                    <span className={buttonIcon}>👁️</span>
                                                </button>
                                                <button
                                                    className={`${actionButton} ${editButton}`}
                                                    onClick={() => handleEdit(user.id)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className={buttonIcon}>✏️</span>
                                                </button>
                                                <button
                                                    className={`${actionButton} ${user.is_blocked === 1 ? unbanButton : banButton}`}
                                                    onClick={() => handleToggleBan(user)}
                                                    title={user?.is_blocked === 1 ? "Bỏ chặn" : "Chặn người dùng"}
                                                >
                                                    <span className={buttonIcon}>
                                                        {user?.is_blocked === 1 ? '🔓' : '🚫'}
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal xem chi tiết */}
            {isDetailModalOpen && selectedUser && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '30px',
                        maxWidth: '500px',
                        width: '90%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2>Chi tiết người dùng</h2>
                            <button
                                onClick={() => setIsDetailModalOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer'
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Tên:</strong> {selectedUser.name || 'N/A'}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Email:</strong> {selectedUser.email}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Điện thoại:</strong> {selectedUser.phone || 'N/A'}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Giới tính:</strong> {selectedUser.gender === 'Male' ? 'Nam' : selectedUser.gender === 'Female' ? 'Nữ' : 'N/A'}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Ngày sinh:</strong> {formatDate(selectedUser.birth)}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Địa chỉ:</strong> {selectedUser.address || 'N/A'}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Vai trò:</strong> {getRoleText(selectedUser.role)}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Trạng thái:</strong> {getStatusInfo(selectedUser).text}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <strong>Ngày tạo:</strong> {formatDate(selectedUser.createdAt)}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsDetailModalOpen(false)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#3085d6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManage;