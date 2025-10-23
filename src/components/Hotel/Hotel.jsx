
import { Link } from 'react-router-dom';
import './style.css';
import { MdOutlineBedroomParent } from "react-icons/md";

const Hotel = ({
  image,
  title,
  description,
  location,
  duration,
  guests,
  price,
  badgeLabel = null,
  rating ,
  detailsUrl = "#",
}) => {
  return (
    <div
      className="destination-item style-three bgc-lighter"
      
    >
      <div className="image">
        <div className="ratting">
          <i className="fas fa-star"></i> {rating}
        </div>
        <a href="#" className="heart">
          <i className="fas fa-heart"></i>
        </a>
        <img src={image} alt={title} />
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
           <Link to={detailsUrl}>{title}</Link>
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
          <Link to={detailsUrl} className="theme-btn style-two style-three">
              <span data-hover="Book Now">Book Now</span>
              <i className="fal fa-arrow-right"></i>
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Hotel;
