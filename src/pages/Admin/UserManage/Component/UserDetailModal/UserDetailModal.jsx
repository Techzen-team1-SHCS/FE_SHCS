import {
    formatDate,
    getRoleText,
    getStatusInfo
} from '../../Helpers/userHelpers';

const UserDetailModal = ({ isOpen, user, onClose, styles }) => {
    if (!isOpen || !user) return null;

    return (
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
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2>Chi tiết người dùng</h2>
                    <button
                        onClick={onClose}
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

                {/* Content */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <strong>Tên:</strong> {user.name || 'N/A'}
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <strong>Email:</strong> {user.email}
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <strong>Điện thoại:</strong> {user.phone || 'N/A'}
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <strong>Giới tính:</strong>
                        {user.gender === 'Male' ? 'Nam' :
                         user.gender === 'Female' ? 'Nữ' : 'N/A'}
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <strong>Ngày sinh:</strong> {formatDate(user.birth)}
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <strong>Địa chỉ:</strong> {user.address || 'N/A'}
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <strong>Vai trò:</strong> {getRoleText(user.role)}
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <strong>Trạng thái:</strong>
                        {getStatusInfo(user, styles).text}
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <strong>Ngày tạo:</strong> {formatDate(user.createdAt)}
                    </div>
                </div>

                {/* Footer */}
                <button
                    onClick={onClose}
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
    );
};

export default UserDetailModal;