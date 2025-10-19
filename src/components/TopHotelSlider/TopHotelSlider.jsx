
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './TopHotelSlider.module.css';

const TopHotelSlider = () => {
    const topHotels = [
        {
            id: 1,
            name: "Luxury Beach Resort",
            rating: 5,
            location: "Nha Trang",
            image: "assets/images/hotels/hotel1.jpg",
            price: "2,500,000",
        },
        {
            id: 2,
            name: "Mountain View Hotel",
            rating: 4,
            location: "Đà Lạt",
            image: "assets/images/hotels/hotel2.jpg",
            price: "1,800,000",
        },
        {
            id: 3,
            name: "City Center Hotel",
            rating: 4,
            location: "Hồ Chí Minh",
            image: "assets/images/hotels/hotel3.jpg",
            price: "1,200,000",
        },
        {
            id: 4,
            name: "Heritage Boutique Hotel",
            rating: 5,
            location: "Hội An",
            image: "assets/images/hotels/hotel4.jpg",
            price: "1,900,000",
        },
        {
            id: 5,
            name: "Riverside Resort",
            rating: 4,
            location: "Cần Thơ",
            image: "assets/images/hotels/hotel5.jpg",
            price: "1,600,000",
        }
    ];

    return (
        <section className={styles.topHotelsSlider}>
            <div className="container">
                <div className={`${styles.sectionTitle} text-center mb-10`}>
                    <h2>Top Hotels</h2>
                    <p>Discover the best accommodations for your stay</p>
                </div>

                <div className={styles.sliderContainer}>
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        breakpoints={{
                            576: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            992: {
                                slidesPerView: 4,
                            }
                        }}
                        className={styles.mySwiper}
                    >
                        {topHotels.map((hotel) => (
                            <SwiperSlide key={hotel.id}>
                                <div className={styles.hotelCard}>
                                    <div className={styles.hotelImage}>
                                        <img src={hotel.image} alt={hotel.name} />
                                        <div className={styles.hotelOverlay}>
<button className={styles.bookNowBtn}>
                                                Book Now
                                            </button>
                                        </div>
                                    </div>

                                    <div className={styles.hotelInfo}>
                                        <div className={styles.hotelRating}>
                                            {[...Array(hotel.rating)].map((_, i) => (
                                                <i key={i} className="fas fa-star"></i>
                                            ))}
                                        </div>

                                        <h4 className={styles.hotelName}>{hotel.name}</h4>

                                        <div className={styles.hotelLocation}>
                                            <i className="fal fa-map-marker-alt"></i>
                                            {hotel.location}
                                        </div>

                                        <div className={styles.hotelPrice}>
                                            <span className={styles.currentPrice}>{hotel.price} VND</span>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
};

export default TopHotelSlider;
