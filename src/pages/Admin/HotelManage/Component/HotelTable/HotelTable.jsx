import StarRating from "../StarRating/StarRating";

const HotelTable = ({
    hotelsData,
    loading,
    styles,
    handleView,
    handleEdit,
    handleDelete,
    getStatusClass,
    getStatusText,
    getStarValue,
    getStarText,
    formatCurrency
}) => {
    const {
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
        hotelImage,
        imageContainer,
        hotelInfo,
        hotelName,
        hotelLocation,
        statsContainer,
        statItem,
        statValue,
        statLabel
    } = styles;

    return (
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
                {hotelsData.length > 0 ? (
                    hotelsData.map((hotel) => (
                        <tr key={hotel.id} className={tr}>
                            <td className={td}>
                                <div className={hotelInfo}>
                                    <div className={imageContainer}>
                                        <img
                                            src={hotel?.firstimage?.url || '/default-hotel.jpg'}
                                            alt={hotel.name}
                                            className={hotelImage}
                                            onError={(e) => (e.target.src = '/default-hotel.jpg')}
                                        />
                                    </div>
                                    <div>
                                        <div className={hotelName}>{hotel?.name}</div>
                                        <div className={hotelLocation}>ID: {hotel.id}</div>
                                    </div>
                                </div>
                            </td>

                            <td className={td}>
                                <strong>{hotel?.province}</strong>
                                <div style={{ fontSize: 12, color: '#666' }}>
                                    {hotel?.description?.substring(0, 50)}...
                                </div>
                            </td>

                            <td className={td}>
                                <div className={statsContainer}>
                                    <div className={statItem}>
                                        <div className={statLabel}>Tổng phòng</div>
                                        <div className={statValue}>30</div>
                                    </div>
                                    <div className={statItem}>
                                        <div className={statLabel}>Giá từ</div>
                                        <div className={statValue}>
                                            {formatCurrency(hotel?.price)}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <td className={td}>
                                <span className={`${statusBadge} ${getStatusClass(hotel)}`}>
                                    {getStatusText(hotel)}
                                </span>
                            </td>

                            <td className={td}>
                                <div style={{ textAlign: 'center' }}>
                                    <div>
                                        <StarRating value={getStarValue(hotel.hotel_class)} />
                                    </div>
                                    <div style={{ fontSize: 12, color: '#666' }}>
                                        {getStarText(hotel.hotel_class)}
                                    </div>
                                </div>
                            </td>

                            <td className={td}>
                                <div className={actionCell}>
                                    <div className={buttonGroup}>
                                        <button
                                            className={`${actionButton} ${viewButton}`}
                                            onClick={() => handleView(hotel.id)}
                                        >👁️</button>

                                        <button
                                            className={`${actionButton} ${editButton}`}
                                            onClick={() => handleEdit(hotel.id)}
                                        >✏️</button>

                                        <button
                                            className={`${actionButton} ${deleteButton}`}
                                            onClick={() => handleDelete(hotel.id)}
                                        >🗑️</button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: 20 }}>
                            Không có khách sạn nào
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default HotelTable;