import styles from "./Step2Amenities.module.css";
import { AMENITIES_OPTIONS } from "../../../Constants/RegisterHotel/Step2";
import { useAmenitiesForm } from "../../../hooks/RegisterHotel/Step2";

export default function Step2Amenities({ nextStep, prevStep }) {

  const { amenities, toggleAmenity } = useAmenitiesForm();

  return (
    <div className={styles.container}>

      <h2 className={styles.title}>
        What can guests use at your place?
      </h2>

      <div className={styles.card}>

        {AMENITIES_OPTIONS.map((item) => {

          const Icon = item.icon;

          return (
            <label key={item.key} className={styles.option}>

              <input
                type="checkbox"
                checked={amenities[item.key]}
                onChange={() => toggleAmenity(item.key)}
              />

              <Icon className={styles.icon} />

              <span>{item.label}</span>

            </label>
          );

        })}

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