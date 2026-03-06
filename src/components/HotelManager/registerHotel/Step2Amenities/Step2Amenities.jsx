import styles from "./Step2Amenities.module.css";
import { useState } from "react";
import { FaTv, FaSwimmingPool, FaBath, FaCocktail } from "react-icons/fa";

export default function Step2Amenities({ nextStep, prevStep }) {

  const [amenities, setAmenities] = useState({
    tv: false,
    pool: false,
    bathroom: false,
    drink: false
  });

  const handleChange = (name) => {
    setAmenities({
      ...amenities,
      [name]: !amenities[name]
    });
  };

  return (
    <div className={styles.container}>

      <h2 className={styles.title}>
        What can guests use at your place?
      </h2>

      <div className={styles.card}>

        <label className={styles.option}>
          <input
            type="checkbox"
            checked={amenities.tv}
            onChange={() => handleChange("tv")}
          />
          <FaTv className={styles.icon}/>
          <span>Television</span>
        </label>

        <label className={styles.option}>
          <input
            type="checkbox"
            checked={amenities.pool}
            onChange={() => handleChange("pool")}
          />
          <FaSwimmingPool className={styles.icon}/>
          <span>Swimming Pool</span>
        </label>

        <label className={styles.option}>
          <input
            type="checkbox"
            checked={amenities.bathroom}
            onChange={() => handleChange("bathroom")}
          />
          <FaBath className={styles.icon}/>
          <span>Private bathroom</span>
        </label>

        <label className={styles.option}>
          <input
            type="checkbox"
            checked={amenities.drink}
            onChange={() => handleChange("drink")}
          />
          <FaCocktail className={styles.icon}/>
          <span>Welcome Drink</span>
        </label>

      </div>

      <div className={styles.buttons}>

        <button
          className={styles.backBtn}
          onClick={prevStep}
        >
          ‹
        </button>

        <button
          className={styles.continueBtn}
          onClick={nextStep}
        >
          continue
        </button>

      </div>

    </div>
  );
}