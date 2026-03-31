import styles from "./Notifications.module.css";
import { initialData } from "../../Mock/notification";
import { NOTIFICATION_TABS } from "../../Constants/notifications/notificationConstants";
import { useNotifications } from "../../hooks/useNotifications";
import { getPaginationPages } from "../../Helpers/Notifications";

export default function Notifications() {

  const {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
    markAsRead
  } = useNotifications(initialData);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Notifications</h2>

      <div className={styles.tabs}>
        {NOTIFICATION_TABS.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${
              activeTab === tab ? styles.activeTab : ""
            }`}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {currentItems.map((item) => (
          <div
            key={item.id}
            className={styles.card}
            onClick={() => markAsRead(item.id)}
          >
            <div className={styles.leftIcon}>🔔</div>

            <div className={styles.content}>
              <div className={styles.header}>
                <h4>{item.title}</h4>
                <span className={styles.date}>{item.date}</span>
              </div>

              <p>{item.desc}</p>
              <span className={styles.time}>{item.time}</span>
            </div>

            {item.unread && <div className={styles.dot}></div>}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>
          <div style={{display:"flex",gap:'30px'}}>
          {getPaginationPages(totalPages).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}
          </div>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}