import styles from '../../HotelManage.module.css';

const HotelEditForm = ({
    editForm,
    newAmenity,
    handleInputChange,
    handleAddAmenity,
    handleRemoveAmenity,
    handleCancelEdit,
    handleUpdate,
    setNewAmenity
}) => {
    const {
        formContainer,
        formGroup,
        formLabel,
        formControl,
        formTextarea,
        formActions,
        btnPrimary,
        btnSecondary
    } = styles;

    return (
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
    );
};

export default HotelEditForm;