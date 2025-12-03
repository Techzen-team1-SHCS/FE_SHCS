import React, { useEffect, useState } from 'react';
import styles from './HotelManage.module.css';
import { hotelService } from '../../../services/hotelService';
import DetailSidebar from '../../../components/Admin/DetailSidebar/DetailSidebar.jsx'; // Import Sidebar chung
import HotelSidebarContent from '../../../components/Admin/DetailSidebar/HotelSidebarContent.jsx'; // Import nội dung sidebar cụ thể
const HotelManage = () => {
    const {
        container,
        header,
        title,
        tableContainer,
        table,
        tableHeader,
        th,
        tableBody,
        tr,
        td,
        actionCell,
        actionButton,
        viewButton,
        editButton,
        deleteButton,
        buttonGroup,
        buttonIcon,
        statusBadge,
        statusAvailable,
        statusOccupied,
        hotelImage,
        imageContainer,
        hotelInfo,
        hotelName,
        hotelLocation,
        statsContainer,
        statItem,
        statValue,
        statLabel,
        
    } = styles;

    const [hotelsData, setHotelsData] = useState([]);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await hotelService.getAllHotels();
                setHotelsData(response || []);
            } catch (error) {
                console.error('Fetch hotels error:', error);
                setHotelsData([]);
            }
        }
        fetchHotels();
    }, []);
    // Thêm state cho sidebar
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleView = (hotelId) => {
        const hotel = hotelsData.find(h => h.id === hotelId);
        setSelectedHotel(hotel);
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedHotel(null);
    };

    // Các hàm hỗ trợ
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (hotel) => {
        const totalRooms = hotel?.rooms?.reduce((total, room) => total + (room.quantity || 0), 0) || 0;
        const occupiedRooms = hotel?.rooms?.reduce((total, room) => total + (room.occupied || 0), 0) || 0;

        if (occupiedRooms === 0) return statusAvailable;
        if (occupiedRooms === totalRooms) return statusOccupied;
        return statusAvailable;
    };

    const getStatusText = (hotel) => {
        const totalRooms = hotel?.rooms?.reduce((total, room) => total + (room.quantity || 0), 0) || 0;
        const occupiedRooms = hotel?.rooms?.reduce((total, room) => total + (room.occupied || 0), 0) || 0;

        if (occupiedRooms === 0) return "Trống";
        if (occupiedRooms === totalRooms) return "Hết phòng";
        return "Còn phòng";
    };

    const renderStars = (rating) => {
        const stars = [];
        const starRating = rating / 10; // 40 -> 4 sao
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= starRating ? '#ffc107' : '#e4e5e9' }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    const getRoomStats = (hotel) => {
        const totalRooms = hotel?.rooms?.reduce((total, room) => total + (room.quantity || 0), 0) || 0;
        const occupiedRooms = hotel?.rooms?.reduce((total, room) => total + (room.occupied || 0), 0) || 0;
        const availableRooms = totalRooms - occupiedRooms;

        return { totalRooms, occupiedRooms, availableRooms };
    };

    return (
        <div className={container}>
            <div className={header}>
                <h1 className={title}>Quản lý khách sạn</h1>
            </div>

            <div className={tableContainer}>
                <table className={table}>
                    <thead className={tableHeader}>
                        <tr>
                            <th className={th}>Khách sạn</th>
                            <th className={th}>Địa điểm</th>
                            <th className={th}>Thông tin</th>
                            <th className={th}>Trạng thái</th>
                            <th className={th}>Đánh giá</th>
                            <th className={th}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {hotelsData.map((hotel) => (
                            <tr key={hotel.id} className={tr}>
                                <td className={td}>
                                    <div className={hotelInfo}>
                                        <div className={imageContainer}>
                                            <img
                                                src={hotel?.images?.[0]?.url || '/default-hotel.jpg'}
                                                alt={hotel.name}
                                                className={hotelImage}
                                                onError={(e) => {
                                                    e.target.src = '/default-hotel.jpg';
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className={hotelName}>{hotel?.name}</div>
                                            <div className={hotelLocation}>ID: {hotel.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className={td}>
                                    <div className={hotelLocation}>
                                        <strong>{hotel?.province}</strong>
                                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                            {hotel?.description?.substring(0, 50)}...
                                        </div>
                                    </div>
                                </td>
                                <td className={td}>
                                    <div className={statsContainer}>
                                        <div className={statItem}>
                                            <div className={statValue}>
                                                {getRoomStats(hotel).totalRooms}
                                            </div>
                                            <div className={statLabel}>Tổng phòng</div>
                                        </div>
                                        <div className={statItem}>
                                            <div className={statValue}>
                                                {formatCurrency(hotel?.price)}
                                            </div>
                                            <div className={statLabel}>Giá từ</div>
                                        </div>
                                    </div>
                                </td>
                                <td className={td}>
                                    <span className={`${statusBadge} ${getStatusBadge(hotel)}`}>
                                        {getStatusText(hotel)}
                                    </span>
                                </td>
                                <td className={td}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                                            {renderStars(hotel?.hotel_class)}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            {hotel?.hotel_class / 10}/5
                                        </div>
                                    </div>
                                </td>
                                <td className={td}>
                                    <div className={actionCell}>
                                        <div className={buttonGroup}>
                                            <button
                                                className={`${actionButton} ${viewButton}`}
                                                onClick={() => handleView(hotel.id)}
                                                title="Xem chi tiết"
                                            >
                                                <span className={buttonIcon}>👁️</span>
                                            </button>
                                            <button
                                                className={`${actionButton} ${editButton}`}
                                                onClick={() => handleEdit(hotel.id)}
                                                title="Chỉnh sửa"
                                            >
                                                <span className={buttonIcon}>✏️</span>
                                            </button>
                                            <button
                                                className={`${actionButton} ${deleteButton}`}
                                                onClick={() => handleDelete(hotel.id)}
                                                title="Xóa"
                                            >
                                                <span className={buttonIcon}>🗑️</span>
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Sidebar chi tiết */}
            {/* Sử dụng Sidebar chung */}
            <DetailSidebar
                isOpen={isSidebarOpen}
                onClose={handleCloseSidebar}
                title="Chi tiết khách sạn"
                type="hotel"
            >
                {selectedHotel && <HotelSidebarContent hotel={selectedHotel} />}
            </DetailSidebar>
        </div>
    );
};

export default HotelManage;