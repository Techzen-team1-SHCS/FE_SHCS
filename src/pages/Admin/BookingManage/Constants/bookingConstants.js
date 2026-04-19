// Booking status class map
export const BOOKING_STATUS_MAP = {
    confirmed: 'statusConfirmed',
    'checked-in': 'statusCheckedIn',
    completed: 'statusCompleted',
    canceled: 'statusCanceled'
};

// Payment status class map
export const PAYMENT_STATUS_MAP = {
    paid: 'paymentPaid',
    bonding: 'paymentBonding',
    canceled: 'paymentCanceled'
};

// Default form data
export const DEFAULT_BOOKING_FORM = {
    quantity: '',
    guests: '',
    check_in: '',
    check_out: '',
    total_price: ''
};

// Select options
export const BOOKING_STATUS_OPTIONS = [
    { value: 'confirmed', label: 'Xác nhận' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'canceled', label: 'Đã hủy' }
];

export const PAYMENT_STATUS_OPTIONS = [
    { value: 'bonding', label: 'Chờ thanh toán' },
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'canceled', label: 'Đã hủy' }
];