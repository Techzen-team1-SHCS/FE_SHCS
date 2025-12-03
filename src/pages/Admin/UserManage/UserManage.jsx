import React, { useEffect, useState } from 'react';
import styles from './UserManage.module.css';
import { authService } from '../../../services/authService';
import DetailSidebar from '../../../components/Admin/DetailSidebar/DetailSidebar';
import UserSidebarContent from '../../../components/Admin/DetailSidebar/UserSidebarContent';

const UserManage = () => {
    const {
        container,
        header,
        title,
        tableContainer,
        table,
        tableHeader,
        th,
        tableBody,
        tr,
        td,
        statusActive,
        statusInactive,
        statusSuspended,
        statusPending,
        actionCell,
        actionButton,
        viewButton,
        editButton,
        deleteButton,
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedUser(null);
    };
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await authService.getAllUsers();
                setUsersData(response || []);
            } catch (error) {
                console.error('Fetch users error:', error);
                setUsersData([]);
            }
        }
        fetchUsers();
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
        // Giả sử status dựa trên trường isActive hoặc tương tự
        // Nếu không có trường status, mặc định là active
        const isActive = user.isActive !== false;

        if (user.isBanned) {
            return { text: 'Bị chặn', class: statusSuspended };
        } else if (!isActive) {
            return { text: 'Không hoạt động', class: statusInactive };
        } else {
            return { text: 'Hoạt động', class: statusActive };
        }
    };

    const handleView = (userId) => {
        const user = usersData.find(u => u.id === userId);
        setSelectedUser(user);
        setIsSidebarOpen(true);
    };

    const handleEdit = (userId) => {
        console.log('Edit user:', userId);
        // Xử lý chỉnh sửa
    };

    const handleDelete = (userId) => {
        console.log('Delete user:', userId);
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            // Xử lý xóa
        }
    };

    const handleToggleBan = (user) => {
        const action = user.isBanned ? 'bỏ chặn' : 'chặn';
        if (window.confirm(`Bạn có chắc chắn muốn ${action} người dùng này?`)) {
            console.log(`${action} user:`, user.id);
            // Xử lý chặn/bỏ chặn
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

    return (
        <div className={container}>
            <div className={header}>
                <h1 className={title}>Quản lý người dùng</h1>
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
                                                    className={`${actionButton} ${user.isBanned ? unbanButton : banButton}`}
                                                    onClick={() => handleToggleBan(user)}
                                                    title={user?.isBanned ? "Bỏ chặn" : "Chặn người dùng"}
                                                >
                                                    <span className={buttonIcon}>
                                                        {user?.isBanned ? '🔓' : '🚫'}
                                                    </span>
                                                </button>
                                                <button
                                                    className={`${actionButton} ${deleteButton}`}
                                                    onClick={() => handleDelete(user.id)}
                                                    title="Xóa"
                                                >
                                                    <span className={buttonIcon}>🗑️</span>
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
            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={handleCloseSidebar}
                title="Chi tiết người dùng"
                type="user"
            >
                {selectedUser && <UserSidebarContent user={selectedUser} />}
            </DetailSidebar>
        </div>
    );
};

export default UserManage;