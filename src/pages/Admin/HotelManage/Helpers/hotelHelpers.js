import {
    DEFAULT_TOTAL_ROOMS,
    CURRENCY_CONFIG
} from '../Constants/hotelConstants';

// ===== FORMAT =====
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat(
        CURRENCY_CONFIG.locale,
        {
            style: 'currency',
            currency: CURRENCY_CONFIG.currency
        }
    ).format(amount);
};

export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// ===== HOTEL CLASS =====
export const parseHotelClassFromServer = (hotelClass) => {
    if (!hotelClass) return '';

    return hotelClass >= 10
        ? (hotelClass / 10).toString()
        : hotelClass.toString();
};

export const formatHotelClassForServer = (hotelClass) => {
    const value = parseFloat(hotelClass);

    if (isNaN(value) || value < 1 || value > 5) {
        return 0;
    }

    return value;
};

// ===== ROOM =====
export const getRoomStats = (hotel) => {
    if (!hotel?.rooms) {
        return {
            totalRooms: 0,
            occupiedRooms: 0,
            availableRooms: 0
        };
    }

    const totalRooms = hotel.rooms.reduce(
        (total, room) => total + (room.quantity || 0),
        0
    );

    const occupiedRooms = hotel.rooms.reduce(
        (total, room) => total + (room.occupied || 0),
        0
    );

    return {
        totalRooms,
        occupiedRooms,
        availableRooms: totalRooms - occupiedRooms
    };
};

// ===== STATUS =====
export const getStatusText = (hotel) => {
    const { totalRooms, occupiedRooms } = getRoomStats(hotel);

    if (occupiedRooms === 0) return "Trống";
    if (DEFAULT_TOTAL_ROOMS - totalRooms === 0) return "Hết phòng";
    return "Còn phòng";
};

export const getStatusBadge = (hotel) => {
    if (!hotel?.rooms) return 'available';

    const totalRooms = hotel.rooms.reduce((t, r) => t + (r.quantity || 0), 0);
    const occupiedRooms = hotel.rooms.reduce((t, r) => t + (r.occupied || 0), 0);

    if (occupiedRooms === 0) return 'available';
    if (30 - totalRooms === 0) return 'occupied';

    return 'available';
};

// ===== STAR =====
export const getStarValue = (hotelClass) => {
    if (!hotelClass) return 0;

    return hotelClass >= 10
        ? hotelClass / 10
        : hotelClass;
};

export const getStarText = (hotelClass) => {
    const star = getStarValue(hotelClass);
    return star ? `${star}/5` : '0/5';
};
export const getStatusClass = (hotel, statusAvailable, statusOccupied) => {
    const status = getStatusBadge(hotel);
    return status === 'occupied' ? statusOccupied : statusAvailable;
};