import HotelCard2 from "../HotelCard/HotelCard2";
import styles from "./PopularDestinations.module.css";
import { hotelService } from "../../services/hotelService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PartLoading from "../Loading/PartLoading";

const PopularDestinations = () => {
  const {
    popularDestinationsArea,
    popularDestinationsWrap,
    sectionTitle,
    counterTextWrap,
  } = styles;
  const provinceImages = {
  "Hà nội": "assets/images/destinations/haNoi.jpg",
  "Đà nẵng": "assets/images/destinations/daNang.jpg",
  "Hồ chí minh": "assets/images/destinations/hoChiMinh.jpg",
  "Nha trang": "assets/images/destinations/nhaTrang.jpg",
  "Huế": "assets/images/destinations/hue.jpg",
  "Hải phòng": "assets/images/destinations/haiPhong.jpg",
  "Đà Lạt":"assets/images/destinations/dalat.jpg",
  "Phú Quốc":"assets/images/destinations/phuquoc.jpg"
};
  const [popularHotels, setPopularHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleDestinationClick = (destination) => {
    navigate(`/HotelList?destination=${encodeURIComponent(destination)}`);
  };
  useEffect(() => {
  const fetchHotelsCount = async () => {
  try {
    setLoading(true);

    const response = await hotelService.getDestinationsCount();
    // Nếu API trả trực tiếp mảng:
    const data = response?.data || response; // fallback nếu response.data undefined

    const destinationsWithImg = data.map((item, index) => ({
      id: index + 1,
      title: item.province,
      hotels: `${item.count} hotels`,
      hotelCount: item.count,
      img: provinceImages[item.province] || "assets/images/destinations/default.jpg",
      delay: index * 100,
    }));

    setPopularHotels(destinationsWithImg);

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
            <div className="text-center py-5"><PartLoading /></div>
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
                  onClick={() => handleDestinationClick(popularHotel.title)}
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