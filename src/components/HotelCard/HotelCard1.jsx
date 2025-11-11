import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from "./HotelCard1.module.css";
const HotelCard1 = ({ topHotel, aosDelay }) => {
    const navigate=useNavigate();
    const {destinationItem,content,location,destinationFooter,ratting,image,heart,time,price,readMore}=styles;
    return (
        <div className="col-xxl-3 col-xl-4 col-md-6">
            <div
                className={destinationItem}
                data-aos="fade-up"
                data-aos-delay={aosDelay}
                data-aos-duration="1500"
                data-aos-offset="50"
            >
                <div className={image}>
                    <div className={ratting}>
                        <i className="fas fa-star"></i> {topHotel.rating}
                    </div>
                    <a href="#" className={heart}>
                        <i className="fas fa-heart"></i>
                    </a>
                    <img src={topHotel.image} alt="Destination" />
                </div>
                <div className={content}>
                    <span className={location}>
                        <i className="fal fa-map-marker-alt"></i> {topHotel.location}
                    </span>
                    <h5>
                        <a href={topHotel.link}>{topHotel.title}</a>
                    </h5>
                    <span className={time}>{topHotel.time}</span>
                </div>
                <div className={destinationFooter}>
                    <span className={price}>
                        <span>{topHotel.price}</span>/per person
                    </span>
                    <a href="/HotelDetail" className={readMore}>
                        Book Now <i className="fal fa-angle-right"></i>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default HotelCard1