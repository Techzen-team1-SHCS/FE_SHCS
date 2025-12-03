import React from 'react';
import styles from './UserSidebarContent.module.css';

const UserSidebarContent = ({ user }) => {
    const {
        userHeader,
        userAvatar,
        avatarContainer,
        avatarImage,
        avatarPlaceholder,
        userName,
        userEmail,
        userRole,
        userInfo,
        infoSection,
        sectionTitle,
        detailGrid,
        detailItem,
        detailLabel,
        detailValue,
        statusSection,
        statusBadge,
        statusActive,
        statusInactive,
        statusBanned,
        walletSection,
        walletBalance,
        actionsSection,
        actionButton,
        editButton,
        banButton,
        unbanButton,
        verifyButton,
        resetPasswordButton,
        icon,
        timestampSection,
        timestampItem
    } = styles;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getRoleText = (role) => {
        switch(role) {
            case 1: return 'Quản trị viên';
            case 2: return 'Doanh nghiệp';
            default: return 'Người dùng';
        }
    };

    const getRoleColor = (role) => {
        switch(role) {
            case 1: return '#dc3545'; // admin - đỏ
            case 2: return '#17a2b8'; // business - xanh dương
            default: return '#28a745'; // user - xanh lá
        }
    };

    const getGenderText = (gender) => {
        if (!gender) return 'Chưa cập nhật';
        return gender === 'Male' ? 'Nam' : gender === 'Female' ? 'Nữ' : gender;
    };

    const getStatusInfo = (user) => {
        if (user.isBanned || user.banned_at) {
            return { text: 'Bị chặn', class: statusBanned };
        }
        if (user.email_verified_at) {
            return { text: 'Đã xác thực', class: statusActive };
        }
        return { text: 'Chưa xác thực', class: statusInactive };
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

    const isEmailVerified = () => {
        return user.email_verified_at !== null;
    };

    const handleEdit = () => {
        console.log('Edit user:', user.id);
        // Xử lý chỉnh sửa
    };

    const handleToggleBan = () => {
        const action = user.isBanned || user.banned_at ? 'bỏ chặn' : 'chặn';
        if (window.confirm(`Bạn có chắc chắn muốn ${action} người dùng này?`)) {
            console.log(`${action} user:`, user.id);
            // Xử lý chặn/bỏ chặn
        }
    };

    const handleVerifyEmail = () => {
        if (window.confirm('Xác thực email cho người dùng này?')) {
            console.log('Verify email for user:', user.id);
            // Xử lý xác thực email
        }
    };

    const handleResetPassword = () => {
        if (window.confirm('Đặt lại mật khẩu cho người dùng này?')) {
            console.log('Reset password for user:', user.id);
            // Xử lý đặt lại mật khẩu
        }
    };

    if (!user) return null;

    const statusInfo = getStatusInfo(user);

    return (
        <div className={userInfo}>
            {/* Header với avatar và thông tin cơ bản */}
            <div className={userHeader}>
                <div className={avatarContainer}>
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={user.name}
                            className={avatarImage}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div
                        className={avatarPlaceholder}
                        style={{ 
                            display: user.image ? 'none' : 'flex',
                            backgroundColor: getRoleColor(user.role)
                        }}
                    >
                        {getInitials(user.name)}
                    </div>
                </div>
                <div className={userName}>
                    <h3>{user.name || 'Chưa đặt tên'}</h3>
                    <div className={userEmail}>{user.email}</div>
                    <div className={userRole} style={{ color: getRoleColor(user.role) }}>
                        {getRoleText(user.role)}
                    </div>
                </div>
            </div>

            {/* Trạng thái */}
            <div className={statusSection}>
                <div className={detailItem}>
                    <div className={detailLabel}>Trạng thái</div>
                    <div className={detailValue}>
                        <span className={`${statusBadge} ${statusInfo.class}`}>
                            {statusInfo.text}
                        </span>
                    </div>
                </div>
                <div className={detailItem}>
                    <div className={detailLabel}>Xác thực email</div>
                    <div className={detailValue}>
                        {isEmailVerified() ? (
                            <span className={`${statusBadge} ${statusActive}`}>
                                ✅ Đã xác thực
                            </span>
                        ) : (
                            <span className={`${statusBadge} ${statusInactive}`}>
                                ⏳ Chưa xác thực
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Thông tin cá nhân */}
            <div className={infoSection}>
                <h3 className={sectionTitle}>Thông tin cá nhân</h3>
                <div className={detailGrid}>
                    <div className={detailItem}>
                        <div className={detailLabel}>ID</div>
                        <div className={detailValue}>{user.id}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Số điện thoại</div>
                        <div className={detailValue}>{user.phone || 'Chưa cập nhật'}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Giới tính</div>
                        <div className={detailValue}>{getGenderText(user.gender)}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Ngày sinh</div>
                        <div className={detailValue}>
                            {user.birth ? formatDate(user.birth).split(',')[0] : 'Chưa cập nhật'}
                        </div>
                    </div>
                    <div className={detailItem} style={{ gridColumn: '1 / -1' }}>
                        <div className={detailLabel}>Địa chỉ</div>
                        <div className={detailValue}>{user.address || 'Chưa cập nhật'}</div>
                    </div>
                </div>
            </div>

            {/* Ví tiền */}
            <div className={walletSection}>
                <h3 className={sectionTitle}>Ví tiền</h3>
                <div className={detailGrid}>
                    <div className={detailItem}>
                        <div className={detailLabel}>Số dư hiện tại</div>
                        <div className={walletBalance}>
                            {formatCurrency(user.wallet_balance || 0)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Thời gian */}
            <div className={timestampSection}>
                <h3 className={sectionTitle}>Thời gian</h3>
                <div className={detailGrid}>
                    <div className={detailItem}>
                        <div className={detailLabel}>Ngày tạo</div>
                        <div className={timestampItem}>
                            {formatDate(user.created_at)}
                        </div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Cập nhật lần cuối</div>
                        <div className={timestampItem}>
                            {formatDate(user.updated_at)}
                        </div>
                    </div>
                    {user.email_verified_at && (
                        <div className={detailItem}>
                            <div className={detailLabel}>Xác thực email lúc</div>
                            <div className={timestampItem}>
                                {formatDate(user.email_verified_at)}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className={actionsSection}>
                <h3 className={sectionTitle}>Thao tác</h3>
                <div className={detailGrid}>
                    <button
                        className={`${actionButton} ${editButton}`}
                        onClick={handleEdit}
                    >
                        <span className={icon}>✏️</span> Chỉnh sửa
                    </button>
                    
                    {user.isBanned || user.banned_at ? (
                        <button
                            className={`${actionButton} ${unbanButton}`}
                            onClick={handleToggleBan}
                        >
                            <span className={icon}>🔓</span> Bỏ chặn
                        </button>
                    ) : (
                        <button
                            className={`${actionButton} ${banButton}`}
                            onClick={handleToggleBan}
                        >
                            <span className={icon}>🚫</span> Chặn người dùng
                        </button>
                    )}
                    
                    {!isEmailVerified() && (
                        <button
                            className={`${actionButton} ${verifyButton}`}
                            onClick={handleVerifyEmail}
                        >
                            <span className={icon}>✅</span> Xác thực email
                        </button>
                    )}
                    
                    <button
                        className={`${actionButton} ${resetPasswordButton}`}
                        onClick={handleResetPassword}
                    >
                        <span className={icon}>🔑</span> Đặt lại mật khẩu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserSidebarContent;