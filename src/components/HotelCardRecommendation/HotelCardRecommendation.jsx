import React from 'react'
import styles from './HotelCardRecommendation.module.css'

const HotelCardRecommendation = ({
    image,
    title,
    location,
    price,
    rating,
    amenities,
    description,
    detailsUrl = "#", }) => {
    let amenitiesArray = [];
    if (Array.isArray(amenities)) {
        amenitiesArray = amenities;
    } else if (typeof amenities === "string") {
        try {
        amenitiesArray = JSON.parse(amenities);
        } catch (e) {
        amenitiesArray = [];
        }
    }    
    return (
        <div className={styles.hotelCard}>
            <div className={styles.hotelImage}>
                <img src={image} alt={title} />
                <div className={styles.hotelRating}>
                    ⭐ {rating}
                </div>
            </div>
            <div className={styles.hotelInfo}>
                <h3 className={styles.hotelName}>{title}</h3>
                <div className={styles.hotelLocation}><div className='fa fa-location'></div> {location}</div>
                <div className={styles.hoteldescription}>{description}</div>
                <div className={styles.hotelAmenities}>
                {/* Hiển thị 3 tiện nghi đầu */}
                {amenitiesArray.slice(0, 3).map((amenity, index) => (
                    <span key={index} className={styles.amenityTag}>
                    {amenity}
                    </span>
                ))}

                {/* Hiển thị +X khác nếu còn tiện nghi */}
                {amenitiesArray.length > 3 && (
                    <span className={styles.amenityTag} style={{fontSize:'8px'}}>
                    +{amenitiesArray.length - 3} tiện nghi khác
                    </span>
                )}
                </div>

                <div className={styles.hotelPrice}>
                    <span className={styles.price}>{price}</span>
                </div>
                <a href={detailsUrl} className={styles.bookButton} >
                    Đặt ngay
                </a>
            </div>
        </div>
    )
}

export default HotelCardRecommendation