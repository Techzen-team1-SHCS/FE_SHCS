import { useEffect, useState } from "react";
import styles from "../../components/HotelListFilter/HotelListFilter.module.css";
// import { hotelFilterService } from "../../services/hotelFilterService";

const HotelListFilter = ({ onFilterChange }) => {
    const filterData = [
    {
        title: "Các bộ lọc phổ biến",
        options: [
            { name: "4 sao", },
            { name: "Khách sạn", },
            { name: "Tuyệt hảo: 9 điểm trở lên", },
            { name: "Hồ bơi", },
            { name: "WiFi miễn phí", },
            { name: "Trung tâm Spa & chăm sóc sức khoẻ", },
            { name: "Ban công", },
            { name: "Căn hộ", },
        ],
    },
    {
        title: "Các chứng chỉ",
        options: [{ name: "Chứng chỉ bền vững", }],
    },
    {
        title: "Thương hiệu",
        options: [
            { name: "OYO Rooms", },
            { name: "VBA Hospitality Group", },
            { name: "Somerset", },
            { name: "Belvilla", },
            { name: "Muong Thanh Hospitality", },
            { name: "InterContinental Hotels & Resorts", },
        ],
    },
    {
    title: "Tiện nghi",
    options: [
      { name: "Chỗ đỗ xe" },
      { name: "Nhà hàng" },
      { name: "Dịch vụ phòng" },
      { name: "Lễ tân 24 giờ" },
      { name: "Trung tâm thể dục" },
    ],
  },
  {
    title: "Tiện nghi phòng",
    options: [
      { name: "Ban công" },
      { name: "Hồ bơi riêng" },
      { name: "Nhìn ra biển" },
      { name: "Phòng tắm riêng" },
      { name: "Bể sục" },
    ],
  },
  {
    title: "Điểm đánh giá của khách",
    options: [
      { name: "Tuyệt hảo: 9 điểm trở lên" },
      { name: "Rất tốt: 8 điểm trở lên" },
      { name: "Tốt: 7 điểm trở lên" },
      { name: "Dễ chịu: 6 điểm trở lên" },
    ],
  },
   {
    title: "Loại chỗ ở",
    options: [
      { name: "Căn hộ" },
      { name: "Khách sạn" },
      { name: "Chỗ nghỉ nhà dân" },
      { name: "Nhà khách" },
      { name: "Nhà trọ" },
      { name: "Nhà nghỉ B&B" },
      { name: "Biệt thự" },
      { name: "Nhà nghỉ mát" },
      { name: "Khách sạn tình nhân" },
      { name: "Khách sạn khoang ngủ" },
      { name: "Resort" },
      { name: "Khu cắm trại" },
      { name: "Nhà nghỉ giữa thiên nhiên" },
    ],
  },
];

  const [countData, setCountData] = useState({});
  const [selected, setSelected] = useState([]);

  const handleCheckboxChange = (name, checked) => {
    let newSelected = [...selected];

    if (checked) {
      newSelected.push(name);
    } else {
      newSelected = newSelected.filter((item) => item !== name);
    }

    setSelected(newSelected);
    onFilterChange(newSelected); // gửi danh sách filter lên cha
  };

  useEffect(() => {
    const fetchCounts = async () => {
      const data = await hotelFilterService.getFilterCounts();
      setCountData(data);
    };
    fetchCounts();
  }, []);
//   if (!Array.isArray(filterData)) return null;

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.title}>Chọn lọc theo:</h3>

      {filterData.map((group, index) => (
        <FilterGroup
          key={index}
          title={group.title}
          options={group.options}
          countData={countData}
          selected={selected}
          onCheckboxChange={handleCheckboxChange}
        />
      ))}
    </aside>
  );
};

const FilterGroup = ({ title, options, countData, selected, onCheckboxChange }) => {
  const [showAll, setShowAll] = useState(false);
  const visibleOptions = showAll ? options : options.slice(0, 5);

  return (
    <div className={styles.filterGroup}>
      <h4 className={styles.groupTitle}>{title}</h4>
      <ul className={styles.optionList}>
        {visibleOptions.map((option, idx) => {
          const count = countData[option.name] ?? option.count ?? 0;
          const isChecked = selected.includes(option.name);
          return (
            <li key={idx} className={styles.optionItem}>
              <label className={styles.label}>
                <input type="checkbox"  className={styles.checkbox} checked={isChecked}
                  onChange={(e) => onCheckboxChange(option.name, e.target.checked)} />
                <span className={styles.optionText}>{option.name}</span>
                <span className={styles.count}>{count}</span>
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