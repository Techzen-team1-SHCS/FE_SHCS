import { countActiveUsers, countAdmins } from "../../Helpers/userHelpers";
const UserStats = ({ usersData, styles }) => {
    return (
        <div className={styles.headerStats}>
            <div className={styles.stat}>
                <span className={styles.statNumber}>{usersData.length}</span>
                <span className={styles.statLabel}>Tổng người dùng</span>
            </div>

            <div className={styles.stat}>
                <span className={styles.statNumber}>
                    {countAdmins(usersData)}
                </span>
                <span className={styles.statLabel}>Quản trị viên</span>
            </div>

            <div className={styles.stat}>
                <span className={styles.statNumber}>
                    {countActiveUsers(usersData)}
                </span>
                <span className={styles.statLabel}>Đang hoạt động</span>
            </div>
        </div>
    );
};

export default UserStats;