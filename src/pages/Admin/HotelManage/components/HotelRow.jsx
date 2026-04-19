import styles from '../HotelManage.module.css';
import { formatCurrency, getStarText, getStatusBadge, getStatusText } from '../helpers';

const HotelRow = ({ hotel, handleView, handleEdit, handleDelete }) => {
    const renderStars = (hotelClass) => {
        let starRating;
        if (hotelClass >= 10) {
            starRating = hotelClass / 10;
        } else {
            starRating = hotelClass;
        }

        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= starRating ? '#ffc107' : '#e4e5e9' }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <tr className={styles.tr}>
            <td className={styles.td}>
                <div className={styles.hotelInfo}>
                    <div className={styles.imageContainer}>
                        <img
                            src={hotel?.firstimage?.url || '/default-hotel.jpg'}
                            alt={hotel.name}
                            className={styles.hotelImage}
                            onError={(e) => {
                                e.target.src = '/default-hotel.jpg';
                            }}
                        />
                    </div>
                    <div>
                        <div className={styles.hotelName}>{hotel?.name}</div>
                        <div className={styles.hotelLocation}>ID: {hotel.id}</div>
                    </div>
                </div>
            </td>
            <td className={styles.td}>
                <div className={styles.hotelLocation}>
                    <strong>{hotel?.province}</strong>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {hotel?.description?.substring(0, 50)}...
                    </div>
                </div>
            </td>
            <td className={styles.td}>
                <div className={styles.statsContainer}>
                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>Tổng phòng</div>
                        <div className={styles.statValue}>
                            30
                        </div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>Giá từ</div>
                        <div className={styles.statValue}>
                            {formatCurrency(hotel?.price)}
                        </div>
                    </div>
                </div>
            </td>
            <td className={styles.td}>
                <span className={`${styles.statusBadge} ${getStatusBadge(hotel, styles)}`}>
                    {getStatusText(hotel)}
                </span>
            </td>
            <td className={styles.td}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                        {renderStars(hotel?.hotel_class)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        {getStarText(hotel?.hotel_class)}
                    </div>
                </div>
            </td>
            <td className={styles.td}>
                <div className={styles.actionCell}>
                    <div className={styles.buttonGroup}>
                        <button
                            className={`${styles.actionButton} ${styles.viewButton}`}
                            onClick={() => handleView(hotel.id)}
                            title="Xem chi tiết"
                        >
                            <span className={styles.buttonIcon}>👁️</span>
                        </button>
                        <button
                            className={`${styles.actionButton} ${styles.editButton}`}
                            onClick={() => handleEdit(hotel.id)}
                            title="Chỉnh sửa"
                        >
                            <span className={styles.buttonIcon}>✏️</span>
                        </button>
                        <button
                            className={`${styles.actionButton} ${styles.deleteButton}`}
                            onClick={() => handleDelete(hotel.id)}
                            title="Xóa"
                        >
                            <span className={styles.buttonIcon}>🗑️</span>
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default HotelRow;
