import styles from "./Hotel.module.css";

export default function Header({ hotel = {}, isEditing = false, editData = {}, onEditDataChange }) {
  return (
    <div className={styles.header}>
      {isEditing ? (
        <>
          <div className={styles.editField}>
            <label className={styles.editLabel}>Tên khách sạn</label>
            <input
              type="text"
              value={editData.name || ''}
              onChange={(e) => onEditDataChange({ ...editData, name: e.target.value })}
              className={styles.editInput}
              placeholder="Nhập tên khách sạn"
            />
          </div>
          <div className={styles.editField}>
            <label className={styles.editLabel}>Tỉnh/Thành phố</label>
            <input
              type="text"
              value={editData.province || ''}
              onChange={(e) => onEditDataChange({ ...editData, province: e.target.value })}
              className={styles.editInput}
              placeholder="Nhập tỉnh/thành phố"
            />
          </div>   
        </>
      ) : (
        <>
          <h2>{hotel?.name || "Hotel Name"}</h2>
          <p>{hotel?.province || "Province"}</p>
        </>
      )}
    </div>
  );
}