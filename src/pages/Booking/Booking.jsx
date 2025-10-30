import React, { useEffect, useState } from 'react'
import styles from "./Booking.module.css"
import BookingInfo from '../../components/BookingInfo/BookingInfo.jsx'
import { Navigate, useParams } from 'react-router-dom'
import { hotelService } from '../../services/hotelService'
import HotelBookingInfo from '../../components/HotelBooking/HotelBookingInfo.jsx'
import NavigationTabs from '../../components/NavigationTabs/NavigationTabs.jsx'
const mockHotelData = {
    id: 1,
    name: "H Hôtel L'Art",
    province: "Hà Nội",
    description: "H Hôtel L'Art Hà Nội, nằm ở Quận Hoàn Kiếm, được đánh giá Xuất sắc",
    price: "200000",
    amenities: "[\"WiFi\", \"Restaurant\", \"Bar\", \"Family rooms\", \"Terrace\", \"Swimming Pool\"]",
    images: [
        {
            id: 1241,
            url: "https://res.cloudinary.com/dh4yg3ktf/image/upload/v1760241943/hotels/1/r98yc4fab7bwpra9godb.webp"
        }
    ]
}
const Booking = () => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [currentStep, setCurrentStep] = useState(1);
    const [hotelData, setHotelData] = useState(mockHotelData)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const hotelId = useParams();
    const handleTotalPriceChange = (price) => {
        setTotalPrice(price);
    };
    const handleBookNow = (data) => {
        console.log('Booking data:', data);
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
            if (!hotelId) return
            try {
                setLoading(true)
                // Gọi API thực tế
                const response = await hotelService.getHotelById(hotelId)
                setHotelData(response.data)
                setError(null)
            } catch (err) {
                console.error('Error fetching hotel data:', err)
                //setError('Failed to load hotel data')
                //setHotelData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchHotelData()
    }, [hotelId])
    if (loading) {
        return (
            <div className='page-wrapper'>
                <div className={styles.loading}>Loading hotel data...</div>
            </div>
        )
    }

    // if (error) {
    //   return (
    //     <div className='page-wrapper'>
    //       <div className={styles.error}>{error}</div>
    //     </div>
    //   )
    // }
    // if (!hotelData) {
    //   return (
    //     <div className='page-wrapper'>
    //       <div className={styles.error}>No hotel data found</div>
    //     </div>
    //   )
    // }
    return (
        <div className='page-wrapper'>
            <section
                className="page-banner-area pt-50 pb-35 rel z-1 bgs-cover"
                style={{ backgroundImage: "url(/assets/images/banner/banner.jpg)" }}
            >
                <div className="container">
                    <div className="banner-inner text-white mb-50">
                        <h2 className="page-title mb-10" style={{ zIndex: 10 }}>Booking</h2>
                    </div>
                </div>
            </section>
            <NavigationTabs hotelId={hotelId} currentStep={currentStep} />
            <div className={styles.bookingContainer}>
                <div className={styles.bookingLeft}>
                    <img className={styles.bookingHotelImage} src={hotelData.images?.[0]?.url}
                        alt={hotelData.name}></img>
                    <div className={styles.bookingDatePicker}>
                        <div className={styles.hotelName}>{hotelData.name}</div>
                        <div className={styles.hotelProvince}>{hotelData.province}</div>
                        
                        <HotelBookingInfo hotelData={hotelData} onTotalPriceChange={handleTotalPriceChange}/>
                    </div>
                </div>
                <div className={styles.bookingRight}>
                    <BookingInfo hotelData={hotelData} onBookingSubmit={handleBookingSubmit} currentStep={currentStep}
                        onBackToForm={handleBackToForm}  totalPrice={totalPrice}/>
                </div>
            </div>
        </div>
    )
}

export default Booking