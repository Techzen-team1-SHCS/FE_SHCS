import HotelCard2 from "../HotelCard/HotelCard2";
import styles from "./PopularDestinations.module.css";
import { useNavigate } from "react-router-dom";
import { usePopularDestinationsQuery } from "../../queries/usePopularDestinationsQuery";

const PopularDestinations = () => {
  const {
    popularDestinationsArea,
    popularDestinationsWrap,
    sectionTitle,
    counterTextWrap,
  } = styles;

  const navigate = useNavigate();

  const { data: popularHotels = [], isLoading } = usePopularDestinationsQuery();

  const totalHotels = popularHotels.reduce(
    (sum, h) => sum + h.hotelCount,
    0
  );

  const handleDestinationClick = (destination) => {
    navigate(`/HotelList?destination=${encodeURIComponent(destination)}`);
  };

  if (isLoading) {
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
