import { useState, useEffect } from "react";
import {
  TASK_TYPE_CONFIG,
  PRIORITY_CONFIG,
} from "../../Constants/Housekeeping/housekeepingConstants";
import styles from "./TaskFormModal.module.css";
import { FiX } from "react-icons/fi";

const TASK_TYPES = Object.keys(TASK_TYPE_CONFIG);
const PRIORITIES = Object.keys(PRIORITY_CONFIG);

const TaskFormModal = ({ isOpen, onClose, onSubmit, rooms, staff, editTask }) => {
  const [form, setForm] = useState({
    room_number_id: "",
    assigned_to: "",
    task_type: "stay-over",
    priority: "normal",
    scheduled_date: new Date().toISOString().split("T")[0],
    notes: "",
    task_status: "pending",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTask) {
      setForm({
        room_number_id: editTask.room_number_id || "",
        assigned_to: editTask.assigned_to || "",
        task_type: editTask.task_type || "stay-over",
        priority: editTask.priority || "normal",
        scheduled_date: editTask.scheduled_date || new Date().toISOString().split("T")[0],
        notes: editTask.notes || "",
        task_status: editTask.task_status || "pending",
      });
    } else {
      setForm({
        room_number_id: "",
        assigned_to: "",
        task_type: "stay-over",
        priority: "normal",
        scheduled_date: new Date().toISOString().split("T")[0],
        notes: "",
        task_status: "pending",
      });
    }
    setErrors({});
  }, [editTask, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.room_number_id) e.room_number_id = "Vui lòng chọn phòng";
    if (!form.scheduled_date) e.scheduled_date = "Vui lòng chọn ngày";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        assigned_to: form.assigned_to || null,
      };
      await onSubmit(payload);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {editTask ? "✏️ Chỉnh sửa nhiệm vụ" : "➕ Tạo nhiệm vụ mới"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}><FiX size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Room */}
          <div className={styles.field}>
            <label className={styles.label}>🏠 Phòng <span className={styles.req}>*</span></label>
            <select
              className={`${styles.select} ${errors.room_number_id ? styles.error : ""}`}
              value={form.room_number_id}
              onChange={(e) => set("room_number_id", e.target.value)}
            >
              <option value="">-- Chọn phòng --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Phòng {r.room_number}
                  {r.room?.room_type ? ` (${r.room.room_type})` : ""}
                  {r.do_not_disturb ? " 🚫DND" : ""}
                </option>
              ))}
            </select>
            {errors.room_number_id && <p className={styles.errMsg}>{errors.room_number_id}</p>}
          </div>

          {/* Staff */}
          <div className={styles.field}>
            <label className={styles.label}>👤 Phân công nhân viên</label>
            <select
              className={styles.select}
              value={form.assigned_to}
              onChange={(e) => set("assigned_to", e.target.value)}
            >
              <option value="">-- Chưa phân công --</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Row: Task type + Priority */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>🧹 Loại công việc</label>
              <select
                className={styles.select}
                value={form.task_type}
                onChange={(e) => set("task_type", e.target.value)}
              >
                {TASK_TYPES.map((t) => {
                  const cfg = TASK_TYPE_CONFIG[t];
                  return (
                    <option key={t} value={t}>
                      {cfg.icon} {cfg.labelVi}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>⚡ Độ ưu tiên</label>
              <select
                className={styles.select}
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
              >
                {PRIORITIES.map((p) => {
                  const cfg = PRIORITY_CONFIG[p];
                  return (
                    <option key={p} value={p}>{cfg.label}</option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Row: Date + Status */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>📅 Ngày thực hiện <span className={styles.req}>*</span></label>
              <input
                type="date"
                className={`${styles.input} ${errors.scheduled_date ? styles.error : ""}`}
                value={form.scheduled_date}
                onChange={(e) => set("scheduled_date", e.target.value)}
              />
              {errors.scheduled_date && <p className={styles.errMsg}>{errors.scheduled_date}</p>}
            </div>

            {editTask && (
              <div className={styles.field}>
                <label className={styles.label}>📊 Trạng thái</label>
                <select
                  className={styles.select}
                  value={form.task_status}
                  onChange={(e) => set("task_status", e.target.value)}
                >
                  <option value="pending">⏳ Chờ làm</option>
                  <option value="in-progress">🔄 Đang làm</option>
                  <option value="completed">✅ Hoàn thành</option>
                  <option value="skipped">⏭️ Bỏ qua</option>
                </select>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className={styles.field}>
            <label className={styles.label}>💬 Ghi chú (tuỳ chọn)</label>
            <textarea
              className={styles.textarea}
              placeholder="VD: Khách yêu cầu thêm 2 gối, thay khăn tắm..."
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting
                ? "Đang lưu..."
                : editTask
                ? "💾 Lưu thay đổi"
                : "✅ Tạo nhiệm vụ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
