import React from "react";
import HotelCard from "../HotelCard/HotelCard1";
import HotelCard3 from "../HotelCard/HotelCard3";

const hotelsData = [
  {
    id: 1,
    img: "assets/images/destinations/hotel1.jpg",
    title: "The brown bench near swimming pool Hotel",
    location: "Ao Nang, Thailand",
    link: "destination-details.html",
    rating: 4.8,
    price: "$85.00",
    features: [
      { icon: "fal fa-bed-alt", text: "2 Bed room" },
      { icon: "fal fa-hat-chef", text: "1 kitchen" },
      { icon: "fal fa-bath", text: "2 Wash room" },
      { icon: "fal fa-router", text: "Internet" },
    ],
    delay: 0,
  },
  {
    id: 2,
    img: "assets/images/destinations/hotel2.jpg",
    title: "Green trees and body of water Marriott Hotel",
    location: "Kigali, Rwanda",
    link: "destination-details.html",
    rating: 4.8,
    price: "$85.00",
    features: [
      { icon: "fal fa-bed-alt", text: "2 Bed room" },
      { icon: "fal fa-hat-chef", text: "1 kitchen" },
      { icon: "fal fa-bath", text: "2 Wash room" },
      { icon: "fal fa-router", text: "Internet" },
    ],
    delay: 50,
  },
  {
    id: 3,
    img: "assets/images/destinations/hotel3.jpg",
    title: "Painted house surrounded with trees Hotel",
    location: "Ao Nang, Thailand",
    link: "#",
    rating: 4.8,
    price: "$85.00",
    features: [
      { icon: "fal fa-bed-alt", text: "2 Bed room" },
      { icon: "fal fa-hat-chef", text: "1 kitchen" },
      { icon: "fal fa-bath", text: "2 Wash room" },
      { icon: "fal fa-router", text: "Internet" },
    ],
    delay: 0,
  },
  {
    id: 4,
    img: "assets/images/destinations/hotel4.jpg",
    title: "House pool Jungle Pool Indonesia Hotel",
    location: "Ao Nang, Thailand",
    link: "#",
    rating: 4.8,
    price: "$85.00",
    features: [
      { icon: "fal fa-bed-alt", text: "2 Bed room" },
      { icon: "fal fa-hat-chef", text: "1 kitchen" },
      { icon: "fal fa-bath", text: "2 Wash room" },
      { icon: "fal fa-router", text: "Internet" },
    ],
    delay: 50,
  },
];

const HotelSection = () => {
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
                most popular experience you’ll remember
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          {hotelsData.map((hotel, index) => (
            <HotelCard3 key={hotel.id} hotel={hotel} aosDelay={hotel.delay} index={index} />
          ))}
        </div>

        <div className="hotel-more-btn text-center mt-40">
          <a href="destination2.html" className="theme-btn style-four">
            <span data-hover="Explore More Hotel">Explore More Hotel</span>
            <i className="fal fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HotelSection;
