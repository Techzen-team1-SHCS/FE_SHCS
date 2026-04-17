import { useState } from "react";
import styles from "../HotelListFilter/HotelListFilter.module.css";
import { FILTER_DATA } from "../../Constants/filterConstants";

const HotelListFilter = ({ selected,onFilterChange }) => {
  const filterData = FILTER_DATA;


  const handleCheckboxChange = (name, checked) => {
    let newSelected = [...selected];
    if (checked) newSelected.push(name);
    else newSelected = newSelected.filter((item) => item !== name);

    onFilterChange(newSelected); // gửi danh sách filter lên cha
  };

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>Chọn lọc theo:</h3>

      {filterData.map((group, index) => (
        <FilterGroup
          key={index}
          title={group.title}
          options={group.options}
          selected={selected}
          onCheckboxChange={handleCheckboxChange}
        />
      ))}
    </aside>
  );
};

const FilterGroup = ({ title, options, selected, onCheckboxChange }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, 5);

  return (
    <div className={styles.filterGroup}>
      <h4 className={styles.groupTitle}>{title}</h4>
      <ul className={styles.optionList}>
        {visibleOptions.map((option, idx) => {
          const isChecked = selected?.includes(option.name);
          return (
            <li key={idx} className={styles.optionItem}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={isChecked}
                  onChange={(e) =>
                    onCheckboxChange(option.name, e.target.checked)
                  }
                />
                <span className={styles.optionText}>{option.name}</span>
              </label>
            </li>
          );
        })}
      </ul>

      {options.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className={styles.showMore}
        >
          {showAll
            ? `Thu gọn`
            : `Hiển thị tất cả ${options.length} loại`}
          <span className={styles.arrow}>{showAll ? "▲" : "▼"}</span>
        </button>
      )}
    </div>
  );
};

export default HotelListFilter;
