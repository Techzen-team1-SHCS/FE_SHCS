export const parseHotelClassFromServer = (hotelClass) => {
    if (!hotelClass) return '';
    if (hotelClass >= 10) {
        return (hotelClass / 10).toString();
    }
    return hotelClass.toString();
};

export const formatHotelClassForServer = (hotelClass) => {
    const value = parseFloat(hotelClass);
    if (isNaN(value) || value < 1 || value > 5) {
        return 0;
    }
    return value;
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
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

export const getStarText = (hotelClass) => {
    let starRating;
    if (hotelClass >= 10) {
        starRating = hotelClass / 10;
    } else {
        starRating = hotelClass;
    }
    return starRating ? `${starRating}/5` : '0/5';
};

export const getStatusBadge = (hotel, styles) => {
    if (!hotel?.rooms) return styles.statusAvailable;

    const totalRooms = hotel.rooms.reduce((total, room) => total + (room.quantity || 0), 0) || 0;
    const occupiedRooms = hotel.rooms.reduce((total, room) => total + (room.occupied || 0), 0) || 0;

    if (occupiedRooms === 0) return styles.statusAvailable;
    if (30 - totalRooms === 0) return styles.statusOccupied;
    return styles.statusAvailable;
};

export const getStatusText = (hotel) => {
    if (!hotel?.rooms) return "Trống";

    const totalRooms = hotel.rooms.reduce((total, room) => total + (room.quantity || 0), 0) || 0;
    const occupiedRooms = hotel.rooms.reduce((total, room) => total + (room.occupied || 0), 0) || 0;

    if (occupiedRooms === 0) return "Trống";
    if (30 - totalRooms === 0) return "Hết phòng";
    return "Còn phòng";
};

export const getRoomStats = (hotel) => {
    if (!hotel?.rooms) return { totalRooms: 0, occupiedRooms: 0, availableRooms: 0 };

    const totalRooms = hotel.rooms.reduce((total, room) => total + (room.quantity || 0), 0) || 0;
    const occupiedRooms = hotel.rooms.reduce((total, room) => total + (room.occupied || 0), 0) || 0;
    const availableRooms = totalRooms - occupiedRooms;

    return { totalRooms, occupiedRooms, availableRooms };
};
