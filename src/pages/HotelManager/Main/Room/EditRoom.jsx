import { useParams, useNavigate, Link } from "react-router-dom";
import { FiChevronRight, FiEdit3, FiInfo, FiTag, FiClock, FiShield } from "react-icons/fi";
import { useEditRoom } from "../../hooks/useEditRoom";
import styles from "./EditRoom.module.css";

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    form,
    errors,
    loading,
    hotels,
    roomAmenities,
    handleInputChange,
    toggleCheckbox,
    handleSubmit,
  } = useEditRoom(id);

  const onSubmit = async (e) => {
    const success = await handleSubmit(e);
    if (success) {
      navigate("/hotel-manager/rooms");
    }
  };

  const handleCancel = () => {
    navigate("/hotel-manager/rooms");
  };

  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link to="/hotel-manager/rooms" style={{ color: "inherit", textDecoration: "none" }}>Rooms</Link>
        <FiChevronRight size={14} />
        <span>Edit Room #{id}</span>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Optimize Your Room</h1>
          <p>Cập nhật thông tin chi tiết và giá để thu hút nhiều khách hàng hơn.</p>
        </div>
        <div className={styles.idBadge}>UUID: {id}</div>
      </header>

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Updating configuration...</p>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className={styles.mainGrid}>
          {/* Main Content Column */}
          <div className={styles.formColumn}>
            {/* Section 1: Property */}
            <div className={styles.card}>
              <h3><FiInfo size={20} /> Property & Placement</h3>
              <div className={styles.fieldGroup}>
                <div className={`${styles.field} ${styles.fullWidth}`}>
                  <label htmlFor="hotel_id">Select Hotel *</label>
                  <select
                    id="hotel_id"
                    value={form.hotel_id}
                    onChange={(e) => handleInputChange("hotel_id", e.target.value)}
                  >
                    <option value="">-- Choose Hotel --</option>
                    {hotels.map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                  {errors.hotel_id && <span className={styles.error}>{errors.hotel_id}</span>}
                </div>
                
                <div className={styles.field}>
                  <label htmlFor="room_type">Category *</label>
                  <select
                    id="room_type"
                    value={form.room_type}
                    onChange={(e) => handleInputChange("room_type", e.target.value)}
                  >
                    <option value="Normal">Normal</option>
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="max_guest">Max Guests *</label>
                  <input
                    id="max_guest"
                    type="number"
                    value={form.max_guest}
                    onChange={(e) => handleInputChange("max_guest", e.target.value)}
                    min={1}
                  />
                  {errors.max_guest && <span className={styles.error}>{errors.max_guest}</span>}
                </div>
              </div>
            </div>

            {/* Section 2: Pricing */}
            <div className={styles.card}>
              <h3><FiEdit3 size={20} /> Pricing & Inventory</h3>
              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label htmlFor="price">Base Rate / Night *</label>
                  <input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="2,500,000"
                  />
                  {errors.price && <span className={styles.error}>{errors.price}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    id="quantity"
                    type="number"
                    value={form.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    min={1}
                  />
                  {errors.quantity && <span className={styles.error}>{errors.quantity}</span>}
                </div>
              </div>
            </div>

            {/* Section 3: Availability Dates */}
            <div className={styles.card}>
              <h3><FiClock size={20} /> Booking Window</h3>
              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label htmlFor="available_from">Available From</label>
                  <input
                    id="available_from"
                    type="date"
                    value={form.available_from}
                    onChange={(e) => handleInputChange("available_from", e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="available_to">Available To</label>
                  <input
                    id="available_to"
                    type="date"
                    value={form.available_to}
                    onChange={(e) => handleInputChange("available_to", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className={styles.sideColumn}>
            {/* Info Box */}
            <div className={styles.infoCard}>
              <h4><FiShield size={18} /> Pro Tip</h4>
              <p>Rooms with high-quality descriptions and accurate amenities have a 40% higher chance of being booked.</p>
            </div>

            {/* Status Selection */}
            <div className={styles.card} style={{ padding: "24px" }}>
              <h3>Status</h3>
              <div className={styles.field}>
                <select
                  value={form.availability_status}
                  onChange={(e) => handleInputChange("availability_status", e.target.value)}
                  style={{ background: "#f8fafc", fontWeight: "600" }}
                >
                  <option value="available">Active / Available</option>
                  <option value="unavailable">Paused / Private</option>
                </select>
              </div>
            </div>

            {/* Amenities Checklist */}
            <div className={styles.card} style={{ padding: "24px" }}>
              <h3><FiTag size={18} /> Amenities</h3>
              <div className={styles.amenityGrid}>
                {roomAmenities.map((item) => (
                  <label key={item} className={styles.amenityItem}>
                    <input
                      type="checkbox"
                      checked={form.amenities.includes(item)}
                      onChange={() => toggleCheckbox("amenities", item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className={styles.actionBar}>
          <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
            Discard Changes
          </button>
          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {loading ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRoom;
