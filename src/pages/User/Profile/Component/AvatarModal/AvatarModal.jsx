import styles from "../../Profile.module.css";

const AvatarModal = ({
  show,
  avatar,
  previewUrl,
  loading,
  selectedFile,
  fileInputRef,
  onClose,
  onFileSelect,
  onSave,
}) => {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Update Profile Photo</h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
            disabled={loading}
          >
            ×
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.avatarPreview}>
            <img
              src={previewUrl || avatar}
              alt="Preview"
              className={styles.previewImage}
            />
          </div>

          <div className={styles.uploadSection}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onFileSelect}
              accept="image/*"
              style={{ display: "none" }}
              disabled={loading}
            />

            <button
              className={styles.uploadBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Choose New Photo"}
            </button>

            <p className={styles.uploadHint}>
              Supported formats: JPG, PNG, GIF • Max size: 5MB
            </p>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            className={styles.removeBtn}
            disabled={
              loading ||
              avatar === "assets/images/avatar/avatar_default.png"
            }
          >
            Remove Current Photo
          </button>

          <div className={styles.actionButtons}>
            <button
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              className={styles.saveBtn}
              onClick={onSave}
              disabled={loading || !selectedFile}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;