import  { useState, useEffect, useRef } from 'react';
import styles from './Notification.module.css';
import '../../config/echo';
import { useNavigate } from 'react-router-dom';
import PartLoading from '../Loading/PartLoading';
import api from '../../services/api';

const Notification = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);
    const dropdownRef = useRef(null);
    const listRef = useRef(null);
    const navigate = useNavigate();
    
    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Auto scroll to top when dropdown opens
    useEffect(() => {
        if (isOpen && listRef.current) {
            listRef.current.scrollTop = 0;
        }
    }, [isOpen]);

    // ✅ FETCH NGAY KHI COMPONENT MOUNT
    useEffect(() => {
        const fetchNotifications = async () => {
            // Chỉ fetch nếu chưa fetch lần nào
            if (hasFetched) return;
            
            console.log("📨 Fetching notifications on mount");
            setLoading(true);
            try {
                const res = await api.get('/auth/notifications');
                setNotifications(res.data.data || []);
                setHasFetched(true);
            } catch (err) {
                console.error('Notification fetch error:', err);
                setError('Không thể tải thông báo');
                // Vẫn đánh dấu đã fetch để không thử lại liên tục
                setHasFetched(true);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchNotifications();
        }
    }, [userId, hasFetched]); // Chỉ chạy khi hasFetched thay đổi

    // ✅ Realtime notifications - Kết nối ngay khi có userId
    useEffect(() => {
        if (!userId || !window.Echo) return;

        console.log("📡 Connecting to realtime notification channel");
        const channel = window.Echo.private(`user.${userId}`);
        
        channel.listen('NotificationSuccess', (data) => {
            console.log("🔔 New realtime notification received");
            setNotifications(prev => [data, ...prev]);
            
            // Hiển thị toast/thông báo mới (tùy chọn)
            if (data.title && data.message) {
                showNewNotificationToast(data.title, data.message);
            }
        });

        // Lắng nghe các sự kiện khác nếu có
        channel.listen('.notification.created', (data) => {
            console.log("🔔 Notification created event received");
            setNotifications(prev => [data.notification, ...prev]);
        });

        return () => {
            if (channel) {
                console.log("📡 Disconnecting from notification channel");
                window.Echo.leave(`user.${userId}`);
            }
        };
    }, [userId]); // Chỉ cần userId

    // ✅ Hàm hiển thị toast thông báo mới (tùy chọn)
    const showNewNotificationToast = (title, message) => {
        // Sử dụng thư viện toast hoặc custom implementation
        if (window.showToast) {
            window.showToast({
                type: 'info',
                title: title,
                message: message,
                duration: 5000
            });
        }
        
        // Hoặc phát âm thanh thông báo
        try {
            const audio = new Audio('/notification-sound.mp3');
            audio.volume = 0.3;
            audio.play().catch(e => console.log("Audio play failed:", e));
        } catch (e) {
            console.log("Audio error:", e);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    // ✅ Toggle dropdown
    const toggleDropdown = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        
        // Nếu đang mở và có thông báo chưa đọc, có thể đánh dấu đọc tất cả
        if (newState && unreadCount > 0) {
            // Có thể tự động đánh dấu đọc khi mở
            // markAllAsRead();
        }
        
        console.log(`🔔 Notification dropdown ${newState ? 'opened' : 'closed'}`);
    };

    // Mark as read
    const markAsRead = async (id) => {
        try {
            await api.put(`/auth/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await api.put('/auth/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    // Refresh notifications
    const refreshNotifications = async () => {
        setHasFetched(false); // Reset để fetch lại
        setLoading(true);
    };

    const handleClickNotification = (n) => {
        // Mark read
        if (!n.is_read) markAsRead(n.id);

        // Parse JSON data nếu có
        let parsedData = null;
        try {
            parsedData = n.data ? JSON.parse(n.data) : null;
        } catch (e) {
            console.error("Invalid JSON in notification.data");
        }

        // Điều hướng theo loại
        if (n.type === 'booking' && parsedData?.booking_id) {
            navigate(`/booking/${parsedData.booking_id}`);
            setIsOpen(false);
        }

        if (n.type === 'payment') {
            navigate('/profile?tab=payment');
            setIsOpen(false);
        }

        if (n.type === 'discount') {
            navigate('/discount');
            setIsOpen(false);
        }

        if (n.type === 'message' && parsedData?.chat_id) {
            navigate(`/messages/${parsedData.chat_id}`);
            setIsOpen(false);
        }

        // Đóng dropdown sau khi click
        // setIsOpen(false);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const time = new Date(timeString);
        const now = new Date();
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
        
        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        if (diffHrs < 24) return `${diffHrs} giờ trước`;
        return `${Math.floor(diffHrs/24)} ngày trước`;
    };

    // Get notification type
    const getNotificationType = (notification) => {
        if (notification.priority) {
            if (notification.priority === 'critical') return 'error';
            return notification.priority; // warning, info, success
        }
        if (notification.type) return notification.type;
        const message = notification.message?.toLowerCase() || '';
        if (message.includes('thành công') || message.includes('success') || message.includes('đã xác nhận')) 
            return 'success';
        if (message.includes('cảnh báo') || message.includes('warning') || message.includes('chú ý')) 
            return 'warning';
        if (message.includes('lỗi') || message.includes('error') || message.includes('failed')) 
            return 'error';
        return 'info';
    };

    // Format số lượng thông báo
    const formatBadgeCount = (count) => {
        if (count > 99) return '99+';
        return count;
    };

    return (
        <div className={styles.notificationContainer} ref={dropdownRef}>
            <button 
                onClick={toggleDropdown} 
                className={styles.notificationButton}
                title="Thông báo"
                aria-label={`Thông báo ${unreadCount > 0 ? `có ${unreadCount} thông báo chưa đọc` : ''}`}
            >
                <span className={styles.bellIcon}>🔔</span>
                {unreadCount > 0 && (
                    <span className={styles.notificationBadge}>
                        {formatBadgeCount(unreadCount)}
                    </span>
                )}
            </button>

            <div className={`${styles.dropdown} ${isOpen ? styles.show : ''}`}>
                <div className={styles.dropdownHeader}>
                    <h3>Thông báo</h3>
                    <div className={styles.headerActions}>
                        {unreadCount > 0 && (
                            <button 
                                className={styles.markAllReadButton} 
                                onClick={markAllAsRead}
                                disabled={loading}
                                title="Đánh dấu tất cả đã đọc"
                            >
                                Đánh dấu đã đọc
                            </button>
                        )}
                        <button 
                            className={styles.refreshButton}
                            onClick={refreshNotifications}
                            disabled={loading}
                            title="Làm mới thông báo"
                        >
                            ↻
                        </button>
                    </div>
                </div>

                <div className={styles.notificationList} ref={listRef}>
                    {/* Loading state */}
                    {loading && !hasFetched && (
                        <div className={styles.loadingState}>
                            <PartLoading />
                            <p className={styles.loadingText}>Đang tải thông báo...</p>
                        </div>
                    )}
                    
                    {/* Error state */}
                    {error && !loading && (
                        <div className={styles.errorState}>
                            <p>{error}</p>
                            <button 
                                onClick={refreshNotifications}
                                className={styles.retryButton}
                            >
                                Thử lại
                            </button>
                        </div>
                    )}
                    
                    {/* Empty state */}
                    {!loading && hasFetched && notifications.length === 0 && (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📭</div>
                            <p>Không có thông báo</p>
                            <small>Thông báo mới sẽ xuất hiện tại đây</small>
                        </div>
                    )}

                    {/* Notifications list */}
                    {hasFetched && notifications.map(notification => {
                        const type = getNotificationType(notification);
                        const isUnread = !notification.is_read;
                        
                        return (
                            <div
                                key={notification.id || notification.created_at}
                                className={`${styles.notificationItem} ${
                                    isUnread ? styles.unread : styles.read
                                }`}
                                onClick={() => handleClickNotification(notification)}
                                data-type={type}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleClickNotification(notification);
                                    }
                                }}
                            >
                                <div className={styles.notificationContent}>
                                    <div 
                                        className={styles.notificationTitle}
                                        data-type={type}
                                    >
                                        {isUnread && <span className={styles.unreadDot}></span>}
                                        {notification.title}
                                    </div>
                                    <div className={styles.notificationMessage}>
                                        {notification.message}
                                    </div>
                                    <div className={styles.notificationFooter}>
                                        <span className={styles.notificationTime}>
                                            {formatTime(notification.created_at)}
                                        </span>
                                        <span className={`${styles.statusText} ${isUnread ? styles.statusUnread : styles.statusRead}`}>
                                            {isUnread ? "• Chưa đọc" : "Đã đọc"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Notification;