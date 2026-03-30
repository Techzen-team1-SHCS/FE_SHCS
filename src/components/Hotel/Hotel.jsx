import { Link } from 'react-router-dom';
import './style.css';
import { MdOutlineBedroomParent } from "react-icons/md";
import { useBehavior } from "../../contexts/BehaviorContext";
import { useContext, useState } from "react"
import { AuthContext } from '../../contexts/AuthContext';
import { wishListService } from '../../services/wishListService';
import { toast } from 'react-toastify';

const Hotel = ({
  image,
  title,
  description,
  location,
  duration,
  guests,
  price,
  rating,
  detailsUrl = "#",
  id
}) => {
  const { user } = useContext(AuthContext);
  const { logBehavior } = useBehavior();
  const [isZoomed, setIsZoomed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleBookClick = () => {
    logBehavior("booking", {
      userId: user?.id || null,
      hotelId: id,
    });
  };
  
  const handleWishlist = async () => {
  if (!user) {
    toast.info("Vui lòng đăng nhập để thêm vào yêu thích");
    return;
  }

  if (isLoading) return;

  setIsLoading(true);

  try {
    if (!isLiked) {
      // ❤️ ADD
      await wishListService.addToWishList({
        hotel_id: id,
        user_id: user.id
      });

      setIsLiked(true);

      toast.success("Đã thêm vào danh sách yêu thích");

      logBehavior("like", {
        userId: user.id,
        hotelId: id
      });

    } else {
      // 🤍 REMOVE + XÓA LOG HÀNH VI
      await wishListService.removeFromWishList(id, user.id);
      
      setIsLiked(false);

      toast.info("Đã xóa khỏi danh sách yêu thích");
    }

  } catch (error) {
    console.error("Wishlist error:", error);
    toast.info("Đã xóa khỏi danh sách yêu thích");
  } finally {
    setIsLoading(false);
  }
};


  const handleZoomImage = () => {
    setIsZoomed(!isZoomed);
    
    logBehavior("click", {
      userId: user?.id || null,
      hotelId: id,
    });
  };

  const handleCloseZoom = (e) => {
    if (e.target.classList.contains('image-zoom-overlay')) {
      setIsZoomed(false);
    }
    logBehavior("click", {
      userId: user?.id || null,
      hotelId: id,
    });
  };
  return (
    <>
      <div className="destination-item style-three bgc-lighter">

        <div className="image">
          <div className="ratting">
            <i className="fas fa-star"></i> {rating}
          </div>
          <button
            className={`heart ${isLiked ? "liked" : ""}`}
            onClick={handleWishlist}
            disabled={isLoading}
          >
            <i className="fas fa-heart"></i>
          </button>
          <img 
            src={image} 
            alt={title} 
            onClick={handleZoomImage}
            className="zoomable-image"
          />
        </div>
        <div className="content">
          <div className="content1">
            <div className="destination-header">
              <div className="location">
                <i className="fal fa-map-marker-alt"></i>
                <span>{location}</span>
                <div className="ratting">
                  {[...Array(Math.floor(rating))].map((_, i) => (
                    <i key={i} className="fas fa-star" style={{ color: "#FFD700" }}></i>
                  ))}
                </div>
              </div>
            </div>
            <h5>
              <a href={detailsUrl}>{title}</a>
            </h5>
            <p>{description}</p>
            <ul className="blog-meta">
              <li>
                <i className="far fa-clock"></i> {duration}
              </li>
              <li>
                <i className="far fa-user"></i> {guests}/<MdOutlineBedroomParent size={24} color="#333" />
              </li>
            </ul>
            <div className="destination-footer">
              <span className="price">
                {price}/person
              </span>
              <Link to={detailsUrl} className="theme-btn style-two style-three" onClick={handleBookClick}>
                <span data-hover="Book Now">Book Now</span>
                <i className="fal fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Overlay */}
      {isZoomed && (
        <div 
          className="image-zoom-overlay"
          onClick={handleCloseZoom}
        >
          <div className="zoomed-image-container">
            <img 
              src={image} 
              alt={title}
              className="zoomed-image"
              onClick={handleZoomImage}
            />
            <button 
              className="close-zoom-btn"
              onClick={() => setIsZoomed(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Hotel;