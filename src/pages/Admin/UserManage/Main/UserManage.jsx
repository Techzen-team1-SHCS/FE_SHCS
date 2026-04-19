import { useEffect, useState } from 'react';
import styles from '../UserManage.module.css';
import PartLoading from '../../../../components/Loading/PartLoading';
import { useUsers } from '../Hooks/useUsers';
import { useUserActions } from '../Hooks/useUserActions';
import UserStats from '../Component/UserStats/UserStats';
import UserTable from '../Component/UserTable/UserTable';
import UserDetailModal from '../Component/UserDetailModal/UserDetailModal';
const UserManage = () => {
    const {
        container,
        header,
        tableContainer,
        table,
        tableHeader,
        th,
        tableBody,
        tr,
        td,
        statusActive,
        statusSuspended,
        actionCell,
        actionButton,
        viewButton,
        editButton,
        banButton,
        unbanButton,
        buttonGroup,
        buttonIcon,
        userAvatar,
        avatarContainer,
        userInfo,
        userName,
        userEmail,
        roleBadge,
        roleAdmin,
        roleUser,
        statusBadge,
        roleManager
    } = styles;
    const { usersData, loading, fetchUsers } = useUsers();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const {
        handleView,
        handleEdit,
        handleToggleBan
    } = useUserActions(
        usersData,
        fetchUsers,
        setSelectedUser,
        setIsDetailModalOpen
    );
    if (loading) {
        return <div className='mt-40'><PartLoading /></div>;
    }
    return (
        <div className={container}>
            <div className={header}>
                <UserStats usersData={usersData} styles={styles} />
            </div>

            <UserTable
                usersData={usersData}
                styles={styles}
                handleView={handleView}
                handleEdit={handleEdit}
                handleToggleBan={handleToggleBan}
            />

            {/* Modal xem chi tiết */}
            <UserDetailModal
                isOpen={isDetailModalOpen}
                user={selectedUser}
                onClose={() => setIsDetailModalOpen(false)}
                styles={styles}
            />
        </div>
    );
};

export default UserManage;