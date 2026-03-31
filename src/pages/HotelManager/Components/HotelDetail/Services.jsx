import styles from "./Hotel.module.css";

export default function Services({ services = [] }) {
  if (!services || services.length === 0) {
    return <div className={styles.services}>Không có dịch vụ</div>;
  }

  return (
    <div className={styles.services}>
      {services.map((s, i) => (
        <span key={i}>{s}</span>
      ))}
    </div>
  );
}