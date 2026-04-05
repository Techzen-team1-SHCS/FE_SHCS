import styles from './StaffTable.module.css';
import { STAFF_TABLE_HEADERS } from '../../Constants/Staff/staffConstants';
import { FaTrash, FaEdit, FaSort } from 'react-icons/fa';
import Swal from 'sweetalert2';

const StaffTable = ({ data, onDelete, onEdit }) => {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {STAFF_TABLE_HEADERS.map((header) => (
                            <th key={header.id}>
                                <div className={styles.headerCell}>
                                    {header.label}
                                    <FaSort className={styles.sortIcon} />
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((staff) => (
                        <tr key={staff.id} className={styles.tableRow}>
                            <td className={styles.boldCell}>#{staff.id}</td>
                            <td className={styles.avatarCell}>
                                <img src={staff.avatar || 'https://via.placeholder.com/40'} alt={staff.name} className={styles.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                            </td>
                            <td className={styles.nameCell}>{staff.name}</td>
                            <td className={styles.normalCell}>{staff.age}</td>
                            <td className={styles.normalCell}>{staff.email}</td>
                            <td className={styles.boldCell}>{staff.phone}</td>
                            <td className={styles.normalCell}>{staff.address}</td>
                            <td>
                                <div className={styles.actions}>
                                    <button 
                                        className={styles.actionBtnDark} 
                                        aria-label="Delete staff"
                                        onClick={() => {
                                            Swal.fire({
                                                title: 'Xóa nhân viên?',
                                                text: "Bạn có chắc chắn muốn xóa nhân viên này? Thao tác này không thể hoàn tác!",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#d33',
                                                cancelButtonColor: '#3085d6',
                                                confirmButtonText: 'Xóa',
                                                cancelButtonText: 'Hủy'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    onDelete(staff.id);
                                                }
                                            });
                                        }}
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                    <button 
                                        className={styles.actionBtnGrey} 
                                        aria-label="Edit staff"
                                        onClick={() => onEdit(staff)}
                                    >
                                        <FaEdit size={14} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={STAFF_TABLE_HEADERS.length} className={styles.emptyMessage}>
                                No staff found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StaffTable;
