import styles from "./Step1Property.module.css";
import { cityData } from "../../../Constants/RegisterHotel/CityData";
import { usePropertyForm } from "../../../hooks/RegisterHotel/Step1Property";

export default function Step1Property({ nextStep, setData }) {
  const {
    city,
    district,
    address,
    zip,
    districts,
    setDistrict,
    setAddress,
    setZip,
    handleCityChange
  } = usePropertyForm();

  const handleContinue = () => {
    if (typeof setData === 'function') {
      setData({
        province: city,
        name_nearby_place: district,
        address,
        zip
      });
    }
    nextStep();
  }
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>City</label>
          <select
            className={styles.input}
            value={city}
            onChange={(e) => {
              handleCityChange(e.target.value);
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
      <button className={styles.continueBtn} onClick={handleContinue}>
        continue
      </button>
    </div>
  );
}