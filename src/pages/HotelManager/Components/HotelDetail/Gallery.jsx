import styles from "./Hotel.module.css";

export default function Gallery({ images = [] }) {
  if (!images || images.length === 0) {
    return <div className={styles.gallery}>Không có ảnh</div>;
  }

  return (
    <div className={styles.galleryGrid}>
      <div className={styles.primaryImage}>
        <img src={images[0]} alt="hotel" />
      </div>
      <div className={styles.secondaryImages}>
        {images.slice(1, 3).map((image, index) => (
          <img key={index} src={image} alt={`hotel-${index}`} />
        ))}
      </div>
    </div>
  );
}