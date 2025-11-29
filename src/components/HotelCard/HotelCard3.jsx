import React from "react";
import styles from "./HotelCard3.module.css";
const HotelCard3 = ({ hotel, aosDelay, index }) => {
    const isContentFirst = index < 2;
    
    // Tính rating từ hotel_class (chia 10 và làm tròn 1 chữ số thập phân)
    const rating = (hotel.hotel_class / 10).toFixed(1);
    
    // Lấy ảnh đầu tiên từ mảng images
    const mainImage = hotel.images && hotel.images.length > 0 ? hotel.images[0].url : "";
    
    // Parse amenities từ JSON string
    const amenities = hotel.amenities ? JSON.parse(hotel.amenities) : [];
    
    // Lấy styles
    const hotelStyles = hotel.styles ? hotel.styles.map(style => style.style) : [];

    const {destinationItem,content,location,hotelDes,listStyle,hotelStyle,destinationFooter,price,readMore,image,ratting,heart,hotelName, hotelNameLink} =styles
    return (
        <div className="col-xxl-6 col-xl-8 col-lg-10">
            <div
                className={destinationItem}
                data-aos="fade-up"
                data-aos-delay={aosDelay}
                data-aos-duration="1500"
                data-aos-offset="50"
            >
                {isContentFirst && (
                    <div className={content} >
                        <span 
                            className={location} 
                            
                        >
                            <i className="fal fa-map-marker-alt" style={{ color: '#ffd700' }}></i> 
                            {hotel.province}
                        </span>
                        
                        <h5 className={hotelName}>
                            <a 
                                href={`/hotel/${hotel.id}`} 
                                className={hotelNameLink}
                                onMouseOver={(e) => e.target.style.color = '#ffd700'}
                                onMouseOut={(e) => e.target.style.color = '#ffffff'}
                            >
                                {hotel.name}
                            </a>
                        </h5>
                        
                        <div 
                            className={hotelDes} 
                            
                        >
                            <p style={{ margin: 0 }}>{hotel.description}</p>
                        </div>
                        
                        <ul 
                            className={listStyle}
                        >
                            {amenities.slice(0, 3).map((amenity, idx) => (
                                <li 
                                    key={idx} 
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginBottom: '8px',
                                        color: 'rgba(255,255,255,0.9)',
                                        fontSize: '14px'
                                    }}
                                >
                                    <i 
                                        className="fal fa-check" 
                                        style={{ 
                                            color: '#00ff88',
                                            fontSize: '12px'
                                        }}
                                    ></i> 
                                    <span>{amenity}</span>
                                </li>
                            ))}
                        </ul>
                        
                        {hotelStyles.length > 0 && (
                            <div 
                                className={hotelStyle}
                                
                            >
                                <strong style={{ color: '#ffd700', fontSize: '13px' }}>Styles: </strong>
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>
                                    {hotelStyles.slice(0, 3).join(", ")}
                                    {hotelStyles.length > 3 && '...'}
                                </span>
                            </div>
                        )}
                        
                        <div 
                            className={destinationFooter} 
                        >
                            <span 
                                className={price}
                            >
                                <span style={{ color: '#ffd700' }}>{hotel.price_formatted} VND</span>/per night
                            </span>
                            <a 
                                href={`/booking/${hotel.id}`} 
                                className={readMore}
                                
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 5px 15px rgba(255,215,0,0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                Book Now <i className="fal fa-angle-right"></i>
                            </a>
                        </div>
                    </div>
                )}

                <div 
                    className={image} 
                    
                >
                    <div 
                        className={ratting} 
                        
                    >
                        <i className="fas fa-star" style={{ marginRight: '5px' }}></i> {rating}
                    </div>
                    <a 
                        href="#" 
                        className={heart}
                            
                        onMouseOver={(e) => {
                            e.target.style.background = 'rgba(255,0,0,0.8)';
                            e.target.style.color = '#fff';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'rgba(0,0,0,0.8)';
                            e.target.style.color = '#fff';
                        }}
                    >
                        <i className="fas fa-heart"></i>
                    </a>
                    <img 
                        src={mainImage} 
                        alt={hotel.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                </div>

                {!isContentFirst && (
                    <div className={content}>
                        <span 
                            className={location} 
                            
                        >
                            <i className="fal fa-map-marker-alt" style={{ color: '#ffd700' }}></i> 
                            {hotel.province}
                        </span>
                        
                        <h5 style={{ 
                            marginBottom: '15px',
                            fontSize: '20px',
                            fontWeight: '700',
                            lineHeight: '1.3',
                            color: '#ffffff'
                        }}>
                            <a 
                                href={`/hotel/${hotel.id}`} 
                                style={{ 
                                    color: 'inherit', 
                                    textDecoration: 'none',
                                    transition: 'color 0.3s ease',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                }}
                                onMouseOver={(e) => e.target.style.color = '#ffd700'}
                                onMouseOut={(e) => e.target.style.color = '#ffffff'}
                            >
                                {hotel.name}
                            </a>
                        </h5>
                        
                        <div 
                            className={hotelDes}
                            
                        >
                            <p style={{ margin: 0 }}>{hotel.description}</p>
                        </div>
                        
                        <ul 
                            className={listStyle} 
                            
                        >
                            {amenities.slice(0, 3).map((amenity, idx) => (
                                <li 
                                    key={idx} 
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginBottom: '8px',
                                        color: 'rgba(255,255,255,0.9)',
                                        fontSize: '14px'
                                    }}
                                >
                                    <i 
                                        className="fal fa-check" 
                                        style={{ 
                                            color: '#00ff88',
                                            fontSize: '12px'
                                        }}
                                    ></i> 
                                    <span>{amenity}</span>
                                </li>
                            ))}
                        </ul>
                        
                        {hotelStyles.length > 0 && (
                            <div 
                                className={hotelStyle} 
                                
                            >
                                <strong style={{ color: '#ffd700', fontSize: '13px' }}>Styles: </strong>
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>
                                    {hotelStyles.slice(0, 3).join(", ")}
                                    {hotelStyles.length > 3 && '...'}
                                </span>
                            </div>
                        )}
                        
                        <div 
                            className={destinationFooter} 
                           
                        >
                            <span 
                                className={price}
                            >
                                <span style={{ color: '#ffd700' }}>{hotel.price_formatted} VND</span>/per night
                            </span>
                            <a 
                                href={`/booking/${hotel.id}`} 
                                className={readMore}  
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 5px 15px rgba(255,215,0,0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
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