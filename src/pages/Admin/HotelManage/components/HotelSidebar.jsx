import styles from '../HotelManage.module.css';
import { formatCurrency, formatDate, getRoomStats, getStarText, getStatusBadge, getStatusText } from '../helpers';

const HotelSidebar = ({
    isSidebarOpen,
    isEditMode,
    selectedHotel,
    editForm,
    newAmenity,
    setNewAmenity,
    handleCloseSidebar,
    handleInputChange,
    handleAddAmenity,
    handleRemoveAmenity,
    handleUpdate,
    handleCancelEdit,
    setIsEditMode,
    handleDelete
}) => {
    if (!isSidebarOpen || !selectedHotel) return null;

    const amenities = Array.isArray(selectedHotel?.amenities)
        ? selectedHotel.amenities
        : (() => {
            try {
                return JSON.parse(selectedHotel?.amenities || "[]");
            } catch (e) {
                return [];
            }
        })();

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
        <>
            <div
                className={styles.sidebarOverlay}
                onClick={handleCloseSidebar}
            />
            <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''} ${isEditMode ? styles.editMode : styles.viewMode}`}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>
                        {isEditMode ? 'Chỉnh sửa khách sạn' : 'Chi tiết khách sạn'}
                    </h2>
                    <button
                        className={styles.closeButton}
                        onClick={handleCloseSidebar}
                    >
                        ×
                    </button>
                </div>

                <div className={styles.sidebarContent}>
                    {isEditMode ? (
                        <div className={styles.formContainer}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Tên khách sạn *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleInputChange}
                                    className={styles.formControl}
                                    placeholder="Nhập tên khách sạn"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Tỉnh/Thành phố</label>
                                <input
                                    type="text"
                                    name="province"
                                    value={editForm.province}
                                    onChange={handleInputChange}
                                    className={styles.formControl}
                                    placeholder="Nhập tỉnh/thành phố"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Giá từ (VND) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={editForm.price}
                                    onChange={handleInputChange}
                                    className={styles.formControl}
                                    placeholder="Nhập giá"
                                    min="0"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Hạng sao (1-5) *</label>
                                <input
                                    type="number"
                                    name="hotel_class"
                                    value={editForm.hotel_class}
                                    onChange={handleInputChange}
                                    className={styles.formControl}
                                    placeholder="Nhập từ 1 đến 5"
                                    min="1"
                                    max="5"
                                    step="0.5"
                                />
                                <small style={{ color: '#666', fontSize: '12px' }}>
                                    Ví dụ: 3.5 = 3.5 sao, 4 = 4 sao
                                </small>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Địa điểm gần</label>
                                <input
                                    type="text"
                                    name="name_nearby_place"
                                    value={editForm.name_nearby_place}
                                    onChange={handleInputChange}
                                    className={styles.formControl}
                                    placeholder="Nhập địa điểm gần"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Mô tả ngắn</label>
                                <textarea
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleInputChange}
                                    className={styles.formTextarea}
                                    placeholder="Nhập mô tả ngắn"
                                    rows="3"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Mô tả chi tiết</label>
                                <textarea
                                    name="text"
                                    value={editForm.text}
                                    onChange={handleInputChange}
                                    className={styles.formTextarea}
                                    placeholder="Nhập mô tả chi tiết"
                                    rows="5"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Tiện nghi</label>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    <input
                                        type="text"
                                        value={newAmenity}
                                        onChange={(e) => setNewAmenity(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddAmenity();
                                            }
                                        }}
                                        className={styles.formControl}
                                        placeholder="Nhập tiện nghi rồi nhấn Enter hoặc click Thêm"
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddAmenity}
                                        className={styles.btnPrimary}
                                        style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}
                                    >
                                        Thêm
                                    </button>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    padding: '8px',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: '4px',
                                    minHeight: '40px'
                                }}>
                                    {editForm.amenities.length > 0 ? (
                                        editForm.amenities.map((amenity, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    backgroundColor: '#e3f2fd',
                                                    padding: '6px 12px',
                                                    borderRadius: '4px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                <span>{amenity}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveAmenity(index)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#d32f2f',
                                                        cursor: 'pointer',
                                                        fontSize: '16px',
                                                        padding: '0',
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                    title="Xóa"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <span style={{ color: '#999', fontSize: '14px' }}>
                                            Chưa có tiện nghi nào. Thêm tiện nghi ở trên.
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    onClick={handleCancelEdit}
                                    className={styles.btnSecondary}
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    className={styles.btnPrimary}
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.image2Container}>
                                <img
                                    src={selectedHotel?.firstimage?.url || '/default-hotel.jpg'}
                                    alt={selectedHotel.name}
                                    className={styles.hotelImage}
                                />
                            </div>

                            <div className={styles.detailSection}>
                                <h3 className={styles.detailTitle}>Thông tin chung</h3>
                                <div className={styles.detailGrid}>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>ID</div>
                                        <div className={styles.detailValue}>{selectedHotel.id}</div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>Tên khách sạn</div>
                                        <div className={styles.detailValue}>{selectedHotel.name}</div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>Tỉnh/Thành phố</div>
                                        <div className={styles.detailValue}>{selectedHotel.province}</div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>Địa điểm gần</div>
                                        <div className={styles.detailValue}>{selectedHotel.name_nearby_place}</div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>Hạng sao</div>
                                        <div className={styles.detailValue}>
                                            {renderStars(selectedHotel.hotel_class)}
                                            ({getStarText(selectedHotel.hotel_class)})
                                        </div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>Giá từ</div>
                                        <div className={styles.detailValue}>{formatCurrency(selectedHotel.price)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.detailSection}>
                                <h3 className={styles.detailTitle}>Mô tả ngắn</h3>
                                <div className={styles.textContent}>
                                    {selectedHotel.description}
                                </div>
                            </div>

                            <div className={styles.detailSection}>
                                <h3 className={styles.detailTitle}>Thông tin chi tiết</h3>
                                <div className={styles.textContent}>
                                    {selectedHotel.text}
                                </div>
                            </div>

                            {amenities.length > 0 && (
                                <div className={styles.detailSection}>
                                    <h3 className={styles.detailTitle}>Tiện nghi</h3>
                                    <div className={styles.amenitiesList}>
                                        {amenities.map((amenity, index) => (
                                            <div key={index} className={styles.amenityItem}>
                                                {amenity}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.detailSection}>
                                <h3 className={styles.detailTitle}>Thống kê phòng</h3>
                                <div className={styles.detailGrid}>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>Tổng số phòng</div>
                                        <div className={styles.detailValue}>30</div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>Phòng trống</div>
                                        <div className={styles.detailValue}>{getRoomStats(selectedHotel).totalRooms}</div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>Phòng đã đặt</div>
                                        <div className={styles.detailValue}>{30 - getRoomStats(selectedHotel).totalRooms}</div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>Trạng thái</div>
                                        <div className={styles.detailValue}>
                                            <span className={`${styles.statusBadge} ${getStatusBadge(selectedHotel, styles)}`}>
                                                {30 - getRoomStats(selectedHotel).totalRooms === 0 ? "Hết phòng" : getStatusText(selectedHotel)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.detailSection}>
                                <h3 className={styles.detailTitle}>Thời gian</h3>
                                <div className={styles.detailGrid}>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>Ngày tạo</div>
                                        <div className={styles.timestamp}>
                                            {formatDate(selectedHotel.created_at)}
                                        </div>
                                    </div>
                                    <div className={styles.detailItem}>
                                        <div className={styles.detailLabel}>Cập nhật lần cuối</div>
                                        <div className={styles.timestamp}>
                                            {formatDate(selectedHotel.updated_at)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formActions}>
                                <button
                                    onClick={() => setIsEditMode(true)}
                                    className={styles.btnPrimary}
                                >
                                    ✏️ Chỉnh sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedHotel.id)}
                                    className={styles.btnDanger}
                                >
                                    🗑️ Xóa khách sạn
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default HotelSidebar;
