import { useState, useEffect } from 'react';
import styles from './StaffModal.module.css';
import { FaTimes } from 'react-icons/fa';
import { validateStaffForm } from '../../Helpers/staffHelpers';
import { IKContext, IKUpload } from 'imagekitio-react';
import { toast } from 'react-toastify';

const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const authenticationEndpoint = import.meta.env.VITE_IMAGEKIT_AUTHENTICATION_ENDPOINT;

const StaffModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const defaultData = {
        name: '',
        age: '',
        address: '',
        email: '',
        phone: '',
        avatar: ''
    };

    const [formData, setFormData] = useState(defaultData);
    const [errors, setErrors] = useState({});
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(defaultData);
        }
        setErrors({});
    }, [initialData, isOpen]);

    const authenticator = async () => {
        try {
            const response = await fetch(authenticationEndpoint);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            const { signature, expire, token } = data;
            return { signature, expire, token };
        } catch (error) {
            throw new Error(`Authentication request failed: ${error.message}`);
        }
    };

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleUploadSuccess = (res) => {
        setIsUploading(false);
        setFormData(prev => ({ ...prev, avatar: res.url }));
        if (errors.avatar) {
            setErrors(prev => ({ ...prev, avatar: null }));
        }
        toast.success("Tải ảnh lên hệ thống thành công!");
    };

    const handleUploadStart = () => {
        setIsUploading(true);
    };

    const handleUploadError = (err) => {
        setIsUploading(false);
        toast.error("Tải ảnh thất bại! Vui lòng thử lại.");
        console.error("Upload error:", err);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const validationErrors = validateStaffForm(formData);
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
                    <h2>{initialData ? 'Edit Staff' : 'Add New Staff'}</h2>
                    <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                        <FaTimes />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.imageUploadSection}>
                        <div className={styles.avatarPreview}>
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Avatar preview" />
                            ) : (
                                <div className={styles.avatarPlaceholder}>No Image</div>
                            )}
                        </div>
                        <IKContext 
                            publicKey={publicKey} 
                            urlEndpoint={urlEndpoint} 
                            authenticator={authenticator}
                        >
                            <div className={styles.uploadGroup}>
                                <label className={styles.uploadBtn}>
                                    {isUploading ? 'Uploading...' : 'Upload Image'}
                                    <IKUpload
                                        fileName="avatar.jpg"
                                        folder="/staff-avatars"
                                        onSuccess={handleUploadSuccess}
                                        onError={handleUploadError}
                                        onUploadStart={handleUploadStart}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                {errors.avatar && <span className={styles.errorText}>{errors.avatar}</span>}
                            </div>
                        </IKContext>
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className={errors.name ? styles.inputError : ''} />
                            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>Age</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} className={errors.age ? styles.inputError : ''} />
                            {errors.age && <span className={styles.errorText}>{errors.age}</span>}
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? styles.inputError : ''} />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Phone Number</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} className={errors.phone ? styles.inputError : ''} />
                        {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className={errors.address ? styles.inputError : ''} />
                        {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                    </div>

                    <div className={styles.actions}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                        <button type="submit" className={styles.submitBtn} disabled={isUploading}>
                            {initialData ? 'Update Staff' : 'Save Staff'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffModal;
