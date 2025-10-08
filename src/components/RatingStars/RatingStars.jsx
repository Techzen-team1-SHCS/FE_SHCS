import React from "react";

/**
 * Component hiển thị số sao (chỉ sao đầy hoặc sao trống)
 * @param {number} rating - Số sao (vd: 1 → ⭐, 5 → ⭐⭐⭐⭐⭐)
 */
const RatingStars = ({ rating = 0 }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      // sao đầy
      stars.push(<i key={i} className="fas fa-star" style={{ color: "#FFA500" }}></i>);
    } else {
      // sao trống
      stars.push(<i key={i} className="fas fa-star" style={{ color: "#ccc" }}></i>);
    }
  }

  return <span className="ratting">{stars}</span>;
};

export default RatingStars;
