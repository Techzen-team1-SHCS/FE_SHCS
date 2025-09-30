import React from "react";

const HotelCard2 = ({ PopularHotel, aosDelay, index }) => {
    const colClass = index === 2 || index === 3 ? "col-md-6" : "col-xl-3 col-md-6";
return (
    <div className={colClass}>
        <div className="destination-item style-two"
            data-aos="flip-up" data-aos-delay={aosDelay.delay}
            data-aos-duration="1500" data-aos-offset="50" >
            <div className="image">
                <a href="#" className="heart">
                    <i className="fas fa-heart"></i>
                </a> <img src={PopularHotel.img} alt={PopularHotel.title} />
            </div> <div className="content">
                <h6>
                    <a href={PopularHotel.link}>{PopularHotel.title}</a>
                </h6> <span className="time">{PopularHotel.tours}</span>
                <a href="#" className="more">
                    <i className="fas fa-chevron-right"></i>
                </a>
            </div>
        </div>
    </div>);
};
export default HotelCard2;