import React from 'react'
import styles from './HotelCardRecommendation.module.css'

const HotelCardRecommendation = ({ image,
    title,
    location,
    price,
    rating,
    amenities,
    description,
    detailsUrl = "#",}) => {
    return (
        <div className={styles.hotelCard} >
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

                    {amenities.slice(0, 4).map((amenity, index) => (
                        <span key={index} className={styles.amenityTag}>
                            {amenity}
                        </span>
                    ))}
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