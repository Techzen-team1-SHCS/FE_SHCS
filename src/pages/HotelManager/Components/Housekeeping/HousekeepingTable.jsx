import styles from "../../Main/Housekeeping/Housekeeping.module.css";
import { HOUSEKEEPING_TABLE_COLUMNS } from "../../Constants/Housekeeping/housekeepingTableColumns";
import { getScheduleStatusClass } from "../../Helpers/HousekeepingHelpers";
import { FiEye, FiMoreHorizontal } from "react-icons/fi";

const HousekeepingTable = ({ schedules }) => {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {HOUSEKEEPING_TABLE_COLUMNS.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schedules.length === 0 ? (
            <tr>
              <td colSpan={HOUSEKEEPING_TABLE_COLUMNS.length} className={styles.noData}>
                No schedules found
              </td>
            </tr>
          ) : (
            schedules.map((schedule) => {
              const statusClass = getScheduleStatusClass(schedule.status);
              return (
                <tr key={schedule.id}>
                  <td>{schedule.roomNo}</td>
                  <td>{schedule.roomType}</td>
                  <td className={styles.choresCell}>
                    <span title={schedule.chores}>{schedule.chores}</span>
                  </td>
                  <td>
                    <div className={styles.staffInfo}>
                      <div className={styles.staffAvatar}>
                        {schedule.staffAssigned.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span>{schedule.staffAssigned}</span>
                    </div>
                  </td>
                  <td>{schedule.startDate}</td>
                  <td>{schedule.endDate}</td>
                  <td>
                    <span className={`${styles.status} ${styles[statusClass]}`}>
                      {schedule.status}
                    </span>
                  </td>
                  <td>
                    <button className={styles.actionBtn} title="View">
                      <FiEye size={16} />
                    </button>
                    <button className={styles.actionBtn} title="More">
                      <FiMoreHorizontal size={16} />
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

export default HousekeepingTable;
