import React, { useEffect, useState } from "react";
import HotelCard3 from "../HotelCard/HotelCard3";
import { hotelService } from "../../services/hotelService";
import PartLoading from "../Loading/PartLoading";

const HotelSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [hotelTop, setHotelTop] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelTop = async () => {
      try {
        setLoading(true);
        const data = await hotelService.getTopHotel();
        setHotelTop(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch top hotels:", error);
        setError("Failed to load hotels. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotelTop();
  }, []);

  const handleLoadMore = () => {
    setShowAll(true);
  };

  // Thêm delay cho animation dựa trên index
  const hotelsToShow = showAll ? hotelTop : hotelTop.slice(0, 4);
  const hotelsWithDelay = hotelsToShow.map((hotel, index) => ({
    ...hotel,
    delay: (index % 4) * 100 // Thêm delay cho animation
  }));

  if (loading) {
    return (
      <section className="hotel-area bgc-black py-100 rel z-1">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="section-title text-white text-center">
                <p><PartLoading/></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="hotel-area bgc-black py-100 rel z-1">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="section-title text-white text-center">
                <p className="text-danger">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (hotelTop.length === 0) {
    return (
      <section className="hotel-area bgc-black py-100 rel z-1">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="section-title text-white text-center">
                <p>No hotels available at the moment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hotel-area bgc-black py-100 rel z-1">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div
              className="section-title text-white text-center counter-text-wrap mb-70"
              data-aos="fade-up"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <h2>Discover the World's Class Top Hotel</h2>
              <p>
                One site{" "}
                <span className="count-text plus" data-speed="3000" data-stop="34500">
                  0
                </span>{" "}
                most popular experience your will remember
              </p>
            </div>
          </div>
        </div> 

        <div className="row justify-content-center">
          {hotelsWithDelay.map((hotel, index) => (
            <HotelCard3 
              key={hotel.id || index} 
              hotel={hotel} 
              aosDelay={hotel.delay} 
              index={index} 
            />
          ))}
        </div>

        {!showAll && hotelTop.length > 4 && (
          <div className="hotel-more-btn text-center mt-40">
            <button 
              className="theme-btn style-four" 
              onClick={handleLoadMore}
              style={{cursor: "pointer", background: "none", border: "none"}}
            >
              <span data-hover="Explore More Hotel">Explore More Hotel</span>
              <i className="fal fa-arrow-right"></i>
            </button>

          </div>
        )}
      </div>
    </section>
  );
};

export default HotelSection;