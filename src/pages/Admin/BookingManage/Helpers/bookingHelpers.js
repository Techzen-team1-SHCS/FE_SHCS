// Lấy booking theo id
export const findBookingById = (list, id) => {
    if (!Array.isArray(list)) return null;
    return list.find(item => item.id === id) || null;
};

// Format datetime trước khi gửi API
export const formatBookingDateTime = (value) => {
    if (!value) return '';
    return value.replace('T', ' ');
};

// Format payload update booking
export const buildUpdatePayload = (formData) => {
    return {
        ...formData,
        check_in: formatBookingDateTime(formData.check_in),
        check_out: formatBookingDateTime(formData.check_out)
    };
};

// Lấy class status (không phụ thuộc styles)
export const getStatusKey = (status) => {
    if (!status) return '';
    return status.toLowerCase();
};

export const getPaymentKey = (status) => {
    if (!status) return '';
    return status.toLowerCase();
};