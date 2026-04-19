import {
    USER_ROLES,
    ROLE_TEXT,
    USER_STATUS,
    STATUS_TEXT
} from '../Constants/userConstants';

// format date
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

// role
export const getRoleText = (role) => {
    return ROLE_TEXT[role] || ROLE_TEXT[USER_ROLES.USER];
};

export const getRoleClass = (role, styles) => {
    if (role === USER_ROLES.ADMIN) return styles.roleAdmin;
    if (role === USER_ROLES.MANAGER) return styles.roleManager;
    return styles.roleUser;
};

// status
export const getStatusInfo = (user, styles) => {
    if (user.is_blocked === USER_STATUS.BLOCKED) {
        return {
            text: STATUS_TEXT[USER_STATUS.BLOCKED],
            class: styles.statusSuspended
        };
    }
    return {
        text: STATUS_TEXT[USER_STATUS.ACTIVE],
        class: styles.statusActive
    };
};

// initials avatar
export const getInitials = (name) => {
    if (!name) return 'U';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// optional: thống kê
export const countAdmins = (users) =>
    users.filter(u => u.role === USER_ROLES.ADMIN).length;

export const countActiveUsers = (users) =>
    users.filter(u => u.is_blocked === USER_STATUS.ACTIVE).length;