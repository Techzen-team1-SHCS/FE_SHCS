import { useState } from "react";
import styles from "./Step1Property.module.css";

const cityData = {
  "Da Nang": ["Hai Chau", "Thanh Khe", "Son Tra", "Ngu Hanh Son", "Lien Chieu"],
  "Ha Noi": ["Ba Dinh", "Dong Da", "Cau Giay", "Hoan Kiem", "Tay Ho"],
  "Ho Chi Minh": [
    "District 1",
    "District 3",
    "District 5",
    "District 7",
    "Binh Thanh",
  ],
  Hue: ["Phu Hoi", "Phu Nhuan", "Vy Da", "Kim Long", "An Cuu"],
  "Hoi An": ["Cam Pho", "Minh An", "Son Phong", "Cam Chau", "Tan An"],
};

export default function Step1Property({ nextStep }) {
  const [city, setCity] = useState("Da Nang");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");

  const districts = cityData[city];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your property</h2>

      <div className={styles.card}>
        {/* Address */}
        <label>Your Address</label>
        <input
          type="text"
          className={styles.input}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {/* City */}
        <div style={{display:'flex',flexDirection:'column'}}>
          <label>City</label>
          <select
            className={styles.input}
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setDistrict("");
            }}
          >
            {Object.keys(cityData).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Row */}
        <div className={styles.row}>
          <div className={styles.col}>
            <label>District/County</label>
            <select
              className={styles.input}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">Select district</option>
              {districts.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className={styles.col}>
            <label>Zip code</label>
            <input
              type="text"
              className={styles.input}
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Button */}
      <button className={styles.continueBtn} onClick={nextStep}>
        continue
      </button>
    </div>
  );
}
