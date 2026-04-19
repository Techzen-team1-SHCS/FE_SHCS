const EditBookingModal = ({
    styles,
    isOpen,
    booking,
    formData,
    onChange,
    onClose,
    onSave,
    isLoading
}) => {
    if (!isOpen || !booking) return null;

    const {
        modalBackdrop,
        modalContent,
        modalHeader,
        modalTitle,
        modalClose,
        modalBody,
        modalFooter,
        formGroup,
        formLabel,
        formInput,
        saveButton,
        cancelButton
    } = styles;

    return (
        <div className={modalBackdrop}>
            <div className={modalContent}>
                <div className={modalHeader}>
                    <h3 className={modalTitle}>
                        Chỉnh sửa đặt phòng #{booking.id}
                    </h3>
                    <button className={modalClose} onClick={onClose}>×</button>
                </div>

                <div className={modalBody}>
                    <div className={formGroup}>
                        <label className={formLabel}>Số phòng</label>
                        <input
                            type="number"
                            name="quantity"
                            className={formInput}
                            value={formData.quantity}
                            onChange={onChange}
                            min="1"
                        />
                    </div>

                    <div className={formGroup}>
                        <label className={formLabel}>Số người</label>
                        <input
                            type="number"
                            name="guests"
                            className={formInput}
                            value={formData.guests}
                            onChange={onChange}
                            min="1"
                        />
                    </div>

                    <div className={formGroup}>
                        <label className={formLabel}>Ngày check-in</label>
                        <input
                            type="datetime-local"
                            name="check_in"
                            className={formInput}
                            value={formData.check_in}
                            onChange={onChange}
                        />
                    </div>

                    <div className={formGroup}>
                        <label className={formLabel}>Ngày check-out</label>
                        <input
                            type="datetime-local"
                            name="check_out"
                            className={formInput}
                            value={formData.check_out}
                            onChange={onChange}
                        />
                    </div>

                    <div className={formGroup}>
                        <label className={formLabel}>Tổng tiền (VND)</label>
                        <input
                            type="number"
                            name="total_price"
                            className={formInput}
                            value={formData.total_price}
                            onChange={onChange}
                            min="0"
                        />
                    </div>
                </div>

                <div className={modalFooter}>
                    <button
                        className={cancelButton}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Hủy
                    </button>

                    <button
                        className={saveButton}
                        onClick={onSave}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditBookingModal;