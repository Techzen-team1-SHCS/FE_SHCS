import { useState, useEffect } from 'react';
import styles from './StaffModal.module.css';
import { FaTimes } from 'react-icons/fa';
import { validateStaffForm, formatPhoneNumber } from '../../Helpers/staffHelpers';

const StaffModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const defaultData = {
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        contactNumber: ''
    };

    const [formData, setFormData] = useState(defaultData);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(defaultData);
        }
        setErrors({});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error field when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const validationErrors = validateStaffForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Format phone before saving
        const dataToSave = {
            ...formData,
            contactNumber: formatPhoneNumber(formData.contactNumber)
        };

        onSubmit(dataToSave);
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>{initialData ? 'Edit Staff' : 'Add New Staff'}</h2>
                    <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? styles.inputError : ''} />
                        {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? styles.inputError : ''} />
                        {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className={errors.address ? styles.inputError : ''} />
                        {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? styles.inputError : ''} />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label>Contact Number</label>
                        <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className={errors.contactNumber ? styles.inputError : ''} />
                        {errors.contactNumber && <span className={styles.errorText}>{errors.contactNumber}</span>}
                    </div>
                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.submitBtn}>{initialData ? 'Update Staff' : 'Save Staff'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffModal;
