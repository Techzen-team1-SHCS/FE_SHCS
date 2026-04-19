const BookingTable = ({
    styles,
    bookingData,
    user,
    formatDateTime,
    formatVND,
    getStatusClass,
    getPaymentClass,
    handleStatusChange,
    handlePaymentStatusChange,
    handleView,
    handleEdit,
    handleDelete,
    PAYMENT_STATUS_OPTIONS,
    BOOKING_STATUS_OPTIONS,
    isDeleting
}) => {
    const {
        tableContainer,
        table,
        tableHeader,
        th,
        tableBody,
        tr,
        td,
        statusSelect,
        actionCell,
        actionButton,
        viewButton,
        editButton,
        deleteButton,
        buttonGroup,
        buttonIcon
    } = styles;

    return (
        <div className={tableContainer}>
            <table className={table}>
                <thead className={tableHeader}>
                    <tr>
                        <th className={th}>ID</th>
                        <th className={th}>Tên Khách</th>
                        <th className={th}>Thông tin liên hệ</th>
                        <th className={th}>Số phòng</th>
                        <th className={th}>Số người</th>
                        <th className={th}>Check-In</th>
                        <th className={th}>Check-out</th>
                        <th className={th}>Trạng thái thanh toán</th>
                        <th className={th}>Trạng thái đặt phòng</th>
                        <th className={th}>Tổng tiền</th>
                        <th className={th}>Hành động</th>
                    </tr>
                </thead>

                <tbody className={tableBody}>
                    {bookingData.length > 0 ? (
                        bookingData.map((booking) => (
                            <tr key={booking.id} className={tr}>
                                <td className={td}>{booking?.id}</td>

                                <td className={td}>{user?.name || 'N/A'}</td>

                                <td className={td}>
                                    {user?.email || 'N/A'}<br />
                                    {user?.phone || 'N/A'}
                                </td>

                                <td className={td}>{booking?.quantity || 'N/A'}</td>

                                <td className={td}>
                                    {booking?.guests || booking?.room?.max_guest || 'N/A'}
                                </td>

                                <td className={td}>
                                    {formatDateTime(booking?.check_in || booking?.checkInDate)}
                                </td>

                                <td className={td}>
                                    {formatDateTime(booking?.check_out || booking?.checkOutDate)}
                                </td>

                                {/* Payment */}
                                <td className={td}>
                                    <select
                                        className={`${statusSelect} ${getPaymentClass(booking.payment_status)}`}
                                        value={booking.payment_status || 'bonding'}
                                        onChange={(e) =>
                                            handlePaymentStatusChange(booking.id, e.target.value)
                                        }
                                    >
                                        {PAYMENT_STATUS_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                {/* Status */}
                                <td className={td}>
                                    <select
                                        className={`${statusSelect} ${getStatusClass(booking.status)}`}
                                        value={booking.status || 'confirmed'}
                                        onChange={(e) =>
                                            handleStatusChange(booking.id, e.target.value)
                                        }
                                    >
                                        {BOOKING_STATUS_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                {/* Price */}
                                <td className={td}>
                                    {formatVND(booking?.total_price || booking?.totalPrice)}
                                </td>

                                {/* Actions */}
                                <td className={`${td} ${actionCell}`}>
                                    <div className={buttonGroup}>
                                        <button
                                            className={`${actionButton} ${viewButton}`}
                                            onClick={() => handleView(booking.id)}
                                            disabled={isDeleting}
                                        >
                                            <span className={buttonIcon}>👁️</span>
                                        </button>

                                        <button
                                            className={`${actionButton} ${editButton}`}
                                            onClick={() => handleEdit(booking.id)}
                                            disabled={isDeleting}
                                        >
                                            <span className={buttonIcon}>✏️</span>
                                        </button>

                                        <button
                                            className={`${actionButton} ${deleteButton}`}
                                            onClick={() => handleDelete(booking.id)}
                                            disabled={isDeleting}
                                        >
                                            <span className={buttonIcon}>🗑️</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className={tr}>
                            <td colSpan="11" className={td} style={{ textAlign: 'center' }}>
                                Không tìm thấy đặt phòng nào
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BookingTable;