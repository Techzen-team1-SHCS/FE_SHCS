import { useContext } from "react";
import styles from "./Notifications.module.css";
import { NOTIFICATION_TABS } from "../../Constants/notifications/notificationConstants";
import { useNotifications } from "../../hooks/useNotifications";
import { getPaginationPages } from "../../Helpers/Notifications";
import { AuthContext } from "../../../../contexts/AuthContext";
import { FaCheckDouble, FaTrashAlt, FaTimes } from "react-icons/fa";

export default function Notifications() {
  const { user } = useContext(AuthContext);

  const {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications
  } = useNotifications(user);

  const getPriorityInfo = (priority) => {
    switch (priority) {
      case 'critical': return { icon: '🔴', color: '#ef4444' };
      case 'warning': return { icon: '🟡', color: '#f59e0b' };
      case 'success': return { icon: '🟢', color: '#10b981' };
      case 'info':
      default: return { icon: '🔵', color: '#3b82f6' };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className={styles.title}>Quản lý thông báo</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={markAllAsRead} className={styles.actionBtn}>
            <FaCheckDouble /> Đánh dấu tất cả đã đọc
          </button>
          <button onClick={clearReadNotifications} className={styles.actionBtnDanger}>
            <FaTrashAlt /> Dọn dẹp đã đọc
          </button>
        </div>
      </div>

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
        {loading && currentItems.length === 0 ? (
          <p>Đang tải thông báo...</p>
        ) : currentItems.length === 0 ? (
          <p>Không có thông báo nào.</p>
        ) : (
          currentItems.map((item) => {
            const { icon, color } = getPriorityInfo(item.priority);
            const isUnread = !item.is_read && item.unread !== false;

            return (
              <div
                key={item.id}
                className={`${styles.card} ${isUnread ? styles.unreadCard : ''}`}
                onClick={() => isUnread && markAsRead(item.id)}
                style={{ borderLeft: `4px solid ${color}` }}
              >
                <div className={styles.leftIcon}>{icon}</div>

                <div className={styles.content}>
                  <div className={styles.header}>
                    <h4>{item.title}</h4>
                    <span className={styles.date}>{formatDate(item.created_at)}</span>
                  </div>

                  <p>{item.message || item.desc}</p>
                  <span className={styles.time}>{formatTime(item.created_at)}</span>
                </div>

                <div className={styles.actions}>
                  {isUnread && <div className={styles.dot} style={{ backgroundColor: color }}></div>}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(item.id);
                    }}
                    className={styles.deleteBtn}
                    title="Xóa thông báo"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Trước
          </button>
          <div style={{display:"flex",gap:'8px'}}>
          {getPaginationPages(totalPages).map((num) => (
            <button
              key={num}
              className={currentPage === num ? styles.activePage : ''}
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
            Sau
          </button>
        </div>
      )}
    </div>
  );
}