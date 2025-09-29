import React from "react";

const Hotel = ({
  image,
  title,
  description,
  location,
  duration,
  guests,
  price,
  badgeLabel = null,
  rating = 4,
  detailsUrl = "#",
}) => {
  return (
    <div
      className="destination-item style-three bgc-lighter"
      data-aos="fade-up"
      data-aos-duration="1500"
      data-aos-offset="50"
    >
      <div className="image">
        {badgeLabel && <span className="badge bgc-pink">{badgeLabel}</span>}
        <a href="#" className="heart">
          <i className="fas fa-heart"></i>
        </a>
        <img src={image} alt={title} />
      </div>
      <div className="content">
        <div className="destination-header">
          <span className="location">
            <i className="fal fa-map-marker-alt"></i> {location}
          </span>
          <div className="ratting">
            {Array.from({ length: rating }).map((_, i) => (
              <i key={i} className="fas fa-star"></i>
            ))}
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
            <i className="far fa-user"></i> {guests}
          </li>
        </ul>
        <div className="destination-footer">
          <span className="price">
            <span>${price}</span>/person
          </span>
          <a href={detailsUrl} className="theme-btn style-two style-three">
            <span data-hover="Book Now">Book Now</span>
            <i className="fal fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hotel;
