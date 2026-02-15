import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useBehavior } from "../../contexts/BehaviorContext";
import { Link } from "react-router-dom";
const HotelCard3 = ({ hotel, aosDelay, index }) => {
    const { user } = useContext(AuthContext);
    const { logBehavior } = useBehavior();
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // Tính rating
    const rating = (hotel.hotel_class / 10).toFixed(1);

    // Lấy ảnh
    const mainImage = hotel.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop";
    const secondaryImage = hotel.images?.[1]?.url || "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w-800&auto=format&fit=crop";

    // Parse amenities
    const amenities = hotel.amenities ? JSON.parse(hotel.amenities).slice(0, 4) : [];

    // Lấy styles
    const hotelStyles = hotel.styles ? hotel.styles.map(style => style.style).slice(0, 2) : [];

    const handleBookClick = () => {
        logBehavior("booking", {
            userId: user?.id || null,
            hotelId: hotel?.id
        });
    };

    const handleViewClick = () => {
        logBehavior("click", {
            userId: user?.id || null,
            hotelId: hotel?.id
        });
    };

    const handleFavoriteClick = () => {
        setIsFavorite(!isFavorite);
        logBehavior("like", {
            userId: user?.id || null,
            hotelId: hotel?.id,
            action: !isFavorite ? "add" : "remove"
        });
    };

    // Format price
    const formatPrice = (price) => {
        return parseInt(price).toLocaleString('vi-VN');
    };

    // Star rating component
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<i key={i} className="fas fa-star" style={{ color: '#FFD700', fontSize: '12px' }}></i>);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(<i key={i} className="fas fa-star-half-alt" style={{ color: '#FFD700', fontSize: '12px' }}></i>);
            } else {
                stars.push(<i key={i} className="far fa-star" style={{ color: '#666', fontSize: '12px' }}></i>);
            }
        }
        return stars;
    };

    return (
        <div
            className="col-xxl-4 col-xl-4 col-lg-6 col-md-6 col-sm-12 mt-30"    
            data-aos="fade-up"
            data-aos-delay={aosDelay}
        >
            <div
                className="hotel-card-premium"
                style={styles.card}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Gallery */}
                <div style={styles.imageGallery}>
                    <div style={{
                        ...styles.imageContainer,
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                        <img
                            src={mainImage}
                            alt={hotel.name}
                            style={styles.mainImage}
                        />

                        {/* Overlay gradient */}
                        <div style={styles.imageOverlay}></div>

                        {/* Secondary image on hover */}
                        <div style={{
                            ...styles.secondaryImage,
                            opacity: isHovered ? 0.2 : 0,
                            transform: isHovered ? 'translateX(0)' : 'translateX(-20px)'
                        }}>

                        </div>

                        {/* Top badges */}
                        <div style={styles.topBadges}>
                            <div style={styles.ratingBadge}>
                                <i className="fas fa-star" style={{ marginRight: '4px', fontSize: '10px' }}></i>
                                <span style={{ fontWeight: '700' }}>{rating}</span>
                            </div>

                            {hotelStyles.length > 0 && (
                                <div style={styles.styleBadge}>
                                    {hotelStyles[0]}
                                </div>
                            )}
                        </div>

                        {/* Favorite button */}
                        <button
                            style={{
                                ...styles.favoriteButton,
                                background: isFavorite ? 'rgba(255, 77, 79, 0.9)' : 'rgba(0, 0, 0, 0.6)',
                                transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                            }}
                            onClick={handleFavoriteClick}
                        >
                            <i className={isFavorite ? "fas fa-heart" : "far fa-heart"}></i>
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div style={styles.content}>
                    {/* Location and stars */}
                    <div style={styles.header}>
                        <div style={styles.location}>
                            <i className="fas fa-map-marker-alt" style={{ color: '#FF6B6B', fontSize: '12px', marginRight: '6px' }}></i>
                            <span style={{ color: '#888', fontSize: '13px', fontWeight: '500' }}>{hotel.province}</span>
                        </div>
                        <div style={styles.stars}>
                            {renderStars(rating)}
                        </div>
                    </div>

                    {/* Hotel Name */}
                    <h3 style={styles.hotelName}>
                        <Link
                            to={`/hotel/${hotel.id}`}
                            onClick={handleViewClick}
                            style={styles.hotelLink}
                        >
                            {hotel.name}
                        </Link>
                    </h3>

                    {/* Description */}
                    <div style={styles.description}>
                        <p style={{ margin: 0, lineHeight: '1.5', fontSize: '14px' }}>
                            {hotel.description?.substring(0, 120) || "Luxury accommodation with premium amenities..."}
                            {hotel.description?.length > 120 && "..."}
                        </p>
                    </div>

                    {/* Amenities */}
                    <div style={styles.amenities}>
                        <div style={styles.amenitiesTitle}>
                            <i className="fas fa-concierge-bell" style={{ marginRight: '8px', color: '#FFD700' }}></i>
                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Top Amenities</span>
                        </div>
                        <div style={styles.amenitiesGrid}>
                            {amenities.map((amenity, idx) => (
                                <div key={idx} style={styles.amenityItem}>
                                    <div style={styles.amenityIcon}>
                                        <i className="fas fa-check" style={{ fontSize: '10px' }}></i>
                                    </div>
                                    <span style={styles.amenityText}>{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={styles.divider}></div>

                    {/* Footer with Price and CTA */}
                    <div style={styles.footer}>
                        <div style={styles.priceSection}>
                            <div style={styles.priceLabel}>STARTING FROM</div>
                            <div style={styles.priceContainer}>
                                <span style={styles.priceCurrency}>VND</span>
                                <span style={styles.priceValue}>{formatPrice(hotel.price || "2000000")}</span>
                                <span style={styles.priceUnit}>/night</span>
                            </div>
                            <div style={styles.taxInfo}>+ taxes & fees</div>
                        </div>

                        <div style={styles.actionButtons}>
                            <Link
                                to={`/hotel/${hotel.id}`}
                                onClick={handleViewClick}
                                style={styles.detailsButton}
                            >
                                <span>Details</span>
                                <i className="fas fa-arrow-right" style={{ marginLeft: '8px', fontSize: '12px' }}></i>
                            </Link>

                            <Link
                                to={`/booking/${hotel.id}`}
                                onClick={handleBookClick}
                                style={{
                                    ...styles.bookButton,
                                    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                                    boxShadow: isHovered
                                        ? '0 10px 25px rgba(255, 107, 107, 0.4)'
                                        : '0 5px 15px rgba(255, 107, 107, 0.3)'
                                }}
                            >
                                <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
                                <span>Book Now</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Premium Styles
const styles = {
    card: {
        background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        position: 'relative',
        cursor: 'pointer',
        ':hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            borderColor: 'rgba(255, 215, 0, 0.2)'
        }
    },
    imageGallery: {
        position: 'relative',
        height: '240px',
        overflow: 'hidden'
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    mainImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.5s ease'
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        background: 'linear-gradient(to top, rgba(30,30,30,0.9) 0%, transparent 100%)',
        pointerEvents: 'none'
    },
    secondaryImage: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        width: '60px',
        height: '60px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.2)',
        transition: 'all 0.3s ease',
        zIndex: 1
    },
    topBadges: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        display: 'flex',
        gap: '10px',
        zIndex: 2
    },
    ratingBadge: {
        background: 'rgba(255, 215, 0, 0.95)',
        color: '#000',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    },
    styleBadge: {
        background: 'rgba(255, 107, 107, 0.95)',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    },
    favoriteButton: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'rgba(0, 0, 0, 0.6)',
        border: 'none',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        zIndex: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        ':hover': {
            transform: 'scale(1.1)'
        }
    },
    content: {
        padding: '25px',
        position: 'relative',
        zIndex: 2
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
    },
    location: {
        display: 'flex',
        alignItems: 'center'
    },
    stars: {
        display: 'flex',
        gap: '3px'
    },
    hotelName: {
        margin: '0 0 12px 0',
        fontSize: '20px',
        fontWeight: '700',
        lineHeight: '1.4',
        color: '#fff',
        minHeight: '56px'
    },
    hotelLink: {
        color: 'inherit',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
        display: 'block',
        ':hover': {
            color: '#FFD700'
        }
    },
    description: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '14px',
        lineHeight: '1.6',
        marginBottom: '20px',
        minHeight: '60px'
    },
    amenities: {
        marginBottom: '20px'
    },
    amenitiesTitle: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px'
    },
    amenitiesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px'
    },
    amenityItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    amenityIcon: {
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: 'rgba(0, 255, 136, 0.1)',
        border: '1px solid rgba(0, 255, 136, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    amenityText: {
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: '12px',
        fontWeight: '500'
    },
    divider: {
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent)',
        marginBottom: '20px'
    },
    footer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    priceSection: {
        marginBottom: '5px'
    },
    priceLabel: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '10px',
        fontWeight: '600',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: '4px'
    },
    priceContainer: {
        display: 'flex',
        alignItems: 'baseline',
        gap: '6px',
        marginBottom: '4px'
    },
    priceCurrency: {
        color: '#FFD700',
        fontSize: '14px',
        fontWeight: '600'
    },
    priceValue: {
        color: '#fff',
        fontSize: '28px',
        fontWeight: '700',
        lineHeight: '1'
    },
    priceUnit: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '14px',
        marginLeft: '2px'
    },
    taxInfo: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '11px',
        fontStyle: 'italic'
    },
    actionButtons: {
        display: 'flex',
        gap: '12px'
    },
    detailsButton: {
        flex: 1,
        background: 'transparent',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
        ':hover': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'rgba(255, 255, 255, 0.3)'
        }
    },
    bookButton: {
        flex: 2,
        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '12px',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 5px 15px rgba(255, 107, 107, 0.3)',
        ':hover': {
            background: 'linear-gradient(135deg, #FF5252 0%, #FF7B47 100%)',
            color: '#fff',
            textDecoration: 'none'
        }
    }
};

export default HotelCard3;