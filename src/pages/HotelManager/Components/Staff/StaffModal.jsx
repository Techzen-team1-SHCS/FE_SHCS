import { useState, useEffect } from 'react';
import styles from './StaffModal.module.css';
import { FaTimes } from 'react-icons/fa';

const StaffModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const defaultData = {
        firstName: '',
        lastName: '',
        address: '',
        email: '',
        contactNumber: ''
    };

    const [formData, setFormData] = useState(defaultData);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(defaultData);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
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
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Contact Number</label>
                        <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
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
