import styles from "./Notifications.module.css";
import { useState, useEffect } from "react";
import { notificationService } from "../../../services/notificationService";
import PartLoading from "../../../components/Loading/PartLoading";

const NOTIFICATION_TYPES = {
  booking: {
    icon: "/assets/images/icons/book.png",
    bg: "#E5EEFF",
    color: "#2E5AAC",
  },
  Registration_Successful: {
    icon: "/assets/images/avatar/user-add-line.png",
    bg: "#FFE7D6",
    color: "#E67E22",
  },
  cancel_booking: {
    icon: "/assets/images/icons/report.png",
    bg: "#FFE4E4",
    color: "#E74C3C",
  },
  payment: {
    icon: "/assets/images/icons/payment.png",
    bg: "#E5F8FF",
    color: "#1ABC9C",
  },
  system: {
    icon: "/assets/images/icons/update.png",
    bg: "#ECE3FF",
    color: "#9B59B6",
  },
};
export default function Notifications() {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 4; // số item mỗi trang

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const raw = await notificationService.getHotelManagerNotifications();
      const mapped = raw.map((n) => ({
        id: n.id,
        type: n.type || "system",
        title: n.title,
        desc: n.message || n.data || "",
        date: new Date(n.created_at).toLocaleDateString("vi-VN"),
        time: formatTimeAgo(n.created_at),
        unread: !n.is_read,
      }));
      setNotifications(mapped);
    } catch (error) {
      console.error("Fetch hotel manager notifications error:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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
  const handleMarkAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
    try {
      await notificationService.markAsRead(id);
    } catch (error) {
      console.error("Mark notification as read error:", error);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Notifications</h2>
        <PartLoading />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Notifications</h2>

      {/* Tabs */}
      <div className={styles.tabs}>
        {["All", "Read", "Unread"].map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""
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
        {currentItems.map((item) => {
          const typeInfo = NOTIFICATION_TYPES[item.type];

          return (
            <div
              key={item.id}
              className={styles.card}
              onClick={() => handleMarkAsRead(item.id)}
            >
              <div
                className={styles.leftIcon}
                style={{ background: typeInfo.bg }}
              >
                <img src={typeInfo.icon} alt="icon" />
              </div>

              <div className={styles.content}>
                <div className={styles.header}>
                  <h4 style={{ color: typeInfo.color }}>{item.title}</h4>
                  <span className={styles.date}>{item.date}</span>
                </div>

                <p>{item.desc}</p>
                <span className={styles.time}>{item.time}</span>
              </div>

              {item.unread && <div className={styles.dot}></div>}
            </div>
          );
        })}
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
                  className={`${styles.pageBtn} ${num === currentPage ? styles.activePage : ""
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