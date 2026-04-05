import { useState } from 'react';
import styles from './StaffManagement.module.css';
import StaffTable from '../../Components/Staff/StaffTable';
import StaffModal from '../../Components/Staff/StaffModal';
import { useStaffManagement } from '../../hooks/useStaffManagement';
import { FaPlus, FaSearch } from 'react-icons/fa';

const StaffManagement = () => {
    const { staffList, searchId, setSearchId, deleteStaff, addStaff, editStaff } = useStaffManagement();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);

    const handleAddClick = () => {
        setEditingStaff(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (staff) => {
        setEditingStaff(staff);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingStaff(null);
    };

    const handleModalSubmit = (formData) => {
        if (editingStaff) {
            editStaff(editingStaff.id, formData);
        } else {
            addStaff(formData);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.pageTitle}>Staff Management</h1>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <FaSearch className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search by ID..." 
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <button className={styles.addBtn} onClick={handleAddClick}>
                    <FaPlus />
                    Add staff
                </button>
            </div>

            <div className={styles.content}>
                <StaffTable data={staffList} onDelete={deleteStaff} onEdit={handleEditClick} />
            </div>

            <StaffModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                initialData={editingStaff}
            />
        </div>
    );
};

export default StaffManagement;
