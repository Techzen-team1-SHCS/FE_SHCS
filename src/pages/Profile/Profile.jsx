import React, { useState, useRef, useEffect } from 'react'
import styles from "./Profile.module.css"
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import EditButton from '../../components/EditButton/EditButton';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../components/Loading/Loader';
import PaymentMethod from '../../components/Payment/PaymentMethod';
import { useSearchParams } from "react-router-dom";

const Profile = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get("tab") || "profile";
    const [activeTab, setActiveTab] = useState(tabFromUrl);
    
    const { user, updateUser } = useContext(AuthContext);
    
    // State cho các trường đang edit
    const [editingField, setEditingField] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        birth: '',
        address: '',
        password: ''
    });
    
    // State cho loading và thông báo
    const [loading, setLoading] = useState(false);
    
    // State cho avatar
    const [avatar, setAvatar] = useState('assets/images/avatar/avatar_default.png');
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    // Hàm xử lý chuyển tab - CẬP NHẬT URL
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSearchParams({ tab: tabId });
    };

    // Hàm xử lý chuyển tab cho header (General, Balance, Security)
    const handleHeaderTabChange = (tabType) => {
        switch(tabType) {
            case 'general':
                setActiveTab('profile');
                setSearchParams({ tab: 'profile' });
                break;
            case 'balance':
                setActiveTab('payment');
                setSearchParams({ tab: 'payment' });
                break;
            case 'security':
                setActiveTab('security');
                setSearchParams({ tab: 'security' });
                break;
            default:
                setActiveTab('profile');
                setSearchParams({ tab: 'profile' });
        }
    };

    // Sync form data và avatar state khi user context thay đổi
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                gender: user.gender || '',
                birth: user.birth || '',
                address: user.address || '',
                password: user.password || ''
            });
            
            const newAvatar = user.image || user.avatar_url || 'assets/images/avatar/avatar_default.png';
            setAvatar(newAvatar);
        }
    }, [user]);

    // Đồng bộ activeTab với URL khi URL thay đổi từ bên ngoài
    useEffect(() => {
        const currentTab = searchParams.get("tab") || "profile";
        if (currentTab !== activeTab) {
            setActiveTab(currentTab);
        }
    }, [searchParams, activeTab]);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: '👤' },
        { id: 'payment', label: 'Payments', icon: '💳' },
        { id: 'security', label: 'Security', icon: '🔒' },
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
            setPreview(URL.createObjectURL(file));
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

    const saveAvatar = async () => {
        if (!selectedFile) {
            toast.error('No image selected');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('avatar', selectedFile);

            await authService.updateProfile(user.id, formData, token);
            const freshUserData = await authService.getUserById(user.id);

            if (!freshUserData) {
                toast.error("Avatar update failed. No user data returned.");
                return;
            }

            if (updateUser) {
                updateUser(freshUserData);
            }

            localStorage.setItem('user', JSON.stringify(freshUserData));
            const newAvatarUrl = freshUserData.image;
            
            if (newAvatarUrl) {
                setAvatar(newAvatarUrl);
            } else {
                setAvatar('assets/images/avatar/avatar_default.png');
            }
            
            setPreview('');
            toast.success('Avatar updated successfully');
            closeAvatarModal();

        } catch (error) {
            console.error('❌ Error in avatar update process:', error);
            toast.error(error?.response?.data?.message || 'Error uploading avatar');
        } finally {
            setLoading(false);
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
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            gender: user?.gender || '',
            birth: user?.birth || '',
            address: user?.address || '',
            password: user?.password || ''
        });
    };

    // Hàm lưu thay đổi profile
    const saveChanges = async (field) => {
        setLoading(true);
        try {
            const updateData = { [field]: formData[field] };
            const token = localStorage.getItem('token');

            await authService.updateProfile(user.id, updateData, token);
            const freshUserData = await authService.getUserById(user.id);

            if (!freshUserData) {
                toast.error("Update failed. No user data returned.");
                return;
            }

            if (updateUser) {
                updateUser(freshUserData);
            }

            localStorage.setItem('user', JSON.stringify(freshUserData));
            toast.success(`${field} updated successfully`);
            setEditingField(null);
            
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            toast.error(error?.response?.data?.message || `Error updating ${field}.`);
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
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
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
                className={styles.cancelBtn}
                onClick={cancelEditing}
                disabled={loading}
            >
                Cancel
            </button>
        </div>
    );

    if(loading){
        return <Loader></Loader>
    }
    
    return (
        <div className={styles.pageWrapper}>
            <div className={styles.layoutContainer}>
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.logo}>
                        <Link to="/">
                            <div className={styles.logoContainer}  style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                                <img src="/assets/images/logos/logo.png" alt="Logo" className={styles.logoImage} style={{marginTop:'30px'}}/>
                            </div>
                        </Link>
                    </div>
                    <nav className={styles.sidebarNav}>
                        {tabs.map(tab => (
                            <div
                                key={tab.id}
                                className={`${styles.navButton} ${activeTab === tab.id ? styles.active : ''}`}
                                onClick={() => handleTabChange(tab.id)}
                            >
                                <span className={styles.tabIcon}>{tab.icon}</span>
                                <span className={styles.tabLabel}>{tab.label}</span>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className={styles.content}>
                    {activeTab === 'profile' && (
                        <div className={styles.profileContainer}>
                            {/* Header */}
                            <div className={styles.headerSection}>
                                <div className={styles.headerContent}>
                                    <div className={styles.headerText}>
                                        <h1 className={styles.headerTitle}>Profile Settings</h1>
                                        <p className={styles.headerSubtitle}>Manage your personal information and preferences</p>
                                    </div>
                                    <div className={styles.headerActions}>
                                        <button className={styles.helpBtn}>
                                            <span>?</span>
                                            <span className={styles.tooltip}>Need help?</span>
                                        </button>
                                        <div className={styles.userAvatar}>
                                            <img
                                                src={preview || avatar}
                                                alt="avatar"
                                                className={styles.avatarImg}
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className={styles.headerTabs}>
                                    <div 
                                        className={`${styles.headerTab} ${activeTab === 'profile' ? styles.activeHeaderTab : ''}`}
                                        onClick={() => handleHeaderTabChange('general')}
                                    >
                                        <span className={styles.tabDot}></span>
                                        General
                                    </div>
                                    <div 
                                        className={`${styles.headerTab} ${activeTab === 'payment' ? styles.activeHeaderTab : ''}`}
                                        onClick={() => handleHeaderTabChange('balance')}
                                    >
                                        <span className={styles.tabDot}></span>
                                        Balance
                                    </div>
                                    <div 
                                        className={`${styles.headerTab} ${activeTab === 'security' ? styles.activeHeaderTab : ''}`}
                                        onClick={() => handleHeaderTabChange('security')}
                                    >
                                        <span className={styles.tabDot}></span>
                                        Security
                                    </div>
                                </div>
                            </div>

                            {/* Profile Content */}
                            <div className={styles.profileContent}>
                                {/* Avatar Section */}
                                <div className={styles.avatarSection}>
                                    <div className={styles.avatarCard}>
                                        <div className={styles.avatarContent}>
                                            <div className={styles.avatarImageContainer}>
                                                <img 
                                                    src={preview || avatar} 
                                                    alt="avatar" 
                                                    className={styles.avatarLarge}
                                                />
                                                <div className={styles.avatarOverlay} onClick={handleEditAvatar}>
                                                    <span>📷</span>
                                                </div>
                                            </div>
                                            <div className={styles.userInfo}>
                                                <h2 className={styles.userName}>{formData.name}</h2>
                                                <p className={styles.userEmail}>{formData.email}</p>
                                                <p className={styles.userSince}>Member since 2024</p>
                                            </div>
                                        </div>
                                        <button className={styles.editAvatarBtn} onClick={handleEditAvatar}>
                                            Edit Photo
                                        </button>
                                    </div>
                                </div>

                                {/* Profile Details */}
                                <div className={styles.detailsGrid}>
                                    {/* Personal Information */}
                                    <div className={styles.detailSection}>
                                        <div className={styles.sectionHeader}>
                                            <div className={styles.sectionIcon}>👤</div>
                                            <h3 className={styles.sectionTitle}>Personal Information</h3>
                                        </div>
                                        <div className={styles.sectionContent}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Full Name</label>
                                                <div className={styles.formField}>
                                                    {renderEditField('name', 'name')}
                                                    {editingField === 'name' ? (
                                                        <EditActions field="name" />
                                                    ) : (
                                                        <EditButton onClick={() => startEditing('name')} />
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Email Address</label>
                                                <div className={styles.formField}>
                                                    {renderEditField('email', 'email', 'email')}
                                                    {editingField === 'email' ? (
                                                        <EditActions field="email" />
                                                    ) : (
                                                        <EditButton onClick={() => startEditing('email')} />
                                                    )}
                                                </div>
                                            </div>

                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Phone Number</label>
                                                <div className={styles.formField}>
                                                    {renderEditField('phone', 'phone number', 'tel')}
                                                    {editingField === 'phone' ? (
                                                        <EditActions field="phone" />
                                                    ) : (
                                                        <EditButton onClick={() => startEditing('phone')} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className={styles.detailSection}>
                                        <div className={styles.sectionHeader}>
                                            <div className={styles.sectionIcon}>📅</div>
                                            <h3 className={styles.sectionTitle}>Additional Information</h3>
                                        </div>
                                        <div className={styles.sectionContent}>
                                            <div className={styles.formRow}>
                                                <div className={styles.formGroup}>
                                                    <label className={styles.formLabel}>Gender</label>
                                                    <div className={styles.formField}>
                                                        {renderEditField('gender', 'gender', 'select')}
                                                        {editingField === 'gender' ? (
                                                            <EditActions field="gender" />
                                                        ) : (
                                                            <EditButton onClick={() => startEditing('gender')} />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className={styles.formGroup}>
                                                    <label className={styles.formLabel}>Date of Birth</label>
                                                    <div className={styles.formField}>
                                                        {renderEditField('birth', 'date of birth', 'date')}
                                                        {editingField === 'birth' ? (
                                                            <EditActions field="birth" />
                                                        ) : (
                                                            <EditButton onClick={() => startEditing('birth')} />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Information */}
                                    <div className={styles.detailSection}>
                                        <div className={styles.sectionHeader}>
                                            <div className={styles.sectionIcon}>🏠</div>
                                            <h3 className={styles.sectionTitle}>Address Information</h3>
                                        </div>
                                        <div className={styles.sectionContent}>
                                            <div className={styles.formGroup}>
                                                <label className={styles.formLabel}>Residential Address</label>
                                                <div className={styles.formField}>
                                                    {renderEditField('address', 'address')}
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
                            </div>
                        </div>
                    )}

                    {activeTab === 'payment' && (
                       <PaymentMethod user={user} />
                    )}

                    {activeTab === 'security' && (
                       <div className={styles.securityContainer}>
                           <div className={styles.securityHeader}>
                               <h1>Security Settings</h1>
                               <p>Manage your password and security preferences</p>
                           </div>
                           <div className={styles.securityContent}>
                               <div className={styles.securityCard}>
                                <div className={styles.securityIcon}>🔐</div>
                                <div className={styles.securityInfo}>
                                    <h3>Password</h3>
                                    <p>Last changed 2 days ago</p>
                                </div>
                                
                                {/* Hiển thị button Change Password khi KHÔNG đang edit */}
                                {editingField !== 'password' ? (
                                    <button 
                                        className={styles.securityBtn}
                                        onClick={() => startEditing('password')}
                                    >
                                        Change Password
                                    </button>
                                ) : (
                                    /* Hiển thị form change password khi ĐANG edit */
                                    <div className={styles.passwordForm}>
                                        <div className={styles.formField}>
                                            <label>Current Password</label>
                                            <input
                                                type="password"
                                                placeholder="Enter current password"
                                                value={formData.currentPassword || ''}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    currentPassword: e.target.value
                                                })}
                                            />
                                        </div>
                                        
                                        <div className={styles.formField}>
                                            <label>New Password</label>
                                            <input
                                                type="password"
                                                placeholder="Enter new password"
                                                value={formData.newPassword || ''}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    newPassword: e.target.value
                                                })}
                                            />
                                        </div>
                                        
                                        <div className={styles.formField}>
                                            <label>Confirm New Password</label>
                                            <input
                                                type="password"
                                                placeholder="Confirm new password"
                                                value={formData.confirmPassword || ''}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    confirmPassword: e.target.value
                                                })}
                                            />
                                        </div>
                                        
                                        {/* Action buttons */}
                                        <div className={styles.formActions}>
                                            <button 
                                                className={styles.saveBtn}
                                                onClick={() => saveChanges('password')}
                                            >
                                                Update Password
                                            </button>
                                            <button 
                                                className={styles.cancelBtn}
                                                onClick={cancelEditing}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}</div>
                               
                               <div className={styles.securityCard}>
                                   <div className={styles.securityIcon}>📱</div>
                                   <div className={styles.securityInfo}>
                                       <h3>Two-Factor Authentication</h3>
                                       <p>Add an extra layer of security</p>
                                   </div>
                                   <button className={styles.securityBtn}>Enable 2FA</button>
                               </div>
                               
                               <div className={styles.securityCard}>
                                   <div className={styles.securityIcon}>🔔</div>
                                   <div className={styles.securityInfo}>
                                       <h3>Login Alerts</h3>
                                       <p>Get notified of new sign-ins</p>
                                   </div>
                                   <button className={styles.securityBtn}>Manage Alerts</button>
                               </div>
                           </div>
                       </div>
                    )}
                </div>
            </div>

            {/* Avatar Modal */}
            {showAvatarModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h3>Update Profile Photo</h3>
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
                                    {loading ? 'Uploading...' : 'Choose New Photo'}
                                </button>
                                <p className={styles.uploadHint}>
                                    Supported formats: JPG, PNG, GIF • Max size: 5MB
                                </p>
                            </div>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.removeBtn}
                                disabled={loading || avatar === 'assets/images/avatar/avatar_default.png'}
                            >
                                Remove Current Photo
                            </button>
                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.cancelBtn}
                                    onClick={closeAvatarModal}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.saveBtn}
                                    onClick={saveAvatar}
                                    disabled={loading || !selectedFile}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
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