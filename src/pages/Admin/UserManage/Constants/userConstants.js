// ROLE
export const USER_ROLES = {
    ADMIN: 1,
    MANAGER: 2,
    USER: 0
};

export const ROLE_TEXT = {
    [USER_ROLES.ADMIN]: 'Quản trị viên',
    [USER_ROLES.MANAGER]: 'Quản lý khách sạn',
    [USER_ROLES.USER]: 'Người dùng'
};

// STATUS
export const USER_STATUS = {
    ACTIVE: 0,
    BLOCKED: 1
};

export const STATUS_TEXT = {
    [USER_STATUS.ACTIVE]: 'Hoạt động',
    [USER_STATUS.BLOCKED]: 'Bị chặn'
};