import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './TopHotelSlider.module.css';
import { hotelService } from "../../services/hotelService";

const TopHotelSlider = () => {
  const [topHotels, setTopHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopHotels = async () => {
      setLoading(true);
      const data = await hotelService.getTopHotel();
      setTopHotels(data || []);
      setLoading(false);
    };

    fetchTopHotels();
  }, []);

  if (loading) return <div>Loading top hotels...</div>;

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
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              992: { slidesPerView: 4 },
            }}
            className={styles.mySwiper}
          >
            {topHotels.map((hotel) => (
              <SwiperSlide key={hotel.id}>
                <div className={styles.hotelCard}>
                  <div className={styles.hotelImage}>
                    <img src={hotel.images?.[0]?.url || "/assets/images/default-hotel.jpg"} alt={hotel.name} />
                    <div className={styles.hotelOverlay}>
                      <button className={styles.bookNowBtn}>Book Now</button>
                    </div>
                  </div>

                  <div className={styles.hotelInfo}>
                    <div className="ratting">
                {[...Array(Math.floor((hotel.hotel_class / 10).toFixed(1)))].map((_, i) => (
                  <i key={i} className="fas fa-star" style={{ color: "#FFD700" }}></i>
                ))}
                    </div>

                    <h4 className={styles.hotelName}>{hotel.name}</h4>

                    <div className={styles.hotelLocation}>
                      <i className="fal fa-map-marker-alt"></i> {hotel.province || hotel.location}
                    </div>

                    <div className={styles.hotelPrice}>
                      <span className={styles.currentPrice}>{hotel.price_formatted || hotel.price} VND</span>
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
