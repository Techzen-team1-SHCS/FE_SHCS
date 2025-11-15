import React, { useState } from 'react';
import styles from './UserManage.module.css';

const UserManage = () => {
    const {
        container,
        tableContainer,
        table,
        tableHeader,
        th,
        tableBody,
        tr,
        td,
        statusActive,
        statusInactive,
        statusSuspended,
        statusPending,
        actionCell,
        deleteButton,
        banButton,
        unbanButton,
        deleteIcon
    } = styles;

    const [usersData, setUsersData] = useState([
        {
            id: 1,
            username: "john_doe",
            email: "john@example.com",
            role: "user",
            status: "active",
            joinDate: "2024-01-15",
            lastLogin: "2024-03-20 14:30",
            isBanned: false
        },
        {
            id: 2,
            username: "admin",
            email: "admin@example.com",
            role: "user",
            status: "inactive",
            joinDate: "2024-01-10",
            lastLogin: "2024-03-21 09:15",
            isBanned: false
        },
        {
            id: 3,
            username: "spammer",
            email: "spam@example.com",
            role: "user",
            status: "suspended",
            joinDate: "2024-02-01",
            lastLogin: "2024-03-10 16:45",
            isBanned: true
        }
    ]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'active': return statusActive;
            case 'inactive': return statusInactive;
            case 'suspended': return statusSuspended;
            case 'pending': return statusPending;
            default: return '';
        }
    };

    // Hàm ban tài khoản
    const handleBanUser = (id) => {
        if (window.confirm('Are you sure you want to ban this user?')) {
            setUsersData(prevData =>
                prevData.map(user =>
                    user.id === id
                        ? { ...user, status: 'suspended', isBanned: true }
                        : user
                )
            );
        }
    };

    // Hàm unban tài khoản
    const handleUnbanUser = (id) => {
        if (window.confirm('Are you sure you want to unban this user?')) {
            setUsersData(prevData =>
                prevData.map(user =>
                    user.id === id
                        ? { ...user, status: 'active', isBanned: false }
                        : user
                )
            );
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsersData(prevData => prevData.filter(user => user.id !== id));
        }
    };

    return (
        <div className={container}>
            <div className={tableContainer}>
                <table className={table}>
                    <thead className={tableHeader}>
                        <tr>
                            <th className={th}>Username</th>
                            <th className={th}>Email</th>
                            <th className={th}>Role</th>
                            <th className={th}>Join Date</th>
                            <th className={th}>Last Login</th>
                            <th className={th}>Status</th>
                            <th className={th}>Actions</th>
                            <th className={th}></th>
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {usersData.map((user) => (
                            <tr key={user.id} className={tr}>
                                <td className={td}>{user.username}</td>
                                <td className={td}>{user.email}</td>
                                <td className={td}>{user.role}</td>
                                <td className={td}>{user.joinDate}</td>
                                <td className={td}>{user.lastLogin}</td>
                                <td className={td}>
                                    <span className={getStatusClass(user.status)}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className={td}>
                                    <div className={actionCell}>
                                        {!user.isBanned ? (
                                            <button
                                                className={banButton}
                                                onClick={() => handleBanUser(user.id)}
                                                title="Ban user"
                                            >
                                                Ban
                                            </button>
                                        ) : (
                                            <button
                                                className={unbanButton}
                                                onClick={() => handleUnbanUser(user.id)}
                                                title="Unban user"
                                            >
                                                Unban
                                            </button>
                                        )}

                                    </div>


                                </td>
                                <td className={td}>{/* Nút Delete */}
                                    <button
                                        className={deleteButton}
                                        onClick={() => handleDelete(user.id)}
                                        title="Delete user"
                                    >
                                        <svg className={deleteIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManage;