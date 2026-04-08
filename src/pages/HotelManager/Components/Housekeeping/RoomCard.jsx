import { HK_STATUS_CONFIG } from "../../Constants/Housekeeping/housekeepingConstants";
import styles from "./RoomStatusGrid.module.css";
import { FiUser } from "react-icons/fi";

const RoomCard = ({ room, onSelect }) => {
  const cfg = HK_STATUS_CONFIG[room.hk_status] || HK_STATUS_CONFIG.dirty;
  return (
    <div
      className={styles.roomCard}
      style={{ "--status-color": cfg.color, "--status-bg": cfg.bg, "--status-border": cfg.border }}
      onClick={() => onSelect(room)}
      title={`Phòng ${room.room_number} — ${cfg.labelVi}`}
    >
      {/* Top stripe */}
      <div className={styles.roomStripe} style={{ background: cfg.color }} />

      <div className={styles.roomCardInner}>
        <div className={styles.roomTop}>
          <span className={styles.roomNumber}>
            {room.room_number}
          </span>
          <div className={styles.roomFlags}>
            {room.do_not_disturb && (
              <span className={styles.dndBadge} title="Do Not Disturb">🚫</span>
            )}
          </div>
        </div>

        {room.room?.room_type && (
          <span className={styles.roomType}>{room.room.room_type}</span>
        )}

        {/* Status badge */}
        <div className={styles.statusBadge} style={{ color: cfg.color, background: cfg.bg }}>
          <span>{cfg.dot}</span>
          <span>{cfg.label}</span>
        </div>

        {/* FO Status */}
        <div className={`${styles.foStatus} ${room.fo_status === "occupied" ? styles.foOccupied : styles.foVacant}`}>
          <FiUser size={10} />
          <span>{room.fo_status === "occupied" ? "Có khách" : "Trống"}</span>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
