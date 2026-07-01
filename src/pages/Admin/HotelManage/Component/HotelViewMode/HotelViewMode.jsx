import styles from '../../HotelManage.module.css';
import StarRating from '../StarRating/StarRating';

const HotelViewMode = ({
    selectedHotel,
    amenities,
    setIsEditMode,
    handleDelete,
    formatCurrency,
    formatDate,
    getRoomStats,
    getStatusText,
    getStatusClass,
    getStarValue,
    getStarText
}) => {
    const {
        image2Container,
        hotelImage,

        detailSection,
        detailTitle,
        detailGrid,
        detailItem,
        detailLabel,
        detailValue,

        textContent,

        amenitiesList,
        amenityItem,

        statusBadge,
        timestamp,

        formActions,
        btnPrimary,
        btnDanger
    } = styles;

    // ✅ tránh gọi nhiều lần
    const roomStats = getRoomStats(selectedHotel);
    const TOTAL_ROOMS = 30;
    const bookedRooms = TOTAL_ROOMS - roomStats.totalRooms;

    return (
        <>
            {/* Ảnh chính */}
                            <div className={image2Container}>
                                <img
                                    src={selectedHotel?.firstimage?.url || '/default-hotel.jpg'}
                                    alt={selectedHotel.name}
                                    className={hotelImage}
                                />
                            </div>

                            {/* Thông tin cơ bản */}
                            <div className={detailSection}>
                                <h3 className={detailTitle}>Thông tin chung</h3>
                                <div className={detailGrid}>
                                    <div className={detailItem}>
                                        <div className={detailLabel}>ID</div>
                                        <div className={detailValue}>{selectedHotel.id}</div>
                                    </div>
                                    <div className={detailItem}>
                                        <div className={detailLabel}>Tên khách sạn</div>
                                        <div className={detailValue}>{selectedHotel.name}</div>
                                    </div>
                                    <div className={detailItem}>
                                        <div className={detailLabel}>Tỉnh/Thành phố</div>
                                        <div className={detailValue}>{selectedHotel.province}</div>
                                    </div>
                                    <div className={detailItem}>
                                        <div className={detailLabel}>Địa điểm gần</div>
                                        <div className={detailValue}>{selectedHotel.name_nearby_place}</div>
                                    </div>
                                    <div className={detailItem}>
                                        <div className={detailLabel}>Hạng sao</div>
                                        <div className={detailValue}>
                                            <StarRating value={getStarValue(selectedHotel.hotel_class)} />
                                            ({getStarText(selectedHotel.hotel_class)})
                                        </div>
                                    </div>
                                    <div className={detailItem}>
                                        <div className={detailLabel}>Giá từ</div>
                                        <div className={detailValue}>{formatCurrency(selectedHotel.price)}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Mô tả ngắn */}
                            <div className={detailSection}>
                                <h3 className={detailTitle}>Mô tả ngắn</h3>
                                <div className={textContent}>
                                    {selectedHotel.description}
                                </div>
                            </div>

                            {/* Mô tả chi tiết */}
                            <div className={detailSection}>
                                <h3 className={detailTitle}>Thông tin chi tiết</h3>
                                <div className={textContent}>
                                    {selectedHotel.text}
                                </div>
                            </div>

                            {/* Tiện nghi */}
                            {amenities.length > 0 && (
                                <div className={detailSection}>
                                    <h3 className={detailTitle}>Tiện nghi</h3>

                                    <div className={amenitiesList}>
                                        {amenities.map((amenity, index) => (
                                            <div key={index} className={amenityItem}>
                                                {amenity}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Thống kê phòng */}
                            <div className={detailSection}>
                                <h3 className={detailTitle}>Thống kê phòng</h3>
                                <div className={detailGrid}>
                                    <div className={detailItem}>
                                        <div className={detailLabel}>Tổng số phòng</div>
                                        <div className={detailValue}>30</div>
                                    </div>
                                    <div className={detailItem}>
                                        <div className={detailLabel}>Phòng trống</div>
                                        <div className={detailValue}>{getRoomStats(selectedHotel).totalRooms}</div>
                                    </div>
                                    <div className={detailItem}>
                                        <div className={detailLabel}>Phòng đã đặt</div>
                                        <div className={detailValue}>{30 - getRoomStats(selectedHotel).totalRooms}</div>
                                    </div>
                                    <div className={detailItem}>
                                        <div className={detailLabel}>Trạng thái</div>
                                        <div className={detailValue}>
                                            <span className={`${statusBadge} ${getStatusClass(selectedHotel)}`}>
                                                {30 - getRoomStats(selectedHotel).totalRooms === 0 ? "Hết phòng" : getStatusText(selectedHotel)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thời gian */}
                            <div className={detailSection}>
                                <h3 className={detailTitle}>Thời gian</h3>
                                <div className={detailGrid}>
                                    <div className={detailItem}>
                                        <div className={detailLabel}>Ngày tạo</div>
                                        <div className={timestamp}>
                                            {formatDate(selectedHotel.created_at)}
                                        </div>
                                    </div>
                                    <div className={detailItem}>
                                        <div className={detailLabel}>Cập nhật lần cuối</div>
                                        <div className={timestamp}>
                                            {formatDate(selectedHotel.updated_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Nút hành động trong view mode */}
                            <div className={formActions}>
                                <button
                                    onClick={() => setIsEditMode(true)}
                                    className={btnPrimary}
                                >
                                    ✏️ Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedHotel.id)}
                                    className={btnDanger}
                                >
                                    🗑️ Xóa khách sạn
                                </button>
                            </div>
        </>
    );
};


export default HotelViewMode;