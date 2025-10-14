import React, { useEffect, useState } from "react";
import HotelCard1 from "../HotelCard/HotelCard1";
import { destinationService } from '../../services/destinationService';
const topHotel = [
  {
    id: 1,
    location: "Tours, France",
    title: "Brown Concrete Building Basilica St Martin",
    image: "assets/images/destinations/visiting-place1.jpg",
    rating: "4.8",
    time: "3 days 2 nights - Couple",
    price: "$58.00",
    link: "destination-details.html",
  },
  {
    id: 2,
    location: "Wildest, Italy",
    title: "Blue lake water view taken travel with daytime",
    image: "assets/images/destinations/visiting-place2.jpg",
    rating: "4.8",
    time: "3 days 2 nights - Couple",
    price: "$63.00",
    link: "destination-details.html",
  },
  {
    id: 3,
    location: "Rome, Italy",
    title: "Woman standing near Colosseum, Rome",
    image: "assets/images/destinations/visiting-place3.jpg",
    rating: "4.8",
    time: "3 days 2 nights - Couple",
    price: "$42.00",
    link: "destination-details.html",
  },
  {
    id: 4,
    location: "Rome, Italy",
    title: "Woman standing near Colosseum, Rome",
    image: "assets/images/destinations/visiting-place4.jpg",
    rating: "4.8",
    time: "3 days 2 nights - Couple",
    price: "$420.00",
    link: "destination-details.html",
  },
];
const Destinations = () => {
  const [topHotels, setTopHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchTopHotels = async () => {
      try {
        setLoading(true);
        const data = await destinationService.getTopHotels();
        setTopHotels(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching top hotels:", err);
        //setError("Failed to load destinations. Please try again later."); //sau khi thêm API thì có thể thêm dòng này
        setTopHotels(topHotel); //này là dữ liệu mẫu sau khi thêm được api thì để topHotel thành rỗng
      } finally {
        setLoading(false);
      }
    };

    fetchTopHotels();
  }, []);
  if (loading) {
    return (
      <section className="destinations-area bgc-black pt-100 pb-70 rel z-1">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="section-title text-white text-center counter-text-wrap mb-70">
                <h2>Discover the World's Treasures with SCHS</h2>
                <p>Loading destinations...</p>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-12 text-center text-white">
              <p>Loading amazing destinations for you...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
   if (error) {
    return (
      <section className="destinations-area bgc-black pt-100 pb-70 rel z-1">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="section-title text-white text-center counter-text-wrap mb-70">
                <h2>Discover the World's Treasures with SCHS</h2>
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (!topHotels || topHotels.length === 0) {
    return (
      <section className="destinations-area bgc-black pt-100 pb-70 rel z-1">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="section-title text-white text-center counter-text-wrap mb-70">
                <h2>Discover the World's Treasures with SCHS</h2>
                <p>No destinations available at the moment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
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
              <h2>Discover the World's Treasures with SCHS</h2>
              <p>
                One site{" "}
                <span
                  className="count-text plus"
                  data-speed="3000"
                  data-stop="3950"
                >
                  0
                </span>{" "}
                most popular experience you’ll remember
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {topHotels.map((hotel, index) => (
            <HotelCard1 key={hotel.id} topHotel={hotel} aosDelay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
