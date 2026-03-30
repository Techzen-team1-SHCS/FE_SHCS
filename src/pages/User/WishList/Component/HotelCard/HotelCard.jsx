import { FaStar, FaTrash, FaMapMarkerAlt } from "react-icons/fa";
import Button from "../../../../../components/Button/Button";
import styles from "../../WishList.module.css";

const HotelCard = ({
  item,
  navigate,
  handleRemove,
  getRatingColor,
  getRatingText
}) => {
  const rating = item.hotel.hotel_class / 10;
  const ratingColor = getRatingColor(rating);
  const ratingText = getRatingText(rating);

  return (
    <div
      className={styles.hotelCard}
      onClick={() => navigate(`/hotel/${item.hotel.id}`)}
    >
      {/* Card Image */}
      <div className={styles.cardImage}>
        <img
          src={item.hotel?.images[1]?.url || "/default-hotel.jpg"}
          alt={item.hotel.name}
        />

        <div className={styles.cardOverlay}>
          {/* Rating Badge */}
          <div
            className={styles.ratingBadge}
            style={{ backgroundColor: ratingColor }}
          >
            <FaStar className={styles.ratingStar} />
            <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
          </div>

          {/* Remove Button */}
          <button
            className={styles.removeButton}
            onClick={(e) => handleRemove(item.id, e)}
            title="Xóa khỏi danh sách yêu thích"
          >
            <FaTrash className={styles.removeIcon} />
          </button>
        </div>

        {/* Rating Text */}
        <div className={styles.ratingText}>
          {ratingText}
        </div>
      </div>

      {/* Card Content */}
      <div className={styles.cardContent}>
        <h3 className={styles.hotelName}>{item.hotel.name}</h3>

        <div className={styles.location}>
          <FaMapMarkerAlt className={styles.locationIcon} />
          <span>{item.hotel.province}</span>
        </div>

        <p className={styles.description}>
          {item.hotel.text || "Khách sạn tiện nghi với đầy đủ dịch vụ hiện đại"}
        </p>

        {/* Price & Action */}
        <div className={styles.cardFooter}>
          <div className={styles.priceSection}>
            <span className={styles.priceLabel}>Giá chỉ từ</span>
            <span className={styles.price}>
              {Number(item.hotel.price).toLocaleString("vi-VN")} ₫
            </span>
            <span className={styles.priceNote}>/đêm</span>
          </div>

          <div className={styles.actionButtons}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/hotel/${item.hotel.id}`);
              }}
              props="Xem chi tiết"
              className={styles.detailButton}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;