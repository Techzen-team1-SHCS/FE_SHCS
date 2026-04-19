import UserRow from '../UserRow/UserRow';

const UserTable = ({
    usersData,
    styles,
    handleView,
    handleEdit,
    handleToggleBan
}) => {
    const {
        tableContainer,
        table,
        tableHeader,
        th,
        tableBody
    } = styles;

    return (
        <div className={tableContainer}>
            <table className={table}>
                <thead className={tableHeader}>
                    <tr>
                        <th className={th}>Người dùng</th>
                        <th className={th}>Thông tin</th>
                        <th className={th}>Vai trò</th>
                        <th className={th}>Trạng thái</th>
                        <th className={th}>Thao tác</th>
                    </tr>
                </thead>

                <tbody className={tableBody}>
                    {usersData.map(user => (
                        <UserRow
                            key={user.id}
                            user={user}
                            styles={styles}
                            handleView={handleView}
                            handleEdit={handleEdit}
                            handleToggleBan={handleToggleBan}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;