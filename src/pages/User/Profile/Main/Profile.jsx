import { useState, useEffect } from 'react'
import styles from "../Profile.module.css"
import { useContext } from 'react';
import { AuthContext } from '../../../../contexts/AuthContext';
import Loader from '../../../../components/Loading/Loader';
import EditButton from '../../../../components/EditButton/EditButton';
import 'react-toastify/dist/ReactToastify.css';
import PaymentMethod from '../Component/PaymentMethod/PaymentMethod';
import { useSearchParams } from "react-router-dom";
import { tabs } from '../Constants/ProfileTab';
import { useProfile } from "../Hooks/useProfile";
import EditFieldActions from "../Component/EditFieldActions/EditFieldActions";
import ProfileSidebar from "../Component/ProfileSidebar/ProfileSidebar";
import AvatarModal from '../Component/AvatarModal/AvatarModal';
import ProfileContent from '../Component/ProfileContent/ProfileContent';
import SecurityTab from '../Component/SecurityTab/SecurityTab';
const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);
    const {
        editingField,
        startEditing,
        cancelEditing,
        saveChanges,
        formData,
        handleInputChange,
        loading,
        avatar,
        showAvatarModal,
        selectedFile,
        preview,
        previewUrl,
        fileInputRef,
        handleFileSelect,
        handleEditAvatar,
        closeAvatarModal,
        saveAvatar,
        setFormData
    } = useProfile(user, updateUser);
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get("tab") || "profile";
    const [activeTab, setActiveTab] = useState(tabFromUrl);

    // Hàm xử lý chuyển tab - CẬP NHẬT URL
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setSearchParams({ tab: tabId });
    };

    // Hàm xử lý chuyển tab cho header (General, Balance, Security)
    const handleHeaderTabChange = (tabType) => {
        switch (tabType) {
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
    // Đồng bộ activeTab với URL khi URL thay đổi từ bên ngoài
    useEffect(() => {
        const currentTab = searchParams.get("tab") || "profile";
        if (currentTab !== activeTab) {
            setActiveTab(currentTab);
        }
    }, [searchParams, activeTab]);
    if (loading) {
        return <Loader></Loader>
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.layoutContainer}>
                {/* Sidebar */}
                <ProfileSidebar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />

                {/* Main Content */}
                <div className={styles.content}>
                    {activeTab === 'profile' && (
                        <ProfileContent styles={styles}
                            activeTab={activeTab}
                            handleHeaderTabChange={handleHeaderTabChange}
                            preview={preview}
                            avatar={avatar}
                            handleEditAvatar={handleEditAvatar}
                            formData={formData}
                            handleInputChange={handleInputChange}
                            editingField={editingField}
                            EditFieldActions={EditFieldActions}
                            EditButton={EditButton}
                            loading={loading}
                            saveChanges={saveChanges}
                            cancelEditing={cancelEditing}
                            startEditing={startEditing} />
                    )}

                    {activeTab === 'payment' && (
                        <PaymentMethod user={user} />
                    )}

                    {activeTab === 'security' && (
                        <SecurityTab styles={styles}
                            editingField={editingField}
                            startEditing={startEditing}
                            cancelEditing={cancelEditing}
                            saveChanges={saveChanges}
                            formData={formData}
                            setFormData={setFormData} />
                    )}
                </div>
            </div>

            {/* Avatar Modal */}
            <AvatarModal
                show={showAvatarModal}
                avatar={avatar}
                previewUrl={previewUrl}
                loading={loading}
                selectedFile={selectedFile}
                fileInputRef={fileInputRef}
                onClose={closeAvatarModal}
                onFileSelect={handleFileSelect}
                onSave={saveAvatar}
            />
        </div>
    )
}

export default Profile