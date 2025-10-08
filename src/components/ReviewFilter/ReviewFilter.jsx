import React, { useState } from "react";
import RatingStars from "../RatingStars/RatingStars";

const ReviewFilter = ({ onSelect }) => {
    const [selected, setSelected] = useState(5);
    const ratings = [5, 4, 3, 2, 1];
    const handleChange = (value) => {
        setSelected(value);
        onSelect?.(value);
    };

    // danh sách rating hiển thị

    return (
        <div
            className="widget widget-reviews"
            data-aos="fade-up"
            data-aos-duration="1500"
            data-aos-offset="50"
        >
            <h6 className="widget-title">By Reviews</h6>
            <ul className="radio-filter">
                {ratings.map((rating, index) => (
                    <li key={index}>
                        <input
                            className="form-check-input "
                            type="radio"
                            name="ByReviews"
                            id={`review${index + 1}`}
                            checked={selected === rating}
                            onChange={() => handleChange(rating)}
                            style={{ cursor: 'pointer' }}
                        />
                        <label htmlFor={`review${index + 1}`}>
                            <RatingStars rating={rating} />
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReviewFilter;
