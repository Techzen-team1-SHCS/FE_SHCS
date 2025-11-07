import HotelCard2 from "../HotelCard/HotelCard2";
import styles from "./PopularDestinations.module.css";
import { hotelService } from "../../services/hotelService";
import { useState, useEffect } from "react";

const PopularDestinations = () => {
  const {
    popularDestinationsArea,
    popularDestinationsWrap,
    sectionTitle,
    counterTextWrap,
  } = styles;
  
  const [popularHotels, setPopularHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotelsCount = async () => {
      try {
        setLoading(true);
        
        // Danh sách các địa điểm phổ biến với ảnh từ frontend
        const destinations = [
          { id: 1, title: "Hà nội", delay: 0, img: "assets/images/destinations/haNoi.jpg" },
          { id: 2, title: "Đà nẵng", delay: 100, img: "assets/images/destinations/daNang.jpg" },
          { id: 3, title: "Hồ chí minh", delay: 200, img: "assets/images/destinations/hoChiMinh.jpg" },
          { id: 4, title: "Nha trang", delay: 0, img: "assets/images/destinations/nhaTrang.jpg" },
          { id: 5, title: "Huế", delay: 100, img: "assets/images/destinations/hue.jpg" },
          { id: 6, title: "Hải phòng", delay: 200, img: "assets/images/destinations/haiPhong.jpg" },
        ];

        // Fetch số lượng hotels cho từng địa điểm
        const destinationsWithCount = await Promise.all(
          destinations.map(async (destination) => {
            try {
              const response = await hotelService.searchHotels({
                destination: destination.title,
                per_page: 1, // Chỉ cần lấy tổng số lượng
                page: 1
              });
              
              return {
                ...destination,
                hotels: `${response.total || 0} hotels`,
                hotelCount: response.total || 0
              };
            } catch (error) {
              console.error(`Error fetching hotels for ${destination.title}:`, error);
              return {
                ...destination,
                hotels: "0 hotels",
                hotelCount: 0
              };
            }
          })
        );

        setPopularHotels(destinationsWithCount);
      } catch (error) {
        console.error("Error fetching popular destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelsCount();
  }, []);

  // Tính tổng số hotels
  const totalHotels = popularHotels.reduce((sum, hotel) => sum + hotel.hotelCount, 0);

  if (loading) {
    return (
      <section className={`${popularDestinationsArea} rel z-1`}>
        <div className="container-fluid">
          <div className={`${popularDestinationsWrap} br-20 bgc-lighter pt-100 pb-70`}>
            <div className="text-center py-5">Loading popular destinations...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${popularDestinationsArea} rel z-1`}>
      <div className="container-fluid">
        <div className={`${popularDestinationsWrap} br-20 bgc-lighter pt-100 pb-70`}>
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div
                className={`${sectionTitle} text-center ${counterTextWrap} mb-70`}
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <h2>Explore Popular Destinations</h2>
                <p>
                  Discover{" "}
                  <span
                    className="count-text plus"
                    data-speed="3000"
                    data-stop={totalHotels}
                  >
                    0
                  </span>{" "}
                  hotels across popular destinations
                </p>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row justify-content-center">
              {popularHotels.map((popularHotel, index) => (
                <HotelCard2 
                  key={popularHotel.id} 
                  PopularHotel={popularHotel} 
                  aosDelay={popularHotel.delay} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;