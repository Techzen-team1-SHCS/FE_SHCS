import styles from "./Hotel.module.css";

export default function Gallery({ images = [] }) {
  if (!images || images.length === 0) {
    return <div className={styles.gallery}>Không có ảnh</div>;
  }

  const toUrl = (item) => {
    if (!item) return "/default-hotel.jpg";
    if (typeof item === "string") return item;
    if (typeof item === "object" && item.url) return item.url;
    return "/default-hotel.jpg";
  };

  return (
    <div className={styles.galleryGrid}>
      <div className={styles.primaryImage}>
        <img src={toUrl(images[0])} alt="hotel" />
      </div>
      <div className={styles.secondaryImages}>
        {images.slice(1, 3).map((image, index) => (
          <img key={index} src={toUrl(image)} alt={`hotel-${index}`} />
        ))}
      </div>
    </div>
  );
}