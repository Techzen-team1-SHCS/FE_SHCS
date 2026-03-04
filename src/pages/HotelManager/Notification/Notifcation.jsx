import styles from "./Notifications.module.css";
import { useState, useEffect } from "react";

const initialData = [
  { id: 1, title: "Request Approve", desc: "Status Tran Vy Homestay has Changed", date: "17/11/2025", time: "10 minutes ago", unread: true },
  { id: 2, title: "New Booking Received", desc: "Hotel Hilton Da Nang just received an order from user Minh Quan", date: "17/11/2025", time: "10 minutes ago", unread: true },
  { id: 3, title: "New Hotel Registered", desc: "Hotel Hilton Da Nang is Registered", date: "17/11/2025", time: "10 minutes ago", unread: true },
  { id: 4, title: "New Review Reported", desc: "Review has been reported bad by user Minh Quan", date: "17/11/2025", time: "10 minutes ago", unread: false },
  { id: 5, title: "Payment Received", desc: "order payment #1234 was successful", date: "17/11/2025", time: "10 minutes ago", unread: true },
  { id: 6, title: "System Update", desc: "System maintenance completed", date: "17/11/2025", time: "15 minutes ago", unread: true },
  { id: 7, title: "Room Updated", desc: "Room price has been updated", date: "17/11/2025", time: "20 minutes ago", unread: false },
];

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState(initialData);

  const itemsPerPage = 4; // số item mỗi trang

  // ===== FILTER =====
  const filtered =
    activeTab === "All"
      ? notifications
      : activeTab === "Read"
      ? notifications.filter((n) => !n.unread)
      : notifications.filter((n) => n.unread);

  // ===== PAGINATION =====
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Nếu filter làm số trang giảm → tự động quay về trang hợp lệ
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filtered.length]);

  // ===== MARK AS READ =====
  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Notifications</h2>

      {/* Tabs */}
      <div className={styles.tabs}>
        {["All", "Read", "Unread"].map((tab) => (
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

      {/* List */}
      <div className={styles.list}>
        {currentItems.map((item) => (
          <div
            key={item.id}
            className={styles.card}
            onClick={() => handleMarkAsRead(item.id)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.prev}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>

          <div className={styles.pages}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (num) => (
                <button
                  key={num}
                  className={`${styles.pageBtn} ${
                    num === currentPage ? styles.activePage : ""
                  }`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              )
            )}
          </div>

          <button
            className={styles.next}
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