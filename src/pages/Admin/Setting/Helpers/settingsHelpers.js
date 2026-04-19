// settings.helpers.js

export const getTotalHotels = (hotels) => {
    return hotels?.data?.data?.length || hotels?.data?.length || 0;
};

// Chuẩn hóa bookings
export const getTotalBookings = (bookings) => {
    return bookings?.data?.length || bookings?.length || 0;
};

// Chuẩn hóa users
export const getTotalUsers = (users) => {
    return users?.length || 0;
};

// Chuẩn hóa revenue
export const getTotalRevenue = (revenue) => {
    return revenue || 0;
};

// Tổng hợp system stats
export const buildSystemStats = ({
    users,
    hotels,
    bookings,
    revenue
}) => {
    return {
        totalUsers: getTotalUsers(users),
        totalHotels: getTotalHotels(hotels),
        totalBookings: getTotalBookings(bookings),
        totalRevenue: getTotalRevenue(revenue)
    };
};