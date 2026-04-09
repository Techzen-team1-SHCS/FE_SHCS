import { useState } from "react";
import {
  TASK_STATUS_CONFIG,
  TASK_TYPE_CONFIG,
  PRIORITY_CONFIG,
  HK_STATUS_CONFIG,
} from "../../Constants/Housekeeping/housekeepingConstants";
import styles from "./TaskBoardView.module.css";
import {
  FiEdit2,
  FiTrash2,
  FiUser,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import { formatDateTime } from "../../../../utils/dateUtils";

const COLUMNS = ["pending", "in-progress", "completed", "skipped"];

const TaskCard = ({ task, onUpdateStatus, onEdit, onDelete }) => {
  const cfg = TASK_STATUS_CONFIG[task.task_status] || {};
  const pCfg = PRIORITY_CONFIG[task.priority] || {};
  const typeCfg = TASK_TYPE_CONFIG[task.task_type] || {};
  const hkCfg = HK_STATUS_CONFIG[task.room_number?.hk_status] || {};

  const dnd = task.room_number?.do_not_disturb;

  return (
    <div
      className={styles.card}
      data-priority={task.priority}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
      }}
    >
      {/* Header */}
      <div className={styles.cardHeader}>
        <div className={styles.roomBadge}>
          <span className={styles.roomNo}>
            Room {task.room_number?.room_number || "—"}
          </span>
          <span className={styles.roomType}>
            Type: {task.room_number?.room?.room_type || ""}
          </span>
        </div>
        <div className={styles.cardActions}>
          <button
            className={styles.iconBtn}
            onClick={() => onEdit(task)}
            title="Chỉnh sửa"
          >
            <FiEdit2 size={13} />
          </button>
          <button
            className={styles.iconBtn}
            onClick={() => onDelete(task.id)}
            title="Xóa"
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      </div>

      {/* Task type */}
      <div className={styles.taskType}>
        <span>{typeCfg.icon}</span>
        <span>{typeCfg.labelVi || task.task_type}</span>
      </div>

      {/* Priority + DND */}
      <div className={styles.badges}>
        <span
          className={styles.badge}
          style={{ background: pCfg.bg, color: pCfg.color }}
        >
          {task.priority === "urgent" && <FiAlertCircle size={11} />}
          {pCfg.label || task.priority}
        </span>
        {dnd && (
          <span className={styles.dndBadge} title="Do Not Disturb">
            🚫 DND
          </span>
        )}
        {task.room_number?.hk_status && (
          <span
            className={styles.badge}
            style={{
              background: hkCfg.bg,
              color: hkCfg.color,
              fontSize: "10px",
            }}
          >
            {hkCfg.dot} {hkCfg.label}
          </span>
        )}
      </div>

      {/* Staff */}
      <div className={styles.staffRow}>
        <FiUser size={12} className={styles.icon} />
        {task.assigned_staff ? (
          <div className={styles.staffInfo}>
            {task.assigned_staff.avatar ? (
              <img
                src={task.assigned_staff.avatar}
                alt=""
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarInitial}>
                {task.assigned_staff.name?.[0]?.toUpperCase()}
              </div>
            )}
            <span>{task.assigned_staff.name}</span>
          </div>
        ) : (
          <span className={styles.unassigned}>Chưa phân công</span>
        )}
      </div>

      {/* Date */}
      <div className={styles.dateRow}>
        <FiClock size={12} className={styles.icon} />
        <span>{formatDateTime(task.scheduled_date)}</span>
        {task.completed_at && (
          <span className={styles.completedAt}>
            ✓{" "}
            {new Date(task.completed_at).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>

      {/* Notes */}
      {task.notes && (
        <p className={styles.notes} title={task.notes}>
          💬 {task.notes}
        </p>
      )}

      {/* Status Transition buttons */}
      <div className={styles.statusBtns}>
        {COLUMNS.filter((s) => s !== task.task_status).map((s) => {
          const sCfg = TASK_STATUS_CONFIG[s];
          return (
            <button
              key={s}
              className={styles.transitionBtn}
              style={{ borderColor: sCfg.color, color: sCfg.color }}
              onClick={() => onUpdateStatus(task.id, s)}
              title={`Chuyển sang ${sCfg.labelVi}`}
            >
              → {sCfg.labelVi}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const TaskBoardView = ({
  tasks,
  loadingTasks,
  onUpdateStatus,
  onEdit,
  onDelete,
}) => {
  const [collapsed, setCollapsed] = useState({});
  const [dragOverCol, setDragOverCol] = useState(null);

  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col] = tasks.filter((t) => t.task_status === col);
    return acc;
  }, {});

  return (
    <div className={styles.board}>
      {COLUMNS.map((col) => {
        const cfg = TASK_STATUS_CONFIG[col];
        const items = grouped[col];
        const isCollapsed = collapsed[col];

        return (
          <div key={col} className={styles.column}>
            <div
              className={styles.columnHeader}
              style={{ borderTopColor: cfg.color }}
              onClick={() =>
                setCollapsed((prev) => ({ ...prev, [col]: !prev[col] }))
              }
            >
              <div className={styles.colTitle}>
                <span
                  className={styles.colDot}
                  style={{ background: cfg.color }}
                />
                <span style={{ color: cfg.color }}>{cfg.labelVi}</span>
              </div>
              <span className={styles.colCount}>{items.length}</span>
              <span className={styles.colToggle}>
                {isCollapsed ? "▼" : "▲"}
              </span>
            </div>

            {!isCollapsed && (
              <div
                className={styles.columnBody}
                style={
                  dragOverCol === col
                    ? {
                        backgroundColor: cfg.bg,
                        outline: `2px dashed ${cfg.color}`,
                        outlineOffset: "-4px",
                      }
                    : {}
                }
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverCol !== col) setDragOverCol(col);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  if (e.currentTarget.contains(e.relatedTarget)) return;
                  setDragOverCol(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverCol(null);
                  const taskId = e.dataTransfer.getData("text/plain");
                  if (taskId) {
                    const task = tasks.find((t) => t.id == taskId);
                    if (task && task.task_status !== col) {
                      onUpdateStatus(taskId, col);
                    }
                  }
                }}
              >
                {loadingTasks ? (
                  <div className={styles.skeleton}>
                    {[1, 2].map((i) => (
                      <div key={i} className={styles.skeletonCard} />
                    ))}
                  </div>
                ) : items.length === 0 ? (
                  <div className={styles.empty}>Không có nhiệm vụ</div>
                ) : (
                  items.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdateStatus={onUpdateStatus}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TaskBoardView;
