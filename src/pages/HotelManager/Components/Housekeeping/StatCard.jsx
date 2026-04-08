import styles from "../../Main/Housekeeping/Housekeeping.module.css";

const StatCard = ({ label, value, color, bg, icon: Icon, sub, loading }) => (
  <div className={styles.statCard}>
    <div className={styles.statIconWrap} style={{ background: bg }}>
      <Icon size={20} color={color} />
    </div>
    <div className={styles.statBody}>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue} style={{ color }}>
        {loading ? <span className={styles.pulse}>—</span> : (value ?? 0)}
      </p>
      {sub && <p className={styles.statSub}>{sub}</p>}
    </div>
  </div>
);

export default StatCard;
