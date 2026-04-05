import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "../../Main/Room/RoomManagement.module.css";
import { ROOM_TABLE_COLUMNS } from "../../Constants/Hotel/roomTableColumns";
import {
  getRoomStatusClass,
  getAvailabilityLabel,
} from "../../Helpers/RoomHelpers";
import { FiEye, FiMoreHorizontal } from "react-icons/fi";
import { formatVND } from "../../../../utils/dateUtils";

const RoomTable = ({
  rooms,
  isRoomSelected,
  toggleSelectedRoom,
  selectAll,
  allSelected,
  onView,
}) => {
  const navigate = useNavigate();
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
              <td
                colSpan={ROOM_TABLE_COLUMNS.length + 1}
                className={styles.noData}
              >
                No rooms found
              </td>
            </tr>
          ) : (
            rooms.map((room) => {
              const statusClass = getRoomStatusClass(room.availability_status);
              const statusLabel = getAvailabilityLabel(
                room.availability_status,
              );
              return (
                <tr key={room.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isRoomSelected(room.id)}
                      onChange={() => toggleSelectedRoom(room.id)}
                    />
                  </td>
                  <td>{room.id}</td>
                  <td>{room.hotel?.name || "-"}</td>
                  <td>{room.room_type || room.roomType}</td>
                  <td>{room.max_guest}</td>
                  <td>{formatVND(room.price) || "-"}</td>
                  <td>
                    <span className={`${styles.status} ${styles[statusClass]}`}>
                      {statusLabel}
                    </span>
                  </td>
                  <td>
                    {(() => {
                      const am = room.amenities;
                      if (!am) return "-";
                      if (Array.isArray(am)) return am.join(", ");
                      if (typeof am === "string" && am.startsWith("[")) {
                        try {
                          const parsed = JSON.parse(am);
                          return Array.isArray(parsed) ? parsed.join(", ") : am;
                        } catch (e) {
                          return e.message;
                        }
                      }
                      return am;
                    })()}
                  </td>
                  <td>
                    <button
                      className={styles.actionBtn}
                      title="View"
                      onClick={() => onView(room.id)}
                    >
                      <FiEye />
                    </button>
                    <button
                      className={styles.actionBtn}
                      title="Edit"
                      onClick={() =>
                        navigate(`/hotel-manager/rooms/edit/${room.id}`)
                      }
                    >
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

RoomTable.propTypes = {
  rooms: PropTypes.array.isRequired,
  isRoomSelected: PropTypes.func.isRequired,
  toggleSelectedRoom: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  allSelected: PropTypes.bool.isRequired,
  onView: PropTypes.func.isRequired,
};

export default RoomTable;
