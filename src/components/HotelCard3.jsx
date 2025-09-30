import React from "react";

const HotelCard3 = ({ hotel, aosDelay,index }) => {
    const isContentFirst = index < 2;
  return (
    
    <div className="col-xxl-6 col-xl-8 col-lg-10">
      <div
        className="destination-item style-three"
        data-aos="fade-up"
        data-aos-delay={aosDelay}
        data-aos-duration="1500"
        data-aos-offset="50"
      >
        {isContentFirst && (
          <div className="content">
            <span className="location">
              <i className="fal fa-map-marker-alt"></i> {hotel.location}
            </span>
            <h5>
              <a href={hotel.link}>{hotel.title}</a>
            </h5>
            <ul className="list-style-one">
              {hotel.features.map((feature, idx) => (
                <li key={idx}>
                  <i className={feature.icon}></i> {feature.text}
                </li>
              ))}
            </ul>
            <div className="destination-footer">
              <span className="price">
                <span>{hotel.price}</span>/per nights
              </span>
              <a href="#" className="read-more">
                Book Now <i className="fal fa-angle-right"></i>
              </a>
            </div>
          </div>
        )}

        <div className="image">
          <div className="ratting">
            <i className="fas fa-star"></i> {hotel.rating}
          </div>
          <a href="#" className="heart">
            <i className="fas fa-heart"></i>
          </a>
          <img src={hotel.img} alt={hotel.title} />
        </div>

        {!isContentFirst && (
          <div className="content">
            <span className="location">
              <i className="fal fa-map-marker-alt"></i> {hotel.location}
            </span>
            <h5>
              <a href={hotel.link}>{hotel.title}</a>
            </h5>
            <ul className="list-style-one">
              {hotel.features.map((feature, idx) => (
                <li key={idx}>
                  <i className={feature.icon}></i> {feature.text}
                </li>
              ))}
            </ul>
            <div className="destination-footer">
              <span className="price">
                <span>{hotel.price}</span>/per night
              </span>
              <a href="#" className="read-more">
                Book Now <i className="fal fa-angle-right"></i>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelCard3;
