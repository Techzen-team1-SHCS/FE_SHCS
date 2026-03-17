import { FaStar } from "react-icons/fa";
import styles from "../../WishList.module.css";

const FilterSection = ({
  showFilter,
  filteredList,
  options,
  selected,
  handleClick
}) => {
  return (
    <div
      className={`${styles.filterSection} ${
        showFilter ? styles.filterSectionOpen : ""
      }`}
    >
      <div className={styles.filterHeader}>
        <h3>Lọc theo đánh giá</h3>
        <span className={styles.selectedCount}>
          {filteredList.length} khách sạn
        </span>
      </div>

      <div className={styles.filterOptions}>
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.filterOption} ${
              selected === opt.value ? styles.filterOptionActive : ""
            }`}
            onClick={() => handleClick(opt.value)}
          >
            <div className={styles.optionContent}>
              {opt.label !== "Tất cả" && (
                <FaStar
                  className={styles.optionStar}
                  color={selected === opt.value ? "#FFFFFF" : "#F59E0B"}
                />
              )}
              <span className={styles.optionLabel}>{opt.label}</span>
            </div>

            {opt.label !== "Tất cả" && !opt.exact && (
              <span className={styles.optionPlus}>+</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSection;