import { FiUsers, FiZap } from "react-icons/fi";
import { TASK_STATUS_CONFIG } from "../../Constants/Housekeeping/housekeepingConstants";
import styles from "../../Main/Housekeeping/Housekeeping.module.css";

const TaskFilterBar = ({ taskFilters, handleTaskFilterChange, staff, tasksMeta, tasks }) => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterBarLeft}>
        <div className={styles.statusPills}>
          <button
            className={`${styles.pill} ${taskFilters.status === "" ? styles.pillActive : ""}`}
            onClick={() => handleTaskFilterChange("status", "")}
          >
            Tất cả
          </button>
          {Object.entries(TASK_STATUS_CONFIG).map(([k, v]) => (
            <button
              key={k}
              className={`${styles.pill} ${taskFilters.status === k ? styles.pillActive : ""}`}
              style={
                taskFilters.status === k
                  ? { background: v.bg, color: v.color, borderColor: v.color }
                  : {}
              }
              onClick={() => handleTaskFilterChange("status", taskFilters.status === k ? "" : k)}
            >
              {v.labelVi}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.filterBarRight}>
        <div className={styles.filterField}>
          <FiUsers size={13} className={styles.filterIcon} />
          <select
            className={styles.filterDropdown}
            value={taskFilters.staff_id}
            onChange={(e) => handleTaskFilterChange("staff_id", e.target.value)}
          >
            <option value="">Nhân viên</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterField}>
          <FiZap size={13} className={styles.filterIcon} />
          <select
            className={styles.filterDropdown}
            value={taskFilters.priority}
            onChange={(e) => handleTaskFilterChange("priority", e.target.value)}
          >
            <option value="">Ưu tiên</option>
            <option value="urgent">🔴 Khẩn cấp</option>
            <option value="high">🟠 Cao</option>
            <option value="normal">🔵 Bình thường</option>
            <option value="low">⚪ Thấp</option>
          </select>
        </div>

        <span className={styles.countBadge}>
          {tasksMeta.total ?? tasks.length} tasks
        </span>
      </div>
    </div>
  );
};

export default TaskFilterBar;
