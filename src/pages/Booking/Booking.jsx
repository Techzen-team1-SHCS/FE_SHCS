import { useEffect, useState } from 'react'
import styles from "./Booking.module.css"
import BookingInfo from '../../components/BookingInfo/BookingInfo.jsx'
import { useParams } from 'react-router-dom'
import NavigationTabs from '../../components/NavigationTabs/NavigationTabs.jsx'
import { bookingService } from '../../services/bookingService.js'
import { toast } from 'react-toastify'
import { formatDateTime, getNights, getCancelPolicy } from "../../utils/dateUtils.js";
import Loader from '../../components/Loading/Loader.jsx'

const Booking = () => {
    const { bookingId } = useParams();

    // STATE GIÁ - KHỞI TẠO ĐÚNG
    const [bookingPrice, setBookingPrice] = useState({
        finalPrice: 0,
        discountAmount: 0,
        originalPrice: 0,
        isDiscountApplied: false // Thêm flag để track
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [hotelData, setHotelData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Nhận giá từ BookingInfo
    const handlePriceChange = (priceData) => {
        console.log('Price updated in Booking.jsx:', priceData);
        setBookingPrice({
            ...priceData,
            isDiscountApplied: priceData.discountAmount > 0
        });
    };

    const handleBookingSubmit = (formData) => {
        console.log('Booking data submitted:', formData);
        setCurrentStep(2);
    };

    const handleBackToForm = () => {
        setCurrentStep(1);
    };

    useEffect(() => {
        const fetchHotelData = async () => {
            setLoading(true)
            try {
                const response = await bookingService.getBooking(bookingId);
                setHotelData(response.data);

                // KHỞI TẠO STATE VỚI GIÁ GỐC
                setBookingPrice({
                    originalPrice: Number(response.data.total_price),
                    finalPrice: Number(response.data.total_price),
                    discountAmount: 0,
                    isDiscountApplied: false
                });

            } catch (err) {
                toast.error('Lỗi khi tải dữ liệu đặt phòng');
            } finally {
                setLoading(false)
            }
        };

        fetchHotelData();
    }, [bookingId]);

    if (loading) {
        return (
            <div className='page-wrapper'>
                <div className={styles.loading}><Loader/></div>
            </div>
        );
    }

    const bookingArray = [hotelData];

    return (
        <div className='page-wrapper'>
            {bookingArray.map((hotel) => {
                const cancelPolicy = getCancelPolicy(hotel);
                
                // TÍNH TOÁN HIỂN THỊ ĐÚNG
                const displayPrice = bookingPrice.finalPrice || bookingPrice.originalPrice;
                const hasDiscount = bookingPrice.discountAmount > 0;

                return (
                    <div key={hotel.id}>
                        {/* Banner */}
                        <section
                            className="page-banner-area pt-50 pb-35 rel z-1 bgs-cover"
                            style={{ backgroundImage: `url(${hotel?.room?.hotel?.images?.[0]?.url})` }}
                        >
                            <div className="container">
                                <div className="banner-inner text-white mb-50">
                                    <h2 className="page-title mb-10" style={{ zIndex: 10 }}>Booking</h2>
                                </div>
                            </div>
                        </section>

                        {/* Tabs */}
                        <NavigationTabs hotelId={bookingId} currentStep={currentStep} />

                        <div className={styles.bookingContainer}>
                            {/* LEFT SIDE */}
                            <div className={styles.bookingLeft}>
                                <img
                                    className={styles.bookingHotelImage}
                                    src={hotel?.room?.hotel?.images?.[1]?.url}
                                    alt={hotelData.name}
                                />

                                <div className={styles.bookingDatePicker}>

                                    {/* Chi tiết đặt phòng */}
                                    <div className={styles.card}>
                                        <h4 className={styles.cardTitle}>Chi tiết đặt phòng của bạn</h4>

                                        <div className={styles.row}>
                                            <span className={styles.weight}>Nhận phòng:</span>
                                            <span>{formatDateTime(hotel.check_in)}</span>
                                        </div>

                                        <div className={styles.row}>
                                            <span className={styles.weight}>Trả phòng:</span>
                                            <span>{formatDateTime(hotel.check_out)}</span>
                                        </div>

                                        <div className={styles.row}>
                                            <span className={styles.weight}>Tổng thời gian lưu trú:</span>
                                            <span>{getNights(hotel.check_in, hotel.check_out)} đêm</span>
                                        </div>
                                    </div>

                                    {/* Tóm tắt giá - FIXED */}
                                    <div className={styles.card}>
                                        <h4 className={styles.cardTitle}>Tóm tắt giá</h4>

                                        <div className={styles.roomType}>{hotel?.room?.room_type}</div>

                                        {/* HIỂN THỊ GIÁ GỐC */}
                                        <div className={styles.originalPrice} style={{ 
                                            textDecoration: hasDiscount ? 'line-through' : 'none',
                                            color: hasDiscount ? '#999' : '#333',
                                            fontSize: hasDiscount ? '14px' : '20px'
                                        }}>
                                            Giá gốc: {Number(bookingPrice.originalPrice).toLocaleString('vi-VN')} VND
                                        </div>

                                        {/* HIỂN THỊ GIÁ SAU GIẢM */}
                                        {hasDiscount ? (
                                            <>
                                                <div className={styles.discountInfo} style={{ 
                                                    color: '#ff6b6b', 
                                                    fontSize: '14px', 
                                                    marginTop: '8px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    Giảm giá: -{Number(bookingPrice.discountAmount).toLocaleString('vi-VN')} VND
                                                </div>

                                                <div className={styles.finalPrice} style={{ 
                                                    color: '#51cf66', 
                                                    fontSize: '20px', 
                                                    marginTop: '8px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    Tổng cuối: {Number(displayPrice).toLocaleString('vi-VN')} VND
                                                </div>
                                            </>
                                        ) : (
                                            <div className={styles.price} style={{ 
                                                fontSize: '20px', 
                                                marginTop: '8px',
                                                fontWeight: 'bold',
                                                color: '#333'
                                            }}>
                                                {Number(displayPrice).toLocaleString('vi-VN')} VND
                                            </div>
                                        )}

                                        <div className={styles.note}>Đã bao gồm thuế và phí</div>
                                    </div>

                                    {/* Chính sách huỷ */}
                                    <div className={styles.card}>
                                        <h4 className={styles.cardTitle}>Chi phí huỷ là bao nhiêu?</h4>

                                        {cancelPolicy.hasFreeCancel ? (
                                            <>
                                                <div className={styles.cancelFree}>
                                                    Miễn phí huỷ đến{" "}
                                                    <strong>{formatDateTime(cancelPolicy.freeCancelDeadline)}</strong>
                                                </div>

                                                <div className={styles.cancelFee}>
                                                    Sau thời điểm đó:{" "}
                                                    <strong>{cancelPolicy.cancelFee.toLocaleString("vi-VN")} VND</strong>
                                                </div>
                                            </>
                                        ) : (
                                            <div className={styles.cancelFee}>
                                                <span>{cancelPolicy.message}</span>
                                                <br />
                                                <strong>Phí huỷ: {cancelPolicy.cancelFee.toLocaleString("vi-VN")} VND</strong>
                                            </div>
                                        )}
                                    </div>

                                    {/* Điều kiện */}
                                    <div className={styles.card}>
                                        <h4 className={styles.cardTitle}>Xem lại điều kiện đặt phòng</h4>
                                        <div className={styles.subTitle}>Ưu Đãi Từ Đối Tác</div>

                                        <ul className={styles.list}>
                                            <li>Bạn sẽ thanh toán bảo mật hôm nay với SHCS.com</li>
                                            <li>Các thay đổi liên quan đến thông tin cá nhân hay thông tin đặt phòng đều không khả thi sau khi đặt phòng đã hoàn tất</li>
                                            <li>Công ty đối tác của chúng tôi sẽ là bên xuất hoá đơn</li>
                                        </ul>
                                    </div>

                                </div>
                            </div>

                            {/* RIGHT SIDE */}
                            <div className={styles.bookingRight}>
                                <BookingInfo
                                    hotelData={hotelData}
                                    onBookingSubmit={handleBookingSubmit}
                                    currentStep={currentStep}
                                    onBackToForm={handleBackToForm}
                                    onPriceChange={handlePriceChange}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Booking;