import React from "react";
import HotelCard from "../HotelCard/HotelCard1";
import HotelCard2 from "../HotelCard/HotelCard2";
const PopularHotel = [
  {
    id: 1,
    img: "assets/images/destinations/destination1.jpg",
    title: "Thailand beach",
    link: "https://drive.google.com/drive/folders/1GAoWKb1qpOqfobT7RrbUgiriQCnu8LFx",
    tours: "5352+ tours & 856+ Activity",
    delay: 0,
  },
  {
    id: 2,
    img: "assets/images/destinations/destination2.jpg",
    title: "Parga, Greece",
    link: "destination-details.html",
    tours: "5352+ tours & 856+ Activity",
    delay: 100,
  },
  {
    id: 3,
    img: "assets/images/destinations/destination3.jpg",
    title: "Castellammare del Golfo, Italy",
    link: "destination-details.html",
    tours: "5352+ tours & 856+ Activity",
    delay: 200,
  },
  {
    id: 4,
    img: "assets/images/destinations/destination4.jpg",
    title: "Reserve of Canada, Canada",
    link: "destination-details.html",
    tours: "5352+ tours & 856+ Activity",
    delay: 0,
  },
  {
    id: 5,
    img: "assets/images/destinations/destination5.jpg",
    title: "Dubai united states",
    link: "destination-details.html",
    tours: "5352+ tours & 856+ Activity",
    delay: 100,
  },
  {
    id: 6,
    img: "assets/images/destinations/destination6.jpg",
    title: "Milos, Greece",
    link: "destination-details.html",
    tours: "5352+ tours & 856+ Activity",
    delay: 200,
  },
];
const PopularDestinations = () => {
  return (
    <section className="popular-destinations-area rel z-1">
      <div className="container-fluid">
        <div className="popular-destinations-wrap br-20 bgc-lighter pt-100 pb-70">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div
                className="section-title text-center counter-text-wrap mb-70"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <h2>Explore Popular Hotel</h2>
                <p>
                  One site{" "}
                  <span
                    className="count-text plus"
                    data-speed="3000"
                    data-stop="34500"
                  >
                    0
                  </span>{" "}
                  most popular experience
                </p>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row justify-content-center">
              {PopularHotel.map((popularHotel, index) => (
                <HotelCard2 key={popularHotel.id} PopularHotel={popularHotel} aosDelay={200} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
