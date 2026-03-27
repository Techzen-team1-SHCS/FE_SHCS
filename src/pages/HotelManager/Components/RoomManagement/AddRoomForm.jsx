import styles from "../../Main/Room/AddRoom.module.css";

const AddRoomForm = ({
  form,
  errors,
  successMessage,
  roomAmenities,
  roomAccessibility,
  handleInputChange,
  handleUpload,
  removeImage,
  toggleCheckbox,
  handleSubmit,
  onCancel,
}) => {
  return (
    <form className={styles.form} onSubmit={(e) => handleSubmit(e, onCancel)}>
      <section className={styles.card}>
        <h3>Room Picture</h3>
        <p className={styles.smallText}>
          Tải lên ảnh phòng để hiển thị tốt hơn trong quản lý.
        </p>
        <div className={styles.imageGrid}>
          <label className={styles.uploadBox}>
            <span>Add image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => handleUpload(event.target.files)}
            />
          </label>
        </div>

        <div className={styles.previewBox}>
          {form.images.length === 0 ? (
            <span className={styles.previewPlaceholder}>
              No images selected
            </span>
          ) : (
            form.images.map((img, index) => (
              <div key={index} className={styles.imageItem}>
                <img src={img.preview} alt={`room-${index + 1}`} />
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeImage(index)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className={styles.card}>
        <h3>Room Details</h3>
        <div className={styles.rowGroup}>
          <div className={styles.fieldItem}>
            <label>Room number *</label>
            <input
              value={form.roomNo}
              onChange={(e) => handleInputChange("roomNo", e.target.value)}
              placeholder="room number"
            />
            {errors.roomNo && (
              <p className={styles.errorText}>{errors.roomNo}</p>
            )}
          </div>
          <div className={styles.fieldItem}>
            <label>Reservation status *</label>
            <select
              value={form.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
            >
              <option value="Vacant">Vacant</option>
              <option value="Reserved">Reserved</option>
              <option value="Occupied">Occupied</option>
              <option value="Cleaning">Cleaning</option>
            </select>
          </div>
        </div>
        <div className={styles.fieldItem}>
          <label>Room type *</label>
          <select
            value={form.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
          >
            <option value="Deluxe">Deluxe</option>
            <option value="Standard">Standard</option>
            <option value="Luxury">Luxury</option>
          </select>
        </div>
        <div className={styles.rowGroup}>
          <div className={styles.fieldItem}>
            <label>Room capacity *</label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => handleInputChange("capacity", e.target.value)}
              placeholder="2-4 guests"
              min={1}
            />
            {errors.capacity && (
              <p className={styles.errorText}>{errors.capacity}</p>
            )}
          </div>
          <div className={styles.fieldItem}>
            <label>Room price per night *</label>
            <input
              type="number"
              value={form.pricePerNight}
              onChange={(e) =>
                handleInputChange("pricePerNight", e.target.value)
              }
              placeholder="$ price"
              min={0}
            />
            {errors.pricePerNight && (
              <p className={styles.errorText}>{errors.pricePerNight}</p>
            )}
          </div>
        </div>

        <div className={styles.fieldItemWide}>
          <label>Room description *</label>
          <textarea
            value={form.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="room description"
            rows={4}
          />
          {errors.description && (
            <p className={styles.errorText}>{errors.description}</p>
          )}
        </div>
      </section>

      <section className={styles.card}>
        <h3>Amenities</h3>
        <p className={styles.smallText}>Chọn tất cả các tiện nghi có sẵn.</p>
        <div className={styles.checkboxGrid}>
          {roomAmenities.map((item) => (
            <label key={item} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={form.amenities.includes(item)}
                onChange={() => toggleCheckbox("amenities", item)}
              />
              {item}
            </label>
          ))}
        </div>
      </section>

      <section className={styles.card}>
        <h3>Accessibility Features</h3>
        <p className={styles.smallText}>
          Hỗ trợ khả năng tiếp cận cho khách hàng.
        </p>
        <div className={styles.checkboxGrid}>
          {roomAccessibility.map((item) => (
            <label key={item} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={form.accessibility.includes(item)}
                onChange={() => toggleCheckbox("accessibility", item)}
              />
              {item}
            </label>
          ))}
        </div>
      </section>

      {successMessage && <p className={styles.successText}>{successMessage}</p>}

      <div className={styles.actionRow}>
        <button type="submit" className={styles.saveBtn}>
          Save Changes
        </button>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddRoomForm;
