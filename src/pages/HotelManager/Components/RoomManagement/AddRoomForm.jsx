import PropTypes from "prop-types";
import styles from "../../Main/Room/AddRoom.module.css";

const AddRoomForm = ({
  form,
  errors,
  loading,
  hotels,
  hotelsLoading,
  roomAmenities,
  handleInputChange,
  toggleCheckbox,
  handleSubmit,
  onCancel,
  submitLabel = "Create Room",
  loadingLabel = "Creating...",
}) => {
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Hotel Selection */}
      <section className={styles.card}>
        <h3>Select Hotel</h3>
        <p className={styles.smallText}>
          Chọn khách sạn bạn muốn thêm/cập nhật phòng.
        </p>
        <div className={styles.fieldItem}>
          <label htmlFor="hotel_id">Hotel *</label>
          {hotelsLoading ? (
            <p className={styles.smallText}>Loading hotels...</p>
          ) : (
            <select
              id="hotel_id"
              value={form.hotel_id}
              onChange={(e) => handleInputChange("hotel_id", e.target.value)}
              className={!form.hotel_id ? styles.selectPlaceholder : ""}
            >
              <option value="">-- Select a hotel --</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          )}
          {errors.hotel_id && (
            <p className={styles.errorText}>{errors.hotel_id}</p>
          )}
        </div>
      </section>

      {/* Room Details */}
      <section className={styles.card}>
        <h3>Room Details</h3>
        <div className={styles.rowGroup}>
          <div className={styles.fieldItem}>
            <label htmlFor="room_type">Room Type *</label>
            <select
              id="room_type"
              value={form.room_type}
              onChange={(e) => handleInputChange("room_type", e.target.value)}
            >
              <option value="Normal">Normal</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
            </select>
            {errors.room_type && (
              <p className={styles.errorText}>{errors.room_type}</p>
            )}
          </div>
          <div className={styles.fieldItem}>
            <label htmlFor="availability_status">Availability Status</label>
            <select
              id="availability_status"
              value={form.availability_status}
              onChange={(e) =>
                handleInputChange("availability_status", e.target.value)
              }
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        <div className={styles.rowGroup}>
          <div className={styles.fieldItem}>
            <label htmlFor="max_guest">Max Guests *</label>
            <input
              id="max_guest"
              type="number"
              value={form.max_guest}
              onChange={(e) => handleInputChange("max_guest", e.target.value)}
              placeholder="e.g. 2"
              min={1}
            />
            {errors.max_guest && (
              <p className={styles.errorText}>{errors.max_guest}</p>
            )}
          </div>
          <div className={styles.fieldItem}>
            <label htmlFor="price">Price per Night *</label>
            <input
              id="price"
              type="number"
              value={form.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="e.g. 150"
              min={0}
            />
            {errors.price && (
              <p className={styles.errorText}>{errors.price}</p>
            )}
          </div>
          <div className={styles.fieldItem}>
            <label htmlFor="quantity">Quantity *</label>
            <input
              id="quantity"
              type="number"
              value={form.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              placeholder="e.g. 1"
              min={1}
            />
            {errors.quantity && (
              <p className={styles.errorText}>{errors.quantity}</p>
            )}
          </div>
        </div>

        <div className={styles.rowGroup}>
          <div className={styles.fieldItem}>
            <label htmlFor="available_from">Available From</label>
            <input
              id="available_from"
              type="date"
              value={form.available_from}
              onChange={(e) =>
                handleInputChange("available_from", e.target.value)
              }
            />
          </div>
          <div className={styles.fieldItem}>
            <label htmlFor="available_to">Available To</label>
            <input
              id="available_to"
              type="date"
              value={form.available_to}
              onChange={(e) =>
                handleInputChange("available_to", e.target.value)
              }
            />
          </div>
        </div>
      </section>

      {/* Amenities */}
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

      {/* Actions */}
      <div className={styles.actionRow}>
        <button type="submit" className={styles.saveBtn} disabled={loading}>
          {loading ? loadingLabel : submitLabel}
        </button>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

AddRoomForm.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  hotels: PropTypes.array.isRequired,
  hotelsLoading: PropTypes.bool.isRequired,
  roomAmenities: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  toggleCheckbox: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  submitLabel: PropTypes.string,
  loadingLabel: PropTypes.string,
};

export default AddRoomForm;
