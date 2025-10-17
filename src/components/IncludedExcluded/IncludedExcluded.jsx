import { useState } from "react";


const IncludedExcluded = ({included,excluded}) => {

  // Giả sử API trả về dạng:
  // {
  //   "included": ["Pick and Drop Services", "1 Meal Per Day", ...],
  //   "excluded": ["Gratuities", "Insurance", ...]
  // }

  

  return (
    <div className="row pb-55">
      {/* Included */}
      <div className="col-md-6">
        <div className="tour-include-exclude ">
          <h5>Included</h5>
          <ul className="list-style-one check mt-25">
            {included.map((item, index) => (
              <li key={index}>
                <i className="far fa-check"></i> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Excluded */}
      <div className="col-md-6">
        <div className="tour-include-exclude ">
          <h5>Excluded</h5>
          <ul className="list-style-one mt-25">
            {excluded.map((item, index) => (
              <li key={index}>
                <i className="far fa-times"></i> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IncludedExcluded;
