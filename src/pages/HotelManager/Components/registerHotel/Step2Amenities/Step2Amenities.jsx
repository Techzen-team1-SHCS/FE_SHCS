import { FiChevronLeft, FiCheckCircle, FiShield, FiInfo } from "react-icons/fi";
import styles from "./Step2Amenities.module.css";
import { AMENITIES_OPTIONS } from "../../../Constants/RegisterHotel/Step2";
import { useAmenitiesForm } from "../../../hooks/RegisterHotel/Step2";

export default function Step2Amenities({ nextStep, prevStep, setData }) {
  const { amenities, toggleAmenity } = useAmenitiesForm();

  const handleContinue = () => {
    if (typeof setData === 'function') {
      setData({
        amenities: Object.entries(amenities)
          .filter(([, value]) => value)
          .map(([key]) => key)
      });
    }
    nextStep();
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Main Selection Area */}
        <div className={styles.mainContent}>
          <h2 className={styles.title}>What amenities do you offer?</h2>
          <p className={styles.subtitle}>These are the most popular amenities guests search for when booking.</p>

          <div className={styles.card}>
            {AMENITIES_OPTIONS.map((item) => {
              const Icon = item.icon;
              const isActive = !!amenities[item.key];

              return (
                <label 
                  key={item.key} 
                  className={`${styles.option} ${isActive ? styles.activeOption : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={() => toggleAmenity(item.key)}
                  />
                  <Icon className={styles.icon} />
                  <span>{item.label}</span>
                </label>
              );
            })}
          </div>

          <div className={styles.buttons}>
            <button className={styles.backBtn} onClick={prevStep} title="Back">
              <FiChevronLeft />
            </button>
            <button className={styles.continueBtn} onClick={handleContinue}>
              Continue to Step 3
            </button>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className={styles.sidebar}>
          <div className={styles.infoCard}>
            <h4><FiShield size={18} /> Property Verification</h4>
            <p>Accurate amenities help build trust with guests and reduce negative reviews. Please select only what is currently available on-site.</p>
          </div>

          <div className={styles.tipBox}>
            <h5><FiInfo size={16} /> Pro Tips</h5>
            <div className={styles.tipList}>
              <div className={styles.tipItem}>
                <FiCheckCircle className={styles.checkIcon} />
                <span className={styles.tipText}>WiFi is the #1 amenity travelers filter for.</span>
              </div>
              <div className={styles.tipItem}>
                <FiCheckCircle className={styles.checkIcon} />
                <span className={styles.tipText}>Hotels with pools see 20% more clicks during summer.</span>
              </div>
              <div className={styles.tipItem}>
                <FiCheckCircle className={styles.checkIcon} />
                <span className={styles.tipText}>Listing breakfast can significantly boost morning booking rates.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}