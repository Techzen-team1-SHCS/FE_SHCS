import { useState, useEffect } from 'react';
import styles from './HousekeepingModal.module.css';
import { staffListMock } from '../../Mock/staffData';
import { 
    HOUSEKEEPING_DEFAULT_FORM_DATA, 
    HOUSEKEEPING_STATUS_OPTIONS, 
    ROOM_TYPE_OPTIONS 
} from '../../Constants/Housekeeping/housekeepingConstants';
import { validateHousekeepingForm } from '../../Helpers/HousekeepingHelpers';

const HousekeepingModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState(HOUSEKEEPING_DEFAULT_FORM_DATA);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(HOUSEKEEPING_DEFAULT_FORM_DATA);
        }
        setErrors({});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateHousekeepingForm(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        onSubmit(formData);
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>{initialData ? 'Edit Housekeeping Schedule' : 'Add New Schedule'}</h2>
                    <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Room No</label>
                            <input 
                                type="text" 
                                name="roomNo" 
                                value={formData.roomNo} 
                                onChange={handleChange} 
                                className={errors.roomNo ? styles.inputError : ''} 
                            />
                            {errors.roomNo && <span className={styles.errorText}>{errors.roomNo}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Room Type</label>
                            <select name="roomType" value={formData.roomType} onChange={handleChange}>
                                {ROOM_TYPE_OPTIONS.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Chores</label>
                        <textarea 
                            name="chores" 
                            value={formData.chores} 
                            onChange={handleChange} 
                            rows={3} 
                            className={errors.chores ? styles.inputError : ''} 
                        />
                        {errors.chores && <span className={styles.errorText}>{errors.chores}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Staff Assigned</label>
                        <select 
                            name="staffAssigned" 
                            value={formData.staffAssigned} 
                            onChange={handleChange}
                            className={errors.staffAssigned ? styles.inputError : ''}
                        >
                            <option value="">Select Staff</option>
                            {staffListMock.map(staff => (
                                <option key={staff.id} value={`${staff.firstName} ${staff.lastName}`}>
                                    {staff.firstName} {staff.lastName}
                                </option>
                            ))}
                        </select>
                        {errors.staffAssigned && <span className={styles.errorText}>{errors.staffAssigned}</span>}
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Start Date</label>
                            <input 
                                type="text" 
                                name="startDate" 
                                value={formData.startDate} 
                                onChange={handleChange} 
                                placeholder="DD/MM/YYYY HH:MM AM" 
                                className={errors.startDate ? styles.inputError : ''}
                            />
                            {errors.startDate && <span className={styles.errorText}>{errors.startDate}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>End Date</label>
                            <input 
                                type="text" 
                                name="endDate" 
                                value={formData.endDate} 
                                onChange={handleChange} 
                                placeholder="DD/MM/YYYY HH:MM PM" 
                                className={errors.endDate ? styles.inputError : ''}
                            />
                            {errors.endDate && <span className={styles.errorText}>{errors.endDate}</span>}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Status</label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            {HOUSEKEEPING_STATUS_OPTIONS.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.submitBtn}>
                            {initialData ? 'Update Schedule' : 'Save Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HousekeepingModal;
