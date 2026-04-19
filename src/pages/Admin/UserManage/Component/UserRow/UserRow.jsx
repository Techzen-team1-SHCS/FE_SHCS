import {
    formatDate,
    getRoleText,
    getRoleClass,
    getStatusInfo,
    getInitials
} from '../../Helpers/userHelpers';

const UserRow = ({
    user,
    styles,
    handleView,
    handleEdit,
    handleToggleBan
}) => {
    const {
        tr, td,
        userInfo, avatarContainer, userAvatar,
        userName, userEmail,
        roleBadge, statusBadge,
        actionCell, actionButton,
        viewButton, editButton, banButton, unbanButton,
        buttonGroup, buttonIcon
    } = styles;

    const statusInfo = getStatusInfo(user, styles);

    return (
        <tr className={tr}>
            <td className={td}>
                <div className={userInfo}>
                    <div className={avatarContainer}>
                        {user.image && (
                            <img
                                src={user.image}
                                alt={user.name}
                                className={userAvatar}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        )}
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
                        <strong>👤</strong>
                        {user.gender === 'Male' ? 'Nam' : user.gender === 'Female' ? 'Nữ' : 'N/A'}
                    </div>
                    <div className={styles.detailItem}>
                        <strong>🎂</strong> {formatDate(user.birth)}
                    </div>
                </div>
            </td>

            <td className={td}>
                <span className={`${roleBadge} ${getRoleClass(user.role, styles)}`}>
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
                        >
                            <span className={buttonIcon}>👁️</span>
                        </button>

                        <button
                            className={`${actionButton} ${editButton}`}
                            onClick={() => handleEdit(user.id)}
                        >
                            <span className={buttonIcon}>✏️</span>
                        </button>

                        <button
                            className={`${actionButton} ${user.is_blocked === 1 ? unbanButton : banButton}`}
                            onClick={() => handleToggleBan(user)}
                        >
                            <span className={buttonIcon}>
                                {user.is_blocked === 1 ? '🔓' : '🚫'}
                            </span>
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default UserRow;