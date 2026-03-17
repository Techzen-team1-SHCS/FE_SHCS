import styles from './BookingSidebarContent.module.css';

const BookingSidebarContent = ({ booking }) => {
    const {
        bookingHeader,
        bookingId,
        bookingTitle,
        userSection,
        userInfo,
        avatarContainer,
        avatarImage,
        avatarPlaceholder,
        userName,
        userContact,
        bookingDetails,
        sectionTitle,
        detailGrid,
        detailItem,
        detailLabel,
        detailValue,
        statusSection,
        statusBadge,
        statusConfirmed,
        statusCheckedIn,
        statusCompleted,
        statusCanceled,
        paymentBadge,
        paymentPaid,
        paymentBonding,
        paymentCanceled,
        paymentUnpaid,
        priceSection,
        priceBreakdown,
        priceItem,
        priceLabel,
        priceValue,
        totalPrice,
        notesSection,
        notesText,
        timestampSection,
        timestampItem
    } = styles;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        switch(status?.toLowerCase()) {
            case 'confirmed': return statusConfirmed;
            case 'checked-in': return statusCheckedIn;
            case 'completed': return statusCompleted;
            case 'canceled': return statusCanceled;
            default: return statusConfirmed;
        }
    };

    const getStatusText = (status) => {
        if (!status) return 'Đang xác nhận';
        const statusMap = {
            'confirmed': 'Đã xác nhận',
            'checked-in': 'Đã nhận phòng',
            'completed': 'Đã hoàn thành',
            'canceled': 'Đã hủy',
            'pending': 'Chờ xác nhận'
        };
        return statusMap[status.toLowerCase()] || status;
    };

    const getPaymentBadge = (paymentStatus) => {
        switch(paymentStatus?.toLowerCase()) {
            case 'paid': return paymentPaid;
            case 'bonding': return paymentBonding;
            case 'canceled': return paymentCanceled;
            case 'unpaid': return paymentUnpaid;
            default: return paymentBonding;
        }
    };

    const getPaymentText = (paymentStatus) => {
        if (!paymentStatus) return 'Chưa thanh toán';
        const paymentMap = {
            'paid': 'Đã thanh toán',
            'bonding': 'Đang xử lý',
            'canceled': 'Đã hủy',
            'unpaid': 'Chưa thanh toán',
            'pending': 'Chờ thanh toán'
        };
        return paymentMap[paymentStatus.toLowerCase()] || paymentStatus;
    };

    const calculateNights = (checkIn, checkOut) => {
        if (!checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleEdit = () => {
        console.log('Edit booking:', booking.id);
        // Xử lý chỉnh sửa
    };

    const handleCancel = () => {
        if (window.confirm('Bạn có chắc chắn muốn hủy đặt phòng này?')) {
            console.log('Cancel booking:', booking.id);
            // Xử lý hủy
        }
    };

    const handleConfirm = () => {
        if (window.confirm('Xác nhận đặt phòng này?')) {
            console.log('Confirm booking:', booking.id);
            // Xử lý xác nhận
        }
    };

    const handleCheckin = () => {
        if (window.confirm('Xác nhận khách đã nhận phòng?')) {
            console.log('Checkin booking:', booking.id);
            // Xử lý check-in
        }
    };

    const handleCheckout = () => {
        if (window.confirm('Xác nhận khách đã trả phòng?')) {
            console.log('Checkout booking:', booking.id);
            // Xử lý check-out
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (!booking) return null;

    const nights = calculateNights(booking.check_in, booking.check_out);
    const roomPrice = booking.total_price / (booking.quantity || 1) / (nights || 1);
    const cancelFee = booking.cancel_fee || 0;

    return (
        <div className={bookingDetails}>
            {/* Booking Header */}
            <div className={bookingHeader}>
                <h3 className={bookingTitle}>Đặt phòng #{booking.id}</h3>
                <div className={bookingId}>Mã đặt phòng: {booking.id}</div>
            </div>

            {/* User Information */}
            <div className={userSection}>
                <h4 className={sectionTitle}>Thông tin khách hàng</h4>
                <div className={userInfo}>
                    <div className={avatarContainer}>
                        {booking.user?.image ? (
                            <img
                                src={booking.user.image}
                                alt={booking.user.name}
                                className={avatarImage}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <div
                            className={avatarPlaceholder}
                            style={{ display: booking.user?.image ? 'none' : 'flex' }}
                        >
                            {getInitials(booking.user?.name)}
                        </div>
                    </div>
                    <div className={userName}>
                        <strong>{booking.user?.name || 'Khách hàng'}</strong>
                        <div className={userContact}>
                            {booking.user?.email || 'N/A'}
                            <br />
                            {booking.user?.phone || 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hotel Information */}

            {/* Booking Details */}
            <div className={bookingDetails}>
                <h4 className={sectionTitle}>Chi tiết đặt phòng</h4>
                <div className={detailGrid}>
                    <div className={detailItem}>
                        <div className={detailLabel}>Số phòng</div>
                        <div className={detailValue}>{booking.quantity || 1}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Số người</div>
                        <div className={detailValue}>{booking.guests || booking.room?.max_guest || 'N/A'}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Số đêm</div>
                        <div className={detailValue}>{nights} đêm</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Check-in</div>
                        <div className={detailValue}>{formatDate(booking.check_in)}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Check-out</div>
                        <div className={detailValue}>{formatDate(booking.check_out)}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Giá phòng/đêm</div>
                        <div className={detailValue}>{formatCurrency(roomPrice)}</div>
                    </div>
                </div>
            </div>

            {/* Status Section */}
            <div className={statusSection}>
                <h4 className={sectionTitle}>Trạng thái</h4>
                <div className={detailGrid}>
                    <div className={detailItem}>
                        <div className={detailLabel}>Trạng thái đặt phòng</div>
                        <div className={detailValue}>
                            <span className={`${statusBadge} ${getStatusBadge(booking.status)}`}>
                                {getStatusText(booking.status)}
                            </span>
                        </div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Trạng thái thanh toán</div>
                        <div className={detailValue}>
                            <span className={`${paymentBadge} ${getPaymentBadge(booking.payment_status)}`}>
                                {getPaymentText(booking.payment_status)}
                            </span>
                        </div>
                    </div>
                    {booking.cancel_free_days && (
                        <div className={detailItem}>
                            <div className={detailLabel}>Miễn phí hủy</div>
                            <div className={detailValue}>
                                Trong vòng {booking.cancel_free_days} ngày
                            </div>
                        </div>
                    )}
                    {cancelFee > 0 && (
                        <div className={detailItem}>
                            <div className={detailLabel}>Phí hủy</div>
                            <div className={detailValue}>{formatCurrency(cancelFee)}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Price Breakdown */}
            <div className={priceSection}>
                <h4 className={sectionTitle}>Chi tiết giá</h4>
                <div className={priceBreakdown}>
                    <div className={priceItem}>
                        <div className={priceLabel}>Giá phòng ({nights} đêm × {booking.quantity || 1} phòng)</div>
                        <div className={priceValue}>{formatCurrency(booking.total_price - cancelFee)}</div>
                    </div>
                    {cancelFee > 0 && (
                        <div className={priceItem}>
                            <div className={priceLabel}>Phí hủy</div>
                            <div className={priceValue}>+ {formatCurrency(cancelFee)}</div>
                        </div>
                    )}
                    <div className={priceItem}>
                        <div className={priceLabel}>Thuế & Phí dịch vụ</div>
                        <div className={priceValue}>Đã bao gồm</div>
                    </div>
                    <hr />
                    <div className={totalPrice}>
                        <div className={priceLabel}>Tổng cộng</div>
                        <div className={priceValue}>{formatCurrency(booking.total_price)}</div>
                    </div>
                </div>
            </div>

            {/* Pre-checkin Status */}
            {booking.pre_checkin_email_sent !== undefined && (
                <div className={notesSection}>
                    <h4 className={sectionTitle}>Email xác nhận</h4>
                    <div className={notesText}>
                        {booking.pre_checkin_email_sent 
                            ? '✅ Email xác nhận đã được gửi'
                            : '📧 Email xác nhận chưa được gửi'}
                    </div>
                </div>
            )}

            {/* Timestamps */}
            <div className={timestampSection}>
                <h4 className={sectionTitle}>Thời gian</h4>
                <div className={detailGrid}>
                    <div className={detailItem}>
                        <div className={detailLabel}>Ngày đặt</div>
                        <div className={timestampItem}>{formatDate(booking.created_at)}</div>
                    </div>
                    <div className={detailItem}>
                        <div className={detailLabel}>Cập nhật lần cuối</div>
                        <div className={timestampItem}>{formatDate(booking.updated_at)}</div>
                    </div>
                </div>
            </div>

            {/* Actions */}
        </div>
    );
};

export default BookingSidebarContent;