import React from "react";
import LoaderButton from "../../../../../components/Loading/LoaderButton";
import styles from "../../Profile.module.css";

const EditFieldActions = ({ field, loading, onSave, onCancel }) => {
  return (
    <div className={styles.editActions}>
      <button
        className={styles.saveBtn}
        onClick={() => onSave(field)}
        disabled={loading}
      >
        {loading ? <LoaderButton /> : "Save"}
      </button>

      <button
        className={styles.cancelBtn}
        onClick={onCancel}
        disabled={loading}
      >
        Cancel
      </button>
    </div>
  );
};

export default EditFieldActions;