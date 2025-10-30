import React, { useContext, useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import HotelCardRecommendation from '../HotelCardRecommendation/HotelCardRecommendation';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { AuthContext } from '../../contexts/AuthContext';
import { hotelService } from "../../services/hotelService"
const HotelRecommendation = () => {
    const [hotelsRecommend, setHotelsRecommend] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const [source, setSource] = useState("");
    useEffect(() => {
    let isMounted = true;
    const fetchHotels = async () => {
      setLoading(true);
      try {
        let data = [];

        if (user?.id) {
          // Nếu đã login → gọi API recommendation AI/history
          data = await hotelService.getRecommendedHotels(user.id);
          if (isMounted) setSource("AI/History");
        } else {
          // Chưa login → gọi API top hotels
          data = await hotelService.getTopHotel();
          if (isMounted) setSource("Top Hotels");
        }

        if (isMounted) setHotelsRecommend(data || []);
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setHotelsRecommend([]);
          setSource("Top Hotels");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHotels();
    return () => { isMounted = false; };
  }, [user]);
    console.log(hotelsRecommend);
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
                            <div className="hotel-more-btn text-center mt-40">
                                <a className="theme-btn style-four" href='/HotelsRecommend' style={{ cursor: "pointer" }}>
                                    <span data-hover="Explore More Hotel">Explore More Hotel</span>
                                    <i className="fal fa-arrow-right"></i>
                                </a>
                            </div>
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
                        className="hotel-swiper w-100"
                    >
                        
                        {hotelsRecommend.map((hotel) => (
                            <SwiperSlide key={hotel.id}>
                                <HotelCardRecommendation key={hotel.id}
                                    image={hotel.images?.[0]?.url || hotel.images}
                                    title={hotel.name}
                                    location={hotel.province}
                                    description={hotel.description}
                                    price={`${hotel.price_formatted || hotel.price} VNĐ`}
                                    rating={(hotel.hotel_class / 10).toFixed(1)}
                                    detailsUrl={`/hotel/${hotel.id}`}
                                    amenities={hotel.amenities?JSON.parse(hotel.amenities): []}
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