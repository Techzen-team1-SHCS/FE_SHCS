import React, { useContext, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import HotelCardRecommendation from '../../components/HotelCardRecommendation/HotelCardRecommendation';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { AuthContext } from '../../contexts/AuthContext';
import { hotelService } from "../../services/hotelService"
const HotelRecommendation = () => {
    const [hotelsRecommend, setHotelsRecommend] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const hotels = [
        {
            id: 1,
            name: "Luxury Resort & Spa",
            province: "Đà Nẵng, Việt Nam",
            price: "2,500,000 VND",
            rating: 4.8,
            images: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
            amenities: ["Wifi", "Hồ bơi", "Spa", "Nhà hàng"]
        },
        {
            id: 2,
            name: "Seaside Paradise Hotel",
            province: "Nha Trang, Việt Nam",
            price: "1,800,000 VND",
            rating: 4.6,
            images: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
            amenities: ["Wifi", "Biển riêng", "GYM", "Bar"]
        },
        {
            id: 3,
            name: "Mountain View Retreat",
            province: "Đà Lạt, Việt Nam",
            price: "1,200,000 VND",
            rating: 4.9,
            images: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=400",
            amenities: ["Wifi", "Lò sưởi", "View núi", "Xe đưa đón"]
        },
        {
            id: 4,
            name: "City Center Business Hotel",
            province: "Hồ Chí Minh, Việt Nam",
            price: "1,500,000 VND",
            rating: 4.5,
            images: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400",
            amenities: ["Wifi", "GYM", "Hội nghị", "Buffet sáng"]
        },
        {
            id: 5,
            name: "Heritage Boutique Hotel",
            province: "Hội An, Việt Nam",
            price: "1,600,000 VND",
            rating: 4.7,
            images: "https://images.unsplash.com/photo-1559291001-693fb9166cba?w=400",
            amenities: ["Wifi", "Xe đạp", "Spa", "Ẩm thực địa phương"]
        }
    ];
    useEffect(() => {
        const fetchHotelsRecommend = async () => {
            if (user) {
                //setLoading(true);
                const data = await hotelService.getRecommendedHotels();
                setHotelsRecommend(data || []);
                //setLoading(false);
            }
        };

        fetchHotelsRecommend();
    }, [user]);
    // if (!user) {
    //     return null;
    // }
    return (
        <section className="destinations-area bgc-black pt-100 pb-70 rel z-1">
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-lg-12">
                        <div
                            className="section-title text-white text-center counter-text-wrap mb-70"
                            data-aos="fade-up"
                            data-aos-duration="1500"
                            data-aos-offset="50"
                        >
                            <h1>Hotel Recommend by AI</h1>
                        </div>
                    </div>
                </div>

                {/* Thêm Swiper vào đây */}
                <div className="hotel-swiper-container">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000 }}
                        loop={true}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                            1200: {
                                slidesPerView: 4,
                            }
                        }}
                        className="hotel-swiper"
                    >
                        {/* {hotels.map((hotel) => (
                             <SwiperSlide key={hotel.id}>
                                <HotelCardRecommendation key={hotel.id}
                                    image={hotel.images?.[0]?.url || "/assets/images/default-hotel.jpg"}
                                    title={hotel.name}
                                    location={hotel.province}                                   
                                    price={`${hotel.price_formatted || hotel.price} VNĐ`}
                                    rating={(hotel.hotel_class / 10).toFixed(1)}
                                    detailsUrl={`/hotel/${hotel.id}`} 
                                    amenities={hotel.amenities}
                                    />
                            </SwiperSlide>
                        ))} */}
                        {/* Dữ liệu giả */}
                        {hotels.map((hotel) => (
                            <SwiperSlide key={hotel.id}>
                                <HotelCardRecommendation key={hotel.id}
                                    image={hotel.images?.[0]?.url || "/assets/images/default-hotel.jpg"}
                                    title={hotel.name}
                                    location={hotel.province}                                   
                                    price={`${hotel.price_formatted || hotel.price} VNĐ`}
                                    rating={(hotel.hotel_class / 10).toFixed(1)}
                                    detailsUrl={`/hotel/${hotel.id}`} 
                                    amenities={hotel.amenities}
                                    />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>


        </section>
    )
}

export default HotelRecommendation