const renderEditField = ({
    field,
    label,
    type = "text",
    editingField,
    formData,
    handleInputChange,
    loading,
    styles
}) => {

    if (editingField !== field) {
        return (
            <div className={styles.infoValue}>
                {formData[field] || `Add your ${label.toLowerCase()}`}
            </div>
        );
    }

    if (type === "select") {
        return (
            <select
                className={styles.editInput}
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                disabled={loading}
            >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
        );
    }

    if (type === "date") {
        return (
            <input
                type="date"
                className={styles.editInput}
                value={formData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                disabled={loading}
            />
        );
    }

    return (
        <input
            type={type}
            className={styles.editInput}
            value={formData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={`Enter your ${label.toLowerCase()}`}
            disabled={loading}
        />
    );
};

export default renderEditField;