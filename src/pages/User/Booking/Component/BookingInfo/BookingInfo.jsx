import { useState } from 'react';
import styles from './BookingInfo.module.css';
import PaymentButtonVnPay from '../../../../../components/Payment/PaymentButtonVnPay';
import PartLoading from '../../../../../components/Loading/PartLoading';
import { useAmenities } from '../../Hooks/useAmenities';
import { useBookingForm } from '../../Hooks/useBookingForm';
import { useDiscount } from '../../Hooks/useDiscount';
const BookingInfo = ({ hotelData, onBookingSubmit, onBackToForm, onPriceChange }) => {
    const { services, loading } = useAmenities(hotelData);

    const { formData, handleInputChange } =
        useBookingForm(hotelData?.discount_code);

    const {
        finalPrice,
        discountAmount,
        appliedCoupon,
        discountError,
        isApplying,
        applyDiscount
    } = useDiscount(hotelData, onPriceChange);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const {
        container,
        section,
        sectionTitle,
        serviceContainer,
        serviceItem,
        serviceName,
        divider,
        noServices,
        reviewSection,
        taxSection,
        taxItem,
        paymentSection,
        buttonGroup,
        formSection,
        formRow,
        formGroup,
        formStyle,
        required,
        inputGroup,
        label,
        textArea,
        editButton,
        submitButton,
        infoGrid,
        infoItem,
        infoLabel,
        infoValue,
        priceSummary,
        originalPrice,
        discountText,
        finalPriceText,
        paymentAmount,
        discountSuccess
    } = styles;
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        if (onBookingSubmit) {
            onBookingSubmit(formData);
        }
    };

    const handleEdit = () => {
        setIsSubmitted(false);
        if (onBackToForm) {
            onBackToForm();
        }
    };

    // FIX: Tính toán giá hiển thị
    const displayOriginalPrice = Number(hotelData?.total_price || 0);
    const displayDiscountAmount = Number(discountAmount || 0);
    const displayFinalPrice = Number(finalPrice || displayOriginalPrice);

    if (loading) {
        return (
            <div className={container}>
                <div className={noServices}><PartLoading /></div>
            </div>
        );
    }

    return (
        <div className={container}>
            {/* Extra Services Section */}
            <div className={section}>
                <h3 className={sectionTitle}>Dịch vụ khách sạn</h3>
                <div className={serviceContainer}>
                    {services.length === 0 ? (
                        <div className={noServices}>
                            Không có dịch vụ nào
                        </div>
                    ) : (
                        services.map(service => (
                            <div key={service.id} className={serviceItem}>
                                <span className={serviceName}>{service.name}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <hr className={divider} />

            {/* Review Section */}
            {isSubmitted ? (
                <div className={reviewSection}>
                    <h3 className={sectionTitle}>Thông tin đặt phòng</h3>

                    <div className={infoGrid}>
                        <div className={infoItem}>
                            <div className={infoLabel}>Họ</div>
                            <div className={infoValue}>{formData.surname || 'Chưa nhập'}</div>
                        </div>
                        <div className={infoItem}>
                            <div className={infoLabel}>Tên</div>
                            <div className={infoValue}>{formData.name || 'Chưa nhập'}</div>
                        </div>
                        <div className={infoItem}>
                            <div className={infoLabel}>Email</div>
                            <div className={infoValue}>{formData.email || 'Chưa nhập'}</div>
                        </div>
                        <div className={infoItem}>
                            <div className={infoLabel}>Số điện thoại</div>
                            <div className={infoValue}>{formData.telephone || 'Chưa nhập'}</div>
                        </div>
                        <div className={infoItem}>
                            <div className={infoLabel}>Địa chỉ</div>
                            <div className={infoValue}>{formData.address || 'Chưa nhập'}</div>
                        </div>
                        <div className={infoItem}>
                            <div className={infoLabel}>Thành phố</div>
                            <div className={infoValue}>{formData.city || 'Chưa nhập'}</div>
                        </div>
                        <div className={infoItem}>
                            <div className={infoLabel}>Thời gian đến</div>
                            <div className={infoValue}>{formData.arrival || 'Chưa nhập'}</div>
                        </div>
                        <div className={infoItem}>
                            <div className={infoLabel}>Yêu cầu đặc biệt</div>
                            <div className={infoValue}>{formData.request || 'Không có'}</div>
                        </div>
                        <div className={infoItem}>
                            <div className={infoLabel}>Mã giảm giá</div>
                            <div className={infoValue}>
                                {appliedCoupon || formData.coupon || 'Không sử dụng'}
                                {appliedCoupon && (
                                    <span style={{
                                        color: '#51cf66',
                                        marginLeft: '8px',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        ✓ Đã áp dụng
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tax Information with Price Summary */}
                    <div className={taxSection}>
                        <h4 className={sectionTitle}>Chi tiết thanh toán:</h4>

                        <div className={priceSummary}>
                            {/* Giá gốc */}
                            <div className={originalPrice}>
                                <span>Giá gốc:</span>
                                <span>{displayOriginalPrice.toLocaleString('vi-VN')} VND</span>
                            </div>

                            {/* Thuế */}
                            <div className={taxItem}>
                                <span>Thuế thành phố:</span>
                                <span>Đã bao gồm 3$</span>
                            </div>
                            <div className={taxItem}>
                                <span>VAT:</span>
                                <span>Đã bao gồm 22%</span>
                            </div>

                            {/* Giảm giá nếu có */}
                            {displayDiscountAmount > 0 && (
                                <div className={discountText}>
                                    <span>Giảm giá ({appliedCoupon}):</span>
                                    <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                                        -{displayDiscountAmount.toLocaleString('vi-VN')} VND
                                    </span>
                                </div>
                            )}

                            {/* Tổng cuối */}
                            <div className={finalPriceText}>
                                <span>Tổng thanh toán:</span>
                                <span style={{ color: '#51cf66', fontWeight: 'bold', fontSize: '18px' }}>
                                    {displayFinalPrice.toLocaleString('vi-VN')} VND
                                </span>
                            </div>
                        </div>
                    </div>

                    <hr className={divider} />

                    {/* Payment Options */}
                    <div className={paymentSection}>
                        <h4 className={sectionTitle}>Phương thức thanh toán:</h4>

                        {/* Hiển thị số tiền cần thanh toán */}
                        <div className={paymentAmount}>
                            <span style={{ fontSize: '14px', opacity: 0.9 }}>Số tiền thanh toán:</span>
                            <div style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                marginTop: '5px'
                            }}>
                                {displayFinalPrice.toLocaleString('vi-VN')} VND
                            </div>
                        </div>

                        <PaymentButtonVnPay
                            bookingId={hotelData?.id}
                            amount={displayFinalPrice} // FIX: Truyền giá đã giảm
                        />

                        {displayDiscountAmount > 0 && (
                            <div className={discountSuccess}>
                                <span style={{ color: '#51cf66', fontSize: '18px' }}>✓</span>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>Áp dụng mã giảm giá thành công!</div>
                                    <div style={{ fontSize: '13px', marginTop: '4px' }}>
                                        Bạn đã tiết kiệm được {displayDiscountAmount.toLocaleString('vi-VN')} VND với mã &quot;{appliedCoupon}&quot;
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={buttonGroup}>
                        <button
                            className={editButton}
                            onClick={handleEdit}
                        >
                            Chỉnh sửa thông tin
                        </button>
                    </div>
                </div>
            ) : (
                /* Form Section */
                <form className={formSection} onSubmit={handleSubmit}>
                    <h3 className={sectionTitle}>Thông tin liên hệ</h3>

                    <div className={formRow}>
                        <div className={formGroup}>
                            <label className={`${label} ${required}`}>Họ</label>
                            <div className={inputGroup}>
                                <input
                                    className={formStyle}
                                    type="text"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Nhập họ của bạn"
                                />
                            </div>
                        </div>

                        <div className={formGroup}>
                            <label className={`${label} ${required}`}>Tên</label>
                            <div className={inputGroup}>
                                <input
                                    className={formStyle}
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Nhập tên của bạn"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={formRow}>
                        <div className={formGroup}>
                            <label className={`${label} ${required}`}>Email</label>
                            <div className={inputGroup}>
                                <input
                                    className={formStyle}
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="example@email.com"
                                />
                            </div>
                        </div>

                        <div className={formGroup}>
                            <label className={`${label} ${required}`}>Số điện thoại</label>
                            <div className={inputGroup}>
                                <input
                                    className={formStyle}
                                    type="tel"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="0912345678"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={formRow}>
                        <div className={formGroup}>
                            <label className={label}>Địa chỉ</label>
                            <div className={inputGroup}>
                                <input
                                    className={formStyle}
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Số nhà, đường, phường..."
                                />
                            </div>
                        </div>
                        <div className={formGroup}>
                            <label className={label}>Thành phố</label>
                            <div className={inputGroup}>
                                <input
                                    className={formStyle}
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Hà Nội, TP.HCM,..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className={formRow}>
                        <div className={formGroup}>
                            <label className={label}>Thời gian đến</label>
                            <div className={inputGroup}>
                                <input
                                    className={formStyle}
                                    type="datetime-local"
                                    name="arrival"
                                    value={formData.arrival}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className={formGroup}>
                            <label className={label}>Mã giảm giá</label>
                            <div className={inputGroup}>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <input
                                        className={formStyle}
                                        type="text"
                                        name="coupon"
                                        value={formData.coupon}
                                        onChange={handleInputChange}
                                        placeholder="Nhập mã giảm giá"
                                        style={{ flex: 1 }}
                                    />

                                    <button
                                        type="button"
                                        onClick={applyDiscount}
                                        disabled={isApplying}
                                        style={{
                                            padding: "10px 20px",
                                            background: "#007bff",
                                            color: "#fff",
                                            borderRadius: "6px",
                                            border: "none",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        {isApplying ? "Đang áp dụng..." : "Áp dụng"}
                                    </button>
                                </div>

                                {/* Thông báo lỗi */}
                                {discountError && (
                                    <div style={{
                                        color: 'red',
                                        fontSize: '12px',
                                        marginTop: '4px',
                                        padding: '5px',
                                        background: '#ffeaea',
                                        borderRadius: '4px'
                                    }}>
                                        {discountError}
                                    </div>
                                )}

                                {/* Thông báo thành công */}
                                {appliedCoupon && displayDiscountAmount > 0 && (
                                    <div style={{
                                        color: '#51cf66',
                                        fontSize: '13px',
                                        marginTop: '4px',
                                        padding: '8px',
                                        background: '#ebfbee',
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        border: '1px solid #51cf66'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '16px' }}>✓</span>
                                            <div>
                                                <div>Đã áp dụng mã &quot;{appliedCoupon}&quot;</div>
                                                <div style={{ fontSize: '12px', marginTop: '2px' }}>
                                                    Giảm {displayDiscountAmount.toLocaleString('vi-VN')} VND
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Hiển thị tổng giá */}
                                <div style={{
                                    marginTop: '10px',
                                    padding: '10px',
                                    background: '#f8f9fa',
                                    borderRadius: '6px',
                                    fontSize: '14px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Giá gốc:</span>
                                        <span>{displayOriginalPrice.toLocaleString('vi-VN')} VND</span>
                                    </div>
                                    {displayDiscountAmount > 0 && (
                                        <>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginTop: '5px',
                                                color: '#ff6b6b'
                                            }}>
                                                <span>Giảm giá:</span>
                                                <span>-{displayDiscountAmount.toLocaleString('vi-VN')} VND</span>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginTop: '5px',
                                                fontWeight: 'bold',
                                                color: '#51cf66'
                                            }}>
                                                <span>Tổng cần thanh toán:</span>
                                                <span>{displayFinalPrice.toLocaleString('vi-VN')} VND</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={formRow}>
                        <div className={formGroup} style={{ flex: '1 0 100%' }}>
                            <label className={label}>Yêu cầu đặc biệt</label>
                            <div className={inputGroup}>
                                <textarea
                                    className={`${formStyle} ${textArea}`}
                                    placeholder="Nhập yêu cầu đặc biệt của bạn (nếu có)..."
                                    name="request"
                                    value={formData.request}
                                    onChange={handleInputChange}
                                    rows="3"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className={buttonGroup}>
                        <button
                            type="submit"
                            className={submitButton}
                        >
                            Tiếp theo
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default BookingInfo;