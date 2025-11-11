import React from 'react';
import styles from './SaveHotelCard.module.css';
import FavoriteButton from '../FavoriteButton/FavoriteButton';

const SaveHotelCard = ({
    hotel,
    onViewDetails
}) => {

    // Destructure styles
    const {
        hotelCard,
        imageContainer,
        hotelImage,
        favoriteButtonWrapper,
        ratingStyle,
        content,
        hotelName,
        locationStyle,
        descriptionStyle,
        footer,
        priceStyle,
        priceValue,
        priceUnit,
        viewDetailsBtn
    } = styles;


    const handleToggleFavorite = (isFavorite, hotelId) => {
        console.log(`Hotel ${hotelId} ${isFavorite ? 'added to' : 'removed from'} favorites`);
    };

    return (
        <div className={hotelCard}>
            <div className={imageContainer}>
                <img src={hotel?.image} alt={hotel?.name} className={hotelImage} />

                <div className={favoriteButtonWrapper}>
                    <FavoriteButton
                        hotel={hotel}
                        size="medium"
                        onToggle={handleToggleFavorite}
                    />
                </div>

                <div className={ratingStyle}>
                    ⭐ {hotel?.rating}
                </div>
            </div>

            <div className={content}>
                <h3 className={hotelName}>{hotel?.name}</h3>
                <p className={locationStyle}><i className='fa fa-location'></i> {hotel?.location}</p>
                <p className={descriptionStyle}>{hotel?.description}</p>

                <div className={footer}>
                    <div className={priceStyle}>
                        <span className={priceValue}>{hotel?.price 
                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel?.price): "N/A"}</span>
                        <span className={priceUnit}></span>
                    </div>
                    <button
                        className={viewDetailsBtn}
                        onClick={() => onViewDetails(hotel?.id)}
                    >
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SaveHotelCard;