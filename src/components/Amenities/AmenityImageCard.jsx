import { getAmenityImage } from '../../utils/amenityImage';

const AmenityImageCard = ({ amenityName }) => {
  const imageUrl = getAmenityImage(amenityName);

  return (
    <div className="amenity-image-card" style={{ 
      width: '250px', 
      height: '250px', 
      position: 'relative',
      textAlign: 'center'
    }}>
      <img 
        src={imageUrl} 
        alt={amenityName}
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}
        onError={(e) => {
          e.target.src = '/assets/images/amenities/default.jpg';
        }}
      />
      <div style={{ 
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
        padding: '20px 10px 10px 10px',
        borderBottomLeftRadius: '8px',
        borderBottomRightRadius: '8px'
      }}>
        <span style={{ 
          fontSize: '16px', 
          fontWeight: 'bold',
          color: 'white',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
        }}>
          {amenityName}
        </span>
      </div>
    </div>
  );
};

export default AmenityImageCard;