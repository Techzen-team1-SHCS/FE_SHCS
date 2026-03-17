import { getTabLabel, getTabIcon } from "../../Helpers/bookingHelpers";
import styles from "../../ManageBooking.module.css";
const BookingTabs = ({ activeTab, setActiveTab, stats }) => {

    return (
        <div className={styles.tabsContainer}>
            <div className={styles.tabsNav}>
                {["active", "past", "cancelled"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`}
                    >
                        <span className={styles.tabIcon}>{getTabIcon(tab)}</span>
                        <span className={styles.tabText}>{getTabLabel(tab)}</span>
                        <span className={styles.tabCount}>
                            {tab === "active" && stats.active}
                            {tab === "past" && stats.past}
                            {tab === "cancelled" && stats.cancelled}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default BookingTabs;