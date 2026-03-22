import styles from "./Hotel.module.css";

export default function Header({ hotel = {} }) {
  return (
    <div className={styles.header}>
      <h2>{hotel?.name || "Hotel Name"}</h2>
      <p>{hotel?.address || "Address"}</p>
    </div>
  );
}