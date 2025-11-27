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
            phone: "+84 123 456 789",
            email: "john@example.com",
            totalRoomBooked: 15,
            status: "active"
        },
        {
            id: 2,
            username: "jane_smith",
            phone: "+84 987 654 321",
            email: "jane@example.com",
            totalRoomBooked: 8,
            status: "inactive"
        },
        {
            id: 3,
            username: "mike_wilson",
            phone: "+84 555 123 456",
            email: "mike@example.com",
            totalRoomBooked: 23,
            status: "active"
        },
        {
            id: 4,
            username: "sarah_jones",
            phone: "+84 111 222 333",
            email: "sarah@example.com",
            totalRoomBooked: 3,
            status: "active"
        },
        {
            id: 5,
            username: "spammer_user",
            phone: "+84 999 888 777",
            email: "spam@example.com",
            totalRoomBooked: 0,
            status: "active"
        }
    ]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'active': return statusActive;
            case 'inactive': return statusInactive;

            default: return '';
        }
    };

    return (
        <div className={container}>
            <div className={tableContainer}>
                <table className={table}>
                    <thead className={tableHeader}>
                        <tr>
                            <th className={th}>User ID</th>
                            <th className={th}>Username</th>
                            <th className={th}>Phone</th>
                            <th className={th}>Email</th>
                            <th className={th}>Total room booked</th>
                            <th className={th}>Status</th>
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {usersData.map((user) => (
                            <tr key={user.id} className={tr}>
                                <td className={td}>{user.id}</td>
                                <td className={td}>{user.username}</td>
                                <td className={td}>{user.phone}</td>
                                <td className={td}>{user.email}</td>
                                <td className={td}>{user.totalRoomBooked}</td>
<td className={td}>
                                    <span className={getStatusClass(user.status)}>
                                        {user.status}
                                    </span>
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