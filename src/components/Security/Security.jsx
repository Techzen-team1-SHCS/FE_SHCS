import React, { useContext, useState } from 'react'
import styles from './Security.module.css';
import { AuthContext } from '../../contexts/AuthContext';

const PaymentMethod = ({ user }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { logout } = useContext(AuthContext);
    const toggleDeleteSection = () => {
        setShowDelete(!showDelete);
    };
    const handleDeleteClick = () => {
        setShowConfirmModal(true);
    };

    const handleCancelDelete = () => {
        setShowConfirmModal(false);
    };
     const handleConfirmDelete = async () => { // THÊM ASYNC
        setIsDeleting(true); // THÊM DÒNG NÀY
        try {
            // GỌI API XÓA TÀI KHOẢN
            const response = await fetch('/api/delete-account', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Account deleted successfully');
                // ĐĂNG XUẤT SAU KHI XÓA TÀI KHOẢN
                logout();
                // Có thể chuyển hướng về trang chủ
                window.location.href = '/';
            } else {
                throw new Error('Delete account failed');
            }
        } catch (error) {
            console.error('Lỗi xóa tài khoản:', error);
            alert('Có lỗi xảy ra khi xóa tài khoản!');
        } finally {
            setIsDeleting(false); // THÊM DÒNG NÀY
            setShowConfirmModal(false);
            setShowDelete(false);
        }
    };
    return (
        <div>
            <div className={styles.container}>
                <div className={styles.header}>Account setting</div>
                <div className={styles.subHeader}>Manage your account</div>
                <hr></hr>
            </div>
            <div className={styles.section}>
                <div className={styles.group}>
                    <div className={styles.header}>Delete account</div>
                    <div className={styles.subHeader}>Permanently delete your account</div>

                </div>
                <div className={styles.iconContainer}>
                    <div className={`${styles.icon} ${showDelete ? styles.rotate : ''}`}
                        onClick={toggleDeleteSection}>
                        <i className='fa fa-angle-down'></i>
                    </div>
                    {showDelete && (
                        <div className={styles.deleteSection}>
                            <button
                                className={styles.deleteButton}
                                onClick={handleDeleteClick}
                                
                            >
                                Delete my account
                            </button>
                        </div>
                    )}
                </div>

            </div>
            {/* Modal xác nhận xóa tài khoản */}
            {showConfirmModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Delete my account </h2>
                            <h7>Delete your SHCS account?</h7>
                        </div>

                        <div className={styles.modalContent}>
                            <p>You will permanently lose:</p>
                            <ul className={styles.warningList}>
                                <li>All stored payment methods</li>
                                <li>Express Booking history</li>
                                <li>Newsletter subscription</li>
                            </ul>

                            <p className={styles.processInfo}>
                                After your account is deleted, SHCS will no longer have access to any personal data or previous correspondence made through this account. It may take up to 30 days to complete this process.
                            </p>
                        </div>

                        <div className={styles.modalDivider}></div>

                        <div className={styles.modalActions}>
                            <button
                                className={styles.cancelButton}
                                onClick={handleCancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className={styles.confirmDeleteButton}
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                 {isDeleting ? 'Deleting...' : 'Delete my account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PaymentMethod
