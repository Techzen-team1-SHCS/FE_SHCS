import { useState, useEffect } from "react";
import styles from "./IssueFormModal.module.css";
import { FiX, FiAlertTriangle } from "react-icons/fi";

const IssueFormModal = ({ isOpen, onClose, onSubmit, rooms, staff }) => {
  const [form, setForm] = useState({
    room_number_id: "",
    reported_by: "",
    description: "",
    image_url: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setForm({ room_number_id: "", reported_by: "", description: "", image_url: "" });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.room_number_id) e.room_number_id = "Vui lòng chọn phòng";
    if (!form.description.trim()) e.description = "Vui lòng mô tả sự cố";
    if (form.image_url && !/^https?:\/\//i.test(form.image_url)) {
      e.image_url = "URL ảnh không hợp lệ (phải bắt đầu bằng http/https)";
    }
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
        reported_by: form.reported_by || null,
        image_url: form.image_url || null,
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
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.warningIcon}>
              <FiAlertTriangle size={20} />
            </div>
            <h2 className={styles.title}>Báo cáo sự cố bảo trì</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose}><FiX size={18} /></button>
        </div>

        <p className={styles.subtitle}>
          Phòng sẽ tự động chuyển sang trạng thái <strong>Out of Order</strong> sau khi báo cáo.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Room */}
          <div className={styles.field}>
            <label className={styles.label}>🏠 Phòng gặp sự cố <span className={styles.req}>*</span></label>
            <select
              className={`${styles.select} ${errors.room_number_id ? styles.error : ""}`}
              value={form.room_number_id}
              onChange={(e) => set("room_number_id", e.target.value)}
            >
              <option value="">-- Chọn phòng --</option>
              {rooms.map((hotelGroup) => (
                <optgroup key={hotelGroup.hotel_id} label={hotelGroup.hotel_name}>
                  {hotelGroup.rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      Phòng {r.room_number}
                      {r.room?.room_type ? ` (${r.room.room_type})` : ""}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            {errors.room_number_id && <p className={styles.errMsg}>{errors.room_number_id}</p>}
          </div>

          {/* Staff */}
          <div className={styles.field}>
            <label className={styles.label}>👤 Người báo cáo</label>
            <select
              className={styles.select}
              value={form.reported_by}
              onChange={(e) => set("reported_by", e.target.value)}
            >
              <option value="">-- Chọn nhân viên --</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>📝 Mô tả sự cố <span className={styles.req}>*</span></label>
            <textarea
              className={`${styles.textarea} ${errors.description ? styles.error : ""}`}
              placeholder="VD: Điều hoà không mát, vòi sen bị rỉ nước, bóng đèn phòng tắm bị cháy..."
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
            {errors.description && <p className={styles.errMsg}>{errors.description}</p>}
          </div>

          {/* Image URL */}
          <div className={styles.field}>
            <label className={styles.label}>🖼️ Link ảnh sự cố (tuỳ chọn)</label>
            <input
              type="text"
              className={`${styles.input} ${errors.image_url ? styles.error : ""}`}
              placeholder="https://ik.imagekit.io/..."
              value={form.image_url}
              onChange={(e) => set("image_url", e.target.value)}
            />
            {errors.image_url && <p className={styles.errMsg}>{errors.image_url}</p>}
            {form.image_url && /^https?:\/\//i.test(form.image_url) && (
              <img src={form.image_url} alt="preview" className={styles.preview} />
            )}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Đang gửi..." : "⚠️ Báo cáo sự cố"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueFormModal;
