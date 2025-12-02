import React, { useState, useEffect } from 'react';
import styles from './BookingInfo.module.css';
import { getAmenityImage } from '../../utils/amenityImage';
import PaymentButtonVnPay from '../Payment/PaymentButtonVnPay';

const BookingInfo = ({ hotelData, onBookingSubmit, currentStep, onBackToForm }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const {
        container,
        section,
        sectionTitle,
        serviceContainer,
        serviceItem,
        serviceImage,
        serviceName,
        divider,
        noServices,
        reviewSection,
        reviewInfo,
        reviewRow,
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
        infoValue
    } = styles;

    useEffect(() => {
        setIsSubmitted(currentStep === 2);
    }, [currentStep]);

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        telephone: '',
        address: '',
        city: '',
        request: '',
        arrival: '',
        coupon: ''
    });

    useEffect(() => {
        if (hotelData && hotelData.amenities) {
            try {
                const amenitiesArray = JSON.parse(hotelData.amenities);
                const servicesData = amenitiesArray.map((amenity, index) => ({
                    id: index + 1,
                    name: amenity,
                    image: getAmenityImage(amenity)
                }));
                setServices(servicesData);
            } catch (error) {
                console.error('Error parsing amenities:', error);
                setServices([]);
            } finally {
                setLoading(false);
            }
        } else {
            setServices([]);
            setLoading(false);
        }
    }, [hotelData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

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

    if (loading) {
        return (
            <div className={container}>
                <div className={noServices}>Loading services...</div>
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
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    className={serviceImage}
                                    onError={(e) => {
                                        e.target.src = '/assets/images/amenities/default.jpg';
                                    }}
                                />
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
                            <div className={infoValue}>{formData.coupon || 'Không sử dụng'}</div>
                        </div>
                    </div>

                    {/* Tax Information */}
                    <div className={taxSection}>
                        <h4 className={sectionTitle}>Thuế và phí:</h4>
                        <div className={taxItem}>• Đã bao gồm 3$ Thuế thành phố</div>
                        <div className={taxItem}>• Đã bao gồm 22% VAT</div>
                    </div>

                    <hr className={divider} />

                    {/* Payment Options */}
                    <div className={paymentSection}>
                        <h4 className={sectionTitle}>Phương thức thanh toán:</h4>
                        <PaymentButtonVnPay
                            bookingId={hotelData?.id}
                            amount={Number(hotelData?.total_price)}
                        />
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
                                <input
                                    className={formStyle}
                                    type="text"
                                    name="coupon"
                                    value={formData.coupon}
                                    onChange={handleInputChange}
                                    placeholder="Nhập mã giảm giá"
                                />
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