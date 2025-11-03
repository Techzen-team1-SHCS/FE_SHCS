import React, { useState, useRef } from 'react'
import styles from "./Profile.module.css"
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import EditButton from '../../components/EditButton/EditButton';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { user, updateUser } = useContext(AuthContext);
    
    // State cho các trường đang edit
    const [editingField, setEditingField] = useState(null);
    const [formData, setFormData] = useState({
        name: user?.name || 'Tran Vi',
        email: user?.email || 'Vit76404@gmail.com',
        phone: user?.phone || 'xxxxxx223',
        gender: user?.gender || 'male',
        dob: user?.dob || '',
        address: user?.address || '256 LeDuan'
    });

    // State cho loading và thông báo
    const [loading, setLoading] = useState(false);

    // State cho avatar
    const [avatar, setAvatar] = useState(user?.avatar_url || 'assets/images/avatar/avatar_default.png');
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: '' },
        { id: 'payment', label: 'Payment method', icon: '' },
        { id: 'security', label: 'Security', icon: '' },
    ];


    // Hàm xử lý chọn file
    const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size should be less than 5MB');
            return;
        }

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);
    }
};

    // Hàm mở modal edit avatar
    const handleEditAvatar = () => {
        setShowAvatarModal(true);
    };

    // Hàm đóng modal
    const closeAvatarModal = () => {
        setShowAvatarModal(false);
        setSelectedFile(null);
        setPreviewUrl('');
    };

    // Hàm upload avatar lên server
    const saveAvatar = async () => {
    if (!selectedFile) {
        closeAvatarModal();
        return;
    }

    setLoading(true);
    try {
        const response = await authService.uploadAvatar(user.id, selectedFile);
        
        if (response.status === 200) {
            const newAvatarUrl = response.data.avatar_url;
            setAvatar(newAvatarUrl);
            
            // Cập nhật context
            if (updateUser) {
                updateUser({ avatar_url: newAvatarUrl });
            }

            // Cập nhật localStorage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, avatar_url: newAvatarUrl };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            toast.success('Avatar updated successfully');
        } else {
            toast.error(response.message || 'Failed to upload avatar');
        }
    } catch (error) {
        console.error('Error uploading avatar:', error);
        toast.error('Error uploading avatar. Please try again.');
    } finally {
        setLoading(false);
        closeAvatarModal();
    }
};

    // Hàm xóa avatar
    const removeAvatar = async () => {
    setLoading(true);
    try {
        const response = await authService.removeAvatar(user.id);
        
        if (response.status === 200) {
            const defaultAvatar = 'assets/images/avatar/avatar_default.png';
            setAvatar(defaultAvatar);
            
            // Cập nhật context
            if (updateUser) {
                updateUser({ avatar_url: defaultAvatar });
            }

            // Cập nhật localStorage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, avatar_url: defaultAvatar };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            toast.success('Avatar removed successfully');
        } else {
            toast.error(response.message || 'Failed to remove avatar');
        }
    } catch (error) {
        console.error('Error removing avatar:', error);
        toast.error('Error removing avatar. Please try again.');
    } finally {
        setLoading(false);
        closeAvatarModal();
    }
};

    // Hàm bắt đầu edit các trường
    const startEditing = (field) => {
        setEditingField(field);
    };

    // Hàm hủy edit
    const cancelEditing = () => {
        setEditingField(null);
        setFormData({
            name: user?.name || 'Tran Vi',
            email: user?.email || 'Vit76404@gmail.com',
            phone: user?.phone || 'xxxxxx223',
            gender: user?.gender || 'male',
            dob: user?.dob || '',
            address: user?.address || '256 LeDuan'
        });
    };

    // Hàm lưu thay đổi profile
    const saveChanges = async (field) => {
    setLoading(true);
    try {
        const updateData = { [field]: formData[field] };
        const response = await authService.updateProfile(user.id, updateData);
        
        if (response.status === 200) {
            const updatedUser = response.data.user;
            
            // Cập nhật context
            if (updateUser) {
                updateUser(updatedUser);
            }

            // Cập nhật localStorage
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const newUser = { ...currentUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(newUser));

            toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
            setEditingField(null);
        } else {
            toast.error(response.message || `Failed to update ${field}`);
        }
    } catch (error) {
        console.error(`Error updating ${field}:`, error);
        toast.error(`Error updating ${field}. Please try again.`);
    } finally {
        setLoading(false);
    }
};

    // Hàm xử lý thay đổi input
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Component hiển thị input/select tùy theo trường
    const renderEditField = (field, label, type = 'text') => {
        if (editingField !== field) {
            return (
                <div className={styles.infoValue}>
                    {formData[field] || `Add your ${label.toLowerCase()}`}
                </div>
            );
        }

        if (type === 'select') {
            return (
                <select
                    className={styles.editInput}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    disabled={loading}
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
            );
        }

        if (type === 'date') {
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

    // Component nút Save và Cancel
    const EditActions = ({ field }) => (
        <div className={styles.editActions}>
            <button
                className={styles.saveBtn}
                onClick={() => saveChanges(field)}
                disabled={loading}
            >
                {loading ? 'Saving...' : 'Save'}
            </button>
            <button
                className={styles.saveBtn}
                onClick={cancelEditing}
                disabled={loading}
            >
                Cancel
            </button>
        </div>
    );

    return (
        <div className='page-wrapper'>
            <div className={styles.layoutContainer}>
                <div className={styles.sidebar}>
                    <div className={styles.logo}>
                        <Link to="/">
                            <img src="/assets/images/logos/logo.png" alt="Logo" title="Logo" />
                        </Link>
                    </div>
                    <nav className={styles.sidebarNav}>
                        {tabs.map(tab => (
                            <div
                                key={tab.id}
                                className={`${styles.navButton} ${activeTab === tab.id ? styles.active : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className={styles.tabIcon}>{tab.icon}</span>
                                {tab.label}
                            </div>
                        ))}
                    </nav>
                </div>
                <div className={styles.content}>
                    {activeTab === 'profile' &&
                        <div className={styles.profileContainer}>
                            <div className={styles.headerContainer}>
                                <div className={styles.profileHeader}>
                                    <div className={styles.headerTitle}>Profile</div>
                                    <div className={styles.headerGroup}>
                                        <button className={styles.helpBtn}>?</button>
                                        <img
                                            src={avatar}
                                            alt="avatar"
                                            className="rounded-circle"
                                            width={60}
                                            height={60}
                                        />
                                    </div>
                                </div>
                                <div className={styles.general}>General</div>
                            </div>
                            <div className={styles.profileSection}>
                                <div className={styles.contactInfo}>
                                    {/* Avatar Section */}
                                    <div className={styles.avatarSection}>
                                        <div className={styles.avatarcontainer}>
                                            <div className={styles.avatarGroup}>
                                                <img src={avatar}
                                                    alt="avatar"
                                                    className="rounded-circle"
                                                    width={80}
                                                    height={80}
                                                />
                                                <div className={styles.userNamegroup}>
                                                    <div className={styles.userName}>{formData.name}</div>
                                                    <div>{formData.email}</div>
                                                </div>
                                            </div>
                                            <EditButton onClick={handleEditAvatar} />
                                        </div>
                                    </div>

                                    {/* Contact Info Section */}
                                    <div className={styles.userInfo}>
                                        <div className={styles.sectionHeader}>
                                            <h3 className={styles.sectionTitle}>Contact info</h3>
                                        </div>
                                        <div className={styles.infoGroup}>
                                            <div className={styles.infoItem}>
                                                <div className={styles.infoContent}>
                                                    <label className={styles.infoLabel}>Name</label>
                                                    {renderEditField('name', 'name')}
                                                </div>
                                                {editingField === 'name' ? (
                                                    <EditActions field="name" />
                                                ) : (
                                                    <EditButton onClick={() => startEditing('name')} />
                                                )}
                                            </div>

                                            <div className={styles.infoItem}>
                                                <div className={styles.infoContent}>
                                                    <label className={styles.infoLabel}>Email address</label>
                                                    {renderEditField('email', 'email', 'email')}
                                                </div>
                                                {editingField === 'email' ? (
                                                    <EditActions field="email" />
                                                ) : (
                                                    <EditButton onClick={() => startEditing('email')} />
                                                )}
                                            </div>

                                            <div className={styles.infoItem}>
                                                <div className={styles.infoContent}>
                                                    <label className={styles.infoLabel}>Phone number</label>
                                                    {renderEditField('phone', 'phone number', 'tel')}
                                                </div>
                                                {editingField === 'phone' ? (
                                                    <EditActions field="phone" />
                                                ) : (
                                                    <EditButton onClick={() => startEditing('phone')} />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.infoRow}>
                                        <div className={styles.infoItem}>
                                            <div className={styles.infoContent}>
                                                <label className={styles.infoLabel}>Gender</label>
                                                {renderEditField('gender', 'gender', 'select')}
                                            </div>
                                            {editingField === 'gender' ? (
                                                <EditActions field="gender" />
                                            ) : (
                                                <EditButton onClick={() => startEditing('gender')} />
                                            )}
                                        </div>

                                        <div className={styles.infoItem}>
                                            <div className={styles.infoContent}>
                                                <label className={styles.infoLabel}>Date of birth</label>
                                                {renderEditField('dob', 'date of birth', 'date')}
                                            </div>
                                            {editingField === 'dob' ? (
                                                <EditActions field="dob" />
                                            ) : (
                                                <EditButton onClick={() => startEditing('dob')} />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.divider}></div>

                                <div className={styles.addressInfo}>
                                    <div className={styles.sectionHeader}>
                                        <h3 className={styles.sectionTitle}>Address</h3>
                                    </div>
                                    <div className={styles.infoGroup}>
                                        <div className={styles.infoItem}>
                                            <div className={styles.infoContent}>
                                                <label className={styles.infoLabel}>Residential address</label>
                                                {renderEditField('address', 'address')}
                                            </div>
                                            {editingField === 'address' ? (
                                                <EditActions field="address" />
                                            ) : (
                                                <EditButton onClick={() => startEditing('address')} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>

            {/* Modal Edit Avatar */}
            {showAvatarModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.avatarModal}>
                        <div className={styles.modalHeader}>
                            <h3>Edit Profile Photo</h3>
                            <button
                                className={styles.closeButton}
                                onClick={closeAvatarModal}
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
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    disabled={loading}
                                />

                                <button
                                    className={styles.uploadBtn}
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={loading}
                                >
                                    {loading ? 'Uploading...' : 'Choose Photo'}
                                </button>

                                <p className={styles.uploadHint}>
                                    Supported formats: JPG, PNG, GIF • Max size: 5MB
                                </p>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.removeBtn}
                                onClick={removeAvatar}
                                disabled={loading || avatar === 'assets/images/avatar/avatar_default.png'}
                            >
                                {loading ? 'Removing...' : 'Remove Photo'}
                            </button>
                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.cancelModalBtn}
                                    onClick={closeAvatarModal}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.saveModalBtn}
                                    onClick={saveAvatar}
                                    disabled={loading || (!selectedFile && previewUrl === '')}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profile