import React from "react";
import styles from "./HotelCard2.module.css";

const HotelCard2 = ({ PopularHotel, aosDelay, index }) => {
    const {
        destinationItem,
        styleTwo,
        image,
        heart,
        content,
        time,
        more,
    } = styles;

    const colClass = index === 2 || index === 3 ? "col-md-6" : "col-xl-3 col-md-6";

    return (
        <div className={colClass}>
            <div
                className={`${destinationItem} ${styleTwo}`}
                data-aos="flip-up"
                data-aos-delay={aosDelay}
                data-aos-duration="1500"
                data-aos-offset="50"
            >
                <div className={image}>
                    <a href="#" className={heart}>
                        <i className="fas fa-heart"></i>
                    </a>
                    <img src={PopularHotel.img} alt={PopularHotel.title} />

                </div>
                <div className={content}>
                    <h6>
                        <a href={`/hotelList?destination=${encodeURIComponent(PopularHotel.title)}`}>{PopularHotel.title}</a>
                    </h6>
                    <span className={time}>{PopularHotel.hotels}</span>
                    <a href={`/hotelList?destination=${encodeURIComponent(PopularHotel.hotelCount)}`} className={more}>
                        <i className="fas fa-chevron-right"></i>
                    </a>
                </div>

            </div>
        </div>
    );
};

export default HotelCard2;