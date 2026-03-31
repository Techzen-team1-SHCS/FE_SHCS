import { useState } from "react";
import styles from "../../Main/Room/AddRoom.module.css";
import { FiCheck, FiX, FiHash } from "react-icons/fi";

const QUANTITY_OPTIONS = [5, 10, 15, 20, 25, 50];

const RoomNumberModal = ({ room, onGenerate, onClose, loading }) => {
  const [quantity, setQuantity] = useState(10);
  const [customQty, setCustomQty] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const handleGenerate = () => {
    const qty = useCustom ? Number(customQty) : quantity;
    if (qty > 0 && qty <= 500) {
      onGenerate(qty);
    }
  };

  const selectedQty = useCustom ? Number(customQty) : quantity;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.modalIconWrap}>
            <FiHash size={24} />
          </div>
          <div>
            <h3 className={styles.modalTitle}>Generate Room Numbers</h3>
            <p className={styles.modalSubtitle}>
              Room <strong>{room?.room_type}</strong> created successfully!
              <br />
              How many room numbers would you like to generate?
            </p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        {/* Quantity Grid */}
        <div className={styles.qtySection}>
          <label className={styles.qtyLabel}>Select quantity</label>
          <div className={styles.qtyGrid}>
            {QUANTITY_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`${styles.qtyBtn} ${!useCustom && quantity === opt ? styles.qtyBtnActive : ""}`}
                onClick={() => {
                  setQuantity(opt);
                  setUseCustom(false);
                }}
              >
                {opt}
              </button>
            ))}
            <button
              type="button"
              className={`${styles.qtyBtn} ${useCustom ? styles.qtyBtnActive : ""}`}
              onClick={() => setUseCustom(true)}
            >
              Custom
            </button>
          </div>

          {useCustom && (
            <div className={styles.customQtyWrap}>
              <input
                type="number"
                min={1}
                max={500}
                value={customQty}
                onChange={(e) => setCustomQty(e.target.value)}
                placeholder="Enter quantity (1-500)"
                className={styles.customQtyInput}
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Preview Info */}
        <div className={styles.previewInfo}>
          <div className={styles.previewItem}>
            <span className={styles.previewLabel}>Room Type</span>
            <span className={styles.previewValue}>{room?.room_type}</span>
          </div>
          <div className={styles.previewItem}>
            <span className={styles.previewLabel}>Numbers to generate</span>
            <span className={styles.previewValue}>{selectedQty > 0 ? selectedQty : "—"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.modalSkipBtn}
            onClick={onClose}
            disabled={loading}
          >
            Skip for now
          </button>
          <button
            type="button"
            className={styles.modalGenerateBtn}
            onClick={handleGenerate}
            disabled={loading || selectedQty <= 0 || selectedQty > 500}
          >
            {loading ? (
              <span className={styles.btnSpinner} />
            ) : (
              <FiCheck size={16} />
            )}
            {loading ? "Generating..." : `Generate ${selectedQty > 0 ? selectedQty : ""} rooms`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomNumberModal;
