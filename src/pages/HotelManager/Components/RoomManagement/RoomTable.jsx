import styles from "../../Main/Room/RoomManagement.module.css";
import { ROOM_TABLE_COLUMNS } from "../../Constants/Hotel/roomTableColumns";
import { getRoomStatusClass } from "../../Helpers/RoomHelpers";
import { FiEye, FiMoreHorizontal } from "react-icons/fi";

const RoomTable = ({
  rooms,
  isRoomSelected,
  toggleSelectedRoom,
  selectAll,
  allSelected,
}) => {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => selectAll(e.target.checked)}
              />
            </th>
            {ROOM_TABLE_COLUMNS.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.length === 0 ? (
            <tr>
              <td colSpan={ROOM_TABLE_COLUMNS.length + 1} className={styles.noData}>
                No rooms found
              </td>
            </tr>
          ) : (
            rooms.map((room) => {
              const statusClass = getRoomStatusClass(room.availability);
              return (
                <tr key={room.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isRoomSelected(room.id)}
                      onChange={() => toggleSelectedRoom(room.id)}
                    />
                  </td>
                  <td>{room.roomNo}</td>
                  <td>{room.roomType}</td>
                  <td>{room.capacity}</td>
                  <td>
                    <span className={`${styles.status} ${styles[statusClass]}`}>
                      {room.availability}
                    </span>
                  </td>
                  <td>{room.description}</td>
                  <td>
                    <button className={styles.actionBtn} title="View">
                      <FiEye />
                    </button>
                    <button className={styles.actionBtn} title="More">
                      <FiMoreHorizontal />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoomTable;
