import React from "react";
import styles from "./NearbyPlaces.module.css";

const NearbyPlaces = ({ data }) => {
  return (
    <section className={styles.nearbySection}>
      <div className="container">
        <div className="row">
          {data.map((category, index) => (
            <div key={index} className="col-lg-4 col-md-6 mb-4">
              <div className={styles.category}>
                <h5 className={styles.title}>
                  <i className={category.icon}></i> {category.title}
                </h5>
                <ul className={styles.list}>
                  {category.places.map((place, i) => (
                    <li key={i} className={styles.item}>
                      <span>{place.name}</span>
                      <span className={styles.distance}>{place.distance}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NearbyPlaces;