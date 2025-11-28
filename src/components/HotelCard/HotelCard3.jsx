import React from "react";

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

    // Format description - giới hạn 3 dòng
    const formatDescription = (desc) => {
        if (!desc) return "";
        const lines = desc.split('. ').filter(line => line.trim() !== '');
        const shortDesc = lines.slice(0, 3).join('. ');
        return lines.length > 3 ? `${shortDesc}...` : shortDesc;
    };

    return (
        <div className="col-xxl-6 col-xl-8 col-lg-10">
            <div
                className="destination-item style-three"
                data-aos="fade-up"
                data-aos-delay={aosDelay}
                data-aos-duration="1500"
                data-aos-offset="50"
                style={{
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    background: 'linear-gradient(135deg, rgba(30,30,30,0.9) 0%, rgba(20,20,20,0.95) 100%)',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                }}
            >
                {isContentFirst && (
                    <div className="content" style={{ padding: '25px', position: 'relative', zIndex: 2,height:'520px' }}>
                        <span 
                            className="location" 
                            style={{
                                color: '#ffd700',
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '15px'
                            }}
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
                            className="hotel-description" 
                            style={{
                                marginBottom: '20px',
                                lineHeight: '1.6',
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '14px',
                                    
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            <p style={{ margin: 0 }}>{formatDescription(hotel.description)}</p>
                        </div>
                        
                        <ul 
                            className="list-style-one" 
                            style={{ 
                                marginBottom: '20px',
                                padding: 0,
                                listStyle: 'none'
                            }}
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
                                className="hotel-styles" 
                                style={{
                                    marginBottom: '20px',
                                    padding: '8px 12px',
                                    background: 'rgba(255,215,0,0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,215,0,0.3)'
                                }}
                            >
                                <strong style={{ color: '#ffd700', fontSize: '13px' }}>Styles: </strong>
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>
                                    {hotelStyles.slice(0, 3).join(", ")}
                                    {hotelStyles.length > 3 && '...'}
                                </span>
                            </div>
                        )}
                        
                        <div 
                            className="destination-footer" 
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '15px',
                                borderTop: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <span 
                                className="price" 
                                style={{
                                    color: '#ffffff',
                                    fontSize: '16px',
                                    fontWeight: '700'
                                }}
                            >
                                <span style={{ color: '#ffd700' }}>{hotel.price_formatted} VND</span>/per night
                            </span>
                            <a 
                                href={`/booking/${hotel.id}`} 
                                className="read-more"
                                style={{
                                    background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                                    color: '#000',
                                    padding: '10px 20px',
                                    borderRadius: '25px',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
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
                    className="image" 
                    style={{ 
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div 
                        className="ratting" 
                        style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            background: 'rgba(0,0,0,0.8)',
                            color: '#ffd700',
                            padding: '5px 10px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            zIndex: 3,
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <i className="fas fa-star" style={{ marginRight: '5px' }}></i> {rating}
                    </div>
                    <a 
                        href="#" 
                        className="heart"
                        style={{
                            position: 'absolute',
                            top: '15px',
                            left: '15px',
                            background: 'rgba(0,0,0,0.8)',
                            color: '#fff',
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 3,
                            textDecoration: 'none',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease'
                        }}
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
                            height: '350px',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                </div>

                {!isContentFirst && (
                    <div className="content" style={{ padding: '25px', position: 'relative', zIndex: 2,height:'520px' }}>
                        <span 
                            className="location" 
                            style={{
                                color: '#ffd700',
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '15px'
                            }}
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
                            className="hotel-description" 
                            style={{
                                marginBottom: '20px',
                                lineHeight: '1.6',
                                color: 'rgba(255,255,255,0.8)',
                                fontSize: '14px',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            <p style={{ margin: 0 }}>{formatDescription(hotel.description)}</p>
                        </div>
                        
                        <ul 
                            className="list-style-one" 
                            style={{ 
                                marginBottom: '20px',
                                padding: 0,
                                listStyle: 'none'
                            }}
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
                                className="hotel-styles" 
                                style={{
                                    marginBottom: '20px',
                                    padding: '8px 12px',
                                    background: 'rgba(255,215,0,0.1)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,215,0,0.3)'
                                }}
                            >
                                <strong style={{ color: '#ffd700', fontSize: '13px' }}>Styles: </strong>
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px' }}>
                                    {hotelStyles.slice(0, 3).join(", ")}
                                    {hotelStyles.length > 3 && '...'}
                                </span>
                            </div>
                        )}
                        
                        <div 
                            className="destination-footer" 
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: '15px',
                                borderTop: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <span 
                                className="price" 
                                style={{
                                    color: '#ffffff',
                                    fontSize: '16px',
                                    fontWeight: '700'
                                }}
                            >
                                <span style={{ color: '#ffd700' }}>{hotel.price_formatted} VND</span>/per night
                            </span>
                            <a 
                                href={`/booking/${hotel.id}`} 
                                className="read-more"
                                style={{
                                    background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                                    color: '#000',
                                    padding: '10px 20px',
                                    borderRadius: '25px',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
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