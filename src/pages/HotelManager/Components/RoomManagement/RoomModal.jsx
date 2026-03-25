import { useState } from "react";
import styles from "./RoomModal.module.css";

const RoomModal = ({ isOpen, onClose, room, onSave, mode }) => {
  const [formData, setFormData] = useState({
    roomNo: room?.roomNo || "",
    roomType: room?.roomType || "Standard",
    capacity: room?.capacity || 2,
    availability: room?.availability || "Vacant",
    description: room?.description || "",
    price: room?.price || "",
    amenities: room?.amenities || []
  });

  const [errors, setErrors] = useState({});

  const roomTypes = ["Standard", "Deluxe", "Suite", "Executive", "Presidential"];
  const availabilities = ["Vacant", "Occupied", "Reserved", "Dirty", "Out of stock", "Pending"];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.roomNo.trim()) {
      newErrors.roomNo = "Room number is required";
    } else if (!/^\d+$/.test(formData.roomNo)) {
      newErrors.roomNo = "Room number must be numeric";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.capacity < 1) {
      newErrors.capacity = "Capacity must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        id: room?.id || Date.now(),
        price: parseFloat(formData.price)
      });
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{mode === "add" ? "Add New Room" : "Edit Room"}</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Room Number *</label>
              <input
                type="text"
                value={formData.roomNo}
                onChange={(e) => handleChange("roomNo", e.target.value)}
                className={errors.roomNo ? styles.error : ""}
                placeholder="e.g., 101"
              />
              {errors.roomNo && <span className={styles.errorText}>{errors.roomNo}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Room Type</label>
              <select
                value={formData.roomType}
                onChange={(e) => handleChange("roomType", e.target.value)}
              >
                {roomTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Capacity</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.capacity}
                onChange={(e) => handleChange("capacity", parseInt(e.target.value))}
                className={errors.capacity ? styles.error : ""}
              />
              {errors.capacity && <span className={styles.errorText}>{errors.capacity}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Status</label>
              <select
                value={formData.availability}
                onChange={(e) => handleChange("availability", e.target.value)}
              >
                {availabilities.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Price per Night ($)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className={errors.price ? styles.error : ""}
              placeholder="e.g., 120.00"
            />
            {errors.price && <span className={styles.errorText}>{errors.price}</span>}
          </div>

          <div className={styles.formGroup}>
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={errors.description ? styles.error : ""}
              rows="3"
              placeholder="Describe the room features, amenities, etc."
            />
            {errors.description && <span className={styles.errorText}>{errors.description}</span>}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn}>
              {mode === "add" ? "Add Room" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;