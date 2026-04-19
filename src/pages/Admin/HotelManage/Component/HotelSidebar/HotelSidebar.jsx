const HotelSidebar = ({
    // state
    isSidebarOpen,
    isEditMode,
    selectedHotel,
    amenities,
    editForm,
    newAmenity,

    // handlers
    handleCloseSidebar,
    handleInputChange,
    handleAddAmenity,
    handleRemoveAmenity,
    handleCancelEdit,
    handleUpdate,
    handleDelete,
    setNewAmenity,
    setIsEditMode,

    // utils
    formatCurrency,
    formatDate,
    getRoomStats,
    getStatusText,
    getStatusClass,
    getStarValue,
    getStarText,

    // components
    StarRating,

    // styles
    sidebar,
    sidebarOpen,
    editMode,
    viewMode,
    sidebarHeader,
    sidebarTitle,
    closeButton,
    sidebarContent,
    formContainer,
    formGroup,
    formLabel,
    formControl,
    formTextarea,
    formActions,
    btnPrimary,
    btnSecondary,
    btnDanger,
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
    timestamp
}) => {
    if (!isSidebarOpen || !selectedHotel) return null;

    return (
        <>
            <div className={`${sidebar} ${isSidebarOpen ? sidebarOpen : ''} ${isEditMode ? editMode : viewMode}`}>
                        <div className={sidebarHeader}>
                            <h2 className={sidebarTitle}>
                                {isEditMode ? 'Chỉnh sửa khách sạn' : 'Chi tiết khách sạn'}
                            </h2>
                            <button
                                className={closeButton}
                                onClick={handleCloseSidebar}
                            >
                                ×
                            </button>
                        </div>

                        <div className={sidebarContent}>
                            {isEditMode ? (
                                // FORM CHỈNH SỬA
                                <div className={formContainer}>
                                    <div className={formGroup}>
                                        <label className={formLabel}>Tên khách sạn *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editForm.name}
                                            onChange={handleInputChange}
                                            className={formControl}
                                            placeholder="Nhập tên khách sạn"
                                        />
                                    </div>

                                    <div className={formGroup}>
                                        <label className={formLabel}>Tỉnh/Thành phố</label>
                                        <input
                                            type="text"
                                            name="province"
                                            value={editForm.province}
                                            onChange={handleInputChange}
                                            className={formControl}
                                            placeholder="Nhập tỉnh/thành phố"
                                        />
                                    </div>

                                    <div className={formGroup}>
                                        <label className={formLabel}>Giá từ (VND) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={editForm.price}
                                            onChange={handleInputChange}
                                            className={formControl}
                                            placeholder="Nhập giá"
                                            min="0"
                                        />
                                    </div>

                                    <div className={formGroup}>
                                        <label className={formLabel}>Hạng sao (1-5) *</label>
                                        <input
                                            type="number"
                                            name="hotel_class"
                                            value={editForm.hotel_class}
                                            onChange={handleInputChange}
                                            className={formControl}
                                            placeholder="Nhập từ 1 đến 5"
                                            min="1"
                                            max="5"
                                            step="0.5"
                                        />
                                        <small style={{ color: '#666', fontSize: '12px' }}>
                                            Ví dụ: 3.5 = 3.5 sao, 4 = 4 sao
                                        </small>
                                    </div>

                                    <div className={formGroup}>
                                        <label className={formLabel}>Địa điểm gần</label>
                                        <input
                                            type="text"
                                            name="name_nearby_place"
                                            value={editForm.name_nearby_place}
                                            onChange={handleInputChange}
                                            className={formControl}
                                            placeholder="Nhập địa điểm gần"
                                        />
                                    </div>

                                    <div className={formGroup}>
                                        <label className={formLabel}>Mô tả ngắn</label>
                                        <textarea
                                            name="description"
                                            value={editForm.description}
                                            onChange={handleInputChange}
                                            className={formTextarea}
                                            placeholder="Nhập mô tả ngắn"
                                            rows="3"
                                        />
                                    </div>

                                    <div className={formGroup}>
                                        <label className={formLabel}>Mô tả chi tiết</label>
                                        <textarea
                                            name="text"
                                            value={editForm.text}
                                            onChange={handleInputChange}
                                            className={formTextarea}
                                            placeholder="Nhập mô tả chi tiết"
                                            rows="5"
                                        />
                                    </div>

                                    <div className={formGroup}>
                                        <label className={formLabel}>Tiện nghi</label>
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
                                                className={formControl}
                                                placeholder="Nhập tiện nghi rồi nhấn Enter hoặc click Thêm"
                                                style={{ flex: 1 }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddAmenity}
                                                className={btnPrimary}
                                                style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}
                                            >
                                                Thêm
                                            </button>
                                        </div>

                                        {/* Danh sách tiện nghi */}
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

                                    <div className={formActions}>
                                        <button
                                            onClick={handleCancelEdit}
                                            className={btnSecondary}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={handleUpdate}
                                            className={btnPrimary}
                                        >
                                            Lưu thay đổi
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // XEM CHI TIẾT
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
                            )}
                        </div>
                    </div>
        </>
    );
};

export default HotelSidebar;