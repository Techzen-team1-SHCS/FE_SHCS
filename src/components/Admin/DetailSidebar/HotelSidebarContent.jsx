import styles from './HotelSidebarContent.module.css';

const HotelSidebarContent = ({ hotel }) => {
    const {
        imageSection,
        hotelImage,
        infoSection,
        sectionTitle,
        detailGrid,
        detailItem,
        detailLabel,
        detailValue,
        amenitiesSection,
        amenitiesGrid,
        amenityItem,
        descriptionSection,
        descriptionText,
        roomStatsSection,
        timestampSection,
        timestampItem,
        statusBadge,
        statusAvailable,
        statusOccupied,
        starIcon,
        starFilled,
        starEmpty
    } = styles;

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

    const getRoomStats = (hotel) => {
        const totalRooms = hotel?.rooms?.reduce((total, room) => total + (room.quantity || 0), 0) || 0;
        const occupiedRooms = hotel?.rooms?.reduce((total, room) => total + (room.occupied || 0), 0) || 0;
        const availableRooms = totalRooms - occupiedRooms;
        
        return { totalRooms, occupiedRooms, availableRooms };
    };

    const getStatusBadge = (hotel) => {
        const { occupiedRooms, totalRooms } = getRoomStats(hotel);
        if (occupiedRooms === 0) return statusAvailable;
        if (occupiedRooms === totalRooms) return statusOccupied;
        return statusAvailable;
    };

    const getStatusText = (hotel) => {
        const { occupiedRooms, totalRooms } = getRoomStats(hotel);
        if (occupiedRooms === 0) return "Trống";
        if (occupiedRooms === totalRooms) return "Hết phòng";
        return "Còn phòng";
    };

    const renderStars = (rating) => {
        const stars = [];
        const starRating = rating / 10;
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} className={`${starIcon} ${i <= starRating ? starFilled : starEmpty}`}>
                    ★
                </span>
            );
        }
        return <div className={starRating}>{stars}</div>;
    };

    if (!hotel) return null;

    const roomStats = getRoomStats(hotel);

    return (
        <>
            {/* Ảnh chính */}
            <div className={imageSection}>
                <img
                    src={hotel?.images?.[0]?.url || '/default-hotel.jpg'}
                    alt={hotel.name}
                    className={hotelImage}
                    onError={(e) => {
                        e.target.src = '/default-hotel.jpg';
                    }}
                />
            </div>

            {/* Thông tin cơ bản */}
            <div className={infoSection}>
                <h3 className={sectionTitle}>Thông tin chung</h3>
                <div className={detailGrid}>
                    <div className={detailItem}>
                        <div className={detailLabel}>ID</div>
                        <div className={detailValue}>{hotel.id}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Tên khách sạn</div>
                        <div className={detailValue}>{hotel.name}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Tỉnh/Thành phố</div>
                        <div className={detailValue}>{hotel.province}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Địa điểm gần</div>
                        <div className={detailValue}>{hotel.name_nearby_place || 'N/A'}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Hạng sao</div>
                        <div className={detailValue}>
                            {renderStars(hotel.hotel_class)}
                            <span>({hotel.hotel_class / 10}/5)</span>
                        </div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Giá từ</div>
                        <div className={detailValue}>{formatCurrency(hotel.price)}</div>
                    </div>
                </div>
            </div>

            {/* Mô tả */}
            <div className={descriptionSection}>
                <h3 className={sectionTitle}>Mô tả</h3>
                <div className={descriptionText}>
                    {hotel.description || 'Không có mô tả'}
                </div>
            </div>

            {/* Thông tin chi tiết */}
            {hotel.text && (
                <div className={descriptionSection}>
                    <h3 className={sectionTitle}>Thông tin chi tiết</h3>
                    <div className={descriptionText}>
                        {hotel.text}
                    </div>
                </div>
            )}

            {/* Tiện nghi */}
            {hotel.amenities && (
                <div className={amenitiesSection}>
                    <h3 className={sectionTitle}>Tiện nghi</h3>
                    <div className={amenitiesGrid}>
                        {Array.isArray(hotel.amenities) 
                            ? hotel.amenities.map((amenity, index) => (
                                <div key={index} className={amenityItem}>
                                    {amenity}
                                </div>
                            ))
                            : JSON.parse(hotel.amenities || '[]').map((amenity, index) => (
                                <div key={index} className={amenityItem}>
                                    {amenity}
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            {/* Thống kê phòng */}
            <div className={roomStatsSection}>
                <h3 className={sectionTitle}>Thống kê phòng</h3>
                <div className={detailGrid}>
                    <div className={detailItem}>
                        <div className={detailLabel}>Tổng số phòng</div>
                        <div className={detailValue}>{roomStats.totalRooms}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Phòng trống</div>
                        <div className={detailValue}>{roomStats.availableRooms}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Phòng đã đặt</div>
                        <div className={detailValue}>{roomStats.occupiedRooms}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Trạng thái</div>
                        <div className={detailValue}>
                            <span className={`${statusBadge} ${getStatusBadge(hotel)}`}>
                                {getStatusText(hotel)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thời gian */}
            <div className={timestampSection}>
                <h3 className={sectionTitle}>Thời gian</h3>
                <div className={detailGrid}>
                    <div className={detailItem}>
                        <div className={detailLabel}>Ngày tạo</div>
                        <div className={timestampItem}>
                            {formatDate(hotel.created_at)}
                        </div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Cập nhật lần cuối</div>
                        <div className={timestampItem}>
                            {formatDate(hotel.updated_at)}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HotelSidebarContent;