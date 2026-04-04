import styles from "./HotelCard2.module.css";

const HotelCard2 = ({ PopularHotel, aosDelay, index,onClick }) => {
    const {
        destinationItem,
        styleTwo,
        image,
        heart,
        content,
        time,
        more,
    } = styles;

    const colClass = index === 2 || index === 3 ||index ===6 || index === 7 ? "col-md-6" : "col-xl-3 col-md-6";

    return (
        <div className={colClass} >
            <div
            className={`${destinationItem} ${styleTwo}`}
            data-aos="flip-up"
            data-aos-delay={aosDelay}
            data-aos-duration="1500"
            data-aos-offset="50"
            onClick={onClick} // dùng onClick từ PopularDestinations
            style={{ cursor: "pointer" }}
            >
                <div className={image}>
                    <a className={heart}>
                        <i className="fas fa-heart"></i>
                    </a>
                    <img style={{objectFit:'cover'}} src={PopularHotel.img} alt={PopularHotel.title} />
                </div>
                <div className={content}>
                    <h6>{PopularHotel.title}</h6>
                    <span className={time}>{PopularHotel.hotels}</span>
                    <div className={more}>
                        <i className="fas fa-chevron-right"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelCard2;