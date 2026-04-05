import styles from './StaffTable.module.css';
import { STAFF_TABLE_HEADERS } from '../../Constants/Staff/staffConstants';
import { FaUser, FaEdit, FaSort } from 'react-icons/fa';

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
                    {data.map((staff, index) => (
                        <tr key={staff.id} className={styles.tableRow}>
                            <td className={styles.boldCell}>#{staff.id}</td>
                            <td className={styles.nameCell}>{staff.firstName}</td>
                            <td className={styles.nameCell}>{staff.lastName}</td>
                            <td className={styles.normalCell}>{staff.address}</td>
                            <td className={styles.normalCell}>{staff.email}</td>
                            <td className={styles.boldCell}>{staff.contactNumber}</td>
                            <td>
                                <div className={styles.actions}>
                                    <button className={styles.actionBtnDark} aria-label="View user">
                                        <FaUser size={14} />
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
