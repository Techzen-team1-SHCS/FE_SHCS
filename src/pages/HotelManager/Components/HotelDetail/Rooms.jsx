import styles from "./Hotel.module.css";

export default function Rooms({ rooms = [] }) {
  return (
    <div className={styles.rooms}>
      <div className={styles.roomHeader}>
        <h3>Type Room</h3>
        <button
          className={styles.addRoomBtn}
          onClick={() => alert("Add new room clicked")}
        >
          + Add new room
        </button>
      </div>
      <div className={styles.roomList}>
        {rooms && rooms.length > 0 ? (
          rooms.map((r) => (
            <div key={r.id} className={styles.roomItem}>
              <span>{r.name}</span>
              <span>${r.price}</span>
            </div>
          ))
        ) : (
          <p>Không có phòng</p>
        )}
      </div>
    </div>
  );
}