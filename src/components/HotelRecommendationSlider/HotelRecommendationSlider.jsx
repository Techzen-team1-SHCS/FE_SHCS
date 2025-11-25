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
    const [swiperReady, setSwiperReady] = useState(false);
    const { user } = useContext(AuthContext);
    const [source, setSource] = useState("");

    useEffect(() => {
        let isMounted = true;

        const fetchHotels = async () => {
            setLoading(true);
            try {
                const data = await hotelService.getRecommendedHotels();
                console.log('API Data received:', data); // Debug log
                
                if (isMounted) {
                    setHotelsRecommend(data || []);
                    setSource(localStorage.getItem("token") ? "AI/History" : "Top Hotels");
                    
                    // Force swiper to re-initialize after data is set
                    setTimeout(() => {
                        setSwiperReady(true);
                    }, 100);
                }
            } catch (error) {
                console.error('Error fetching hotels:', error);
                if (isMounted) {
                    setHotelsRecommend([]);
                    setSource("Top Hotels");
                    setSwiperReady(true);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchHotels();
        return () => { isMounted = false };
    }, []);

    console.log('Current hotels:', hotelsRecommend); // Debug log

    // Chỉ render Swiper khi có data VÀ không loading
    const shouldRenderSwiper = !loading && hotelsRecommend.length > 0 && swiperReady;

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

                {/* Loading State */}
                {loading && (
                    <div className="text-white text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading recommended hotels...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && hotelsRecommend.length === 0 && (
                    <div className="text-white text-center py-5">
                        <p>No hotels available at the moment.</p>
                    </div>
                )}

                {/* Swiper - chỉ render khi có data */}
                {shouldRenderSwiper && (
                    <div className="hotel-swiper-container">
                        <Swiper
                            key={`swiper-${hotelsRecommend.length}-${Date.now()}`} // Unique key
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={30}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{ 
                                delay: 5000,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true
                            }}
                            loop={hotelsRecommend.length > 1}
                            watchSlidesProgress={true}
                            observer={true}
                            observeParents={true}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                                1200: { slidesPerView: 4 }
                            }}
                            className="hotel-swiper w-100"
                            onInit={(swiper) => {
                                console.log('Swiper initialized with slides:', swiper.slides.length);
                            }}
                        >
                            {hotelsRecommend.slice(0,5).map((hotel, index) => (
                                <SwiperSlide key={`${hotel.id}-${index}`}>
                                    <HotelCardRecommendation
                                        image={hotel.images?.[0]?.url || hotel.images}
                                        title={hotel.name}
                                        location={hotel.province}
                                        description={hotel.description}
                                        price={hotel.price}
                                        rating={(hotel.hotel_class / 10).toFixed(1)}
                                        detailsUrl={`/hotel/${hotel.id}`}
                                        amenities={hotel.amenities ? JSON.parse(hotel.amenities) : []}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </section>
    )
}

export default HotelRecommendation