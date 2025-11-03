import React, { useEffect, useState } from 'react'
import styles from "./Booking.module.css"
import BookingInfo from '../../components/BookingInfo/BookingInfo.jsx'
import {  useParams } from 'react-router-dom'
import NavigationTabs from '../../components/NavigationTabs/NavigationTabs.jsx'
import { bookingService } from '../../services/bookingService.js'
import { toast } from 'react-toastify'
import { formatDateTime, getNights,getFreeCancelDeadline,calculateCancelFee,getCancelPolicy  } from "../../utils/dateUtils.js";

const Booking = () => {
    const {bookingId}=useParams();
    const [totalPrice, setTotalPrice] = useState(0);
    const [currentStep, setCurrentStep] = useState(1);
    const [hotelData, setHotelData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
   
    const handleTotalPriceChange = (price) => {
        setTotalPrice(price);
    };
    const handleBookingSubmit = (formData) => {
        console.log('Booking data submitted:', formData);
        setCurrentStep(2); // CHUYỂN SANG BƯỚC 3
    };
    // Hàm quay lại bước nhập thông tin - THÊM HÀM NÀY
    const handleBackToForm = () => {
        setCurrentStep(1); // QUAY LẠI BƯỚC 2
    };
    
    useEffect(() => {
        const fetchHotelData = async () => {
            setLoading(true)
            try {
                // Gọi API thực tế
                const response = await bookingService.getBooking(bookingId);
                setHotelData(response.data);
                setError(null)
            } catch (err) {
                toast.error('lỗi chi tiết ')
            } finally {
                setLoading(false)
            }
        }

        fetchHotelData()
    }, [bookingId])
    if (loading) {
        return (
            <div className='page-wrapper'>
                <div className={styles.loading}>Loading hotel data...</div>
            </div>
        )
    }
    const bookingArray=[hotelData];
    return (
        <div className='page-wrapper'>
            {bookingArray.map((hotel)=>{
                const cancelPolicy = getCancelPolicy(hotel);
                return(
                    <div key={hotel.id}>
                        <section
                            className="page-banner-area pt-50 pb-35 rel z-1 bgs-cover"
                            style={{ backgroundImage: `url(${hotel.room.hotel.images?.[0]?.url})` }}
                        >
                        <div className="container">
                            <div className="banner-inner text-white mb-50">
                                <h2 className="page-title mb-10" style={{ zIndex: 10 }}>Booking</h2>
                            </div>
                        </div>
                        </section>
                        <NavigationTabs hotelId={bookingId} currentStep={currentStep} />
                        <div className={styles.bookingContainer}>
                            <div className={styles.bookingLeft}>
                                <img className={styles.bookingHotelImage} src={hotel.room.hotel.images?.[1]?.url}
                                    alt={hotelData.name}></img>
                                <div className={styles.bookingDatePicker}>
  {/* --- Chi tiết đặt phòng --- */}
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
                                        <span>{getNights(hotel.check_in,hotel.check_out)}/đêm</span>
                                        </div>
                                    </div>

                                    {/* --- Tóm tắt giá --- */}
                                    <div className={styles.card}>
                                        <h4 className={styles.cardTitle}>Tóm tắt giá</h4>
                                        <div className={styles.roomType}>{hotel.room.room_type}</div>
                                        <div className={styles.price}>{Number(hotel.total_price).toLocaleString('vi-VN')} VND</div>
                                        <div className={styles.note}>Đã bao gồm thuế và phí</div>
                                    </div>

                                    {/* --- Chi phí huỷ --- */}
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

                                    {/* --- Ưu đãi / Điều kiện đặt phòng --- */}
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
                            <div className={styles.bookingRight}>
                                <BookingInfo hotelData={hotelData} onBookingSubmit={handleBookingSubmit} currentStep={currentStep}
                                    onBackToForm={handleBackToForm}  totalPrice={Number(hotel.total_price).toLocaleString('vi-VN')}/>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Booking