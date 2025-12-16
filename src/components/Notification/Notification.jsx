import React, { useState, useEffect, useRef } from 'react';
import styles from './Notification.module.css';
import '../../config/echo';
import { useNavigate } from 'react-router-dom';
import PartLoading from '../Loading/PartLoading';

const Notification = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false); // 🚀 Track đã fetch chưa
    const [isInitialDelayComplete, setIsInitialDelayComplete] = useState(false); // 🚀 Delay ban đầu
    const dropdownRef = useRef(null);
    const listRef = useRef(null);
    const navigate = useNavigate();
    
    // 🚀 DELAY BAN ĐẦU: Chờ 2 giây để search hotel có ưu tiên
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialDelayComplete(true);
            console.log("⏳ Notification component ready to fetch (after 2s delay)");
        }, 2000); // Delay 2 giây cho search hotel
        
        return () => clearTimeout(timer);
    }, []);
    
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

    // 🚀 LAZY FETCH: Chỉ fetch khi user click vào notification icon VÀ đã hết delay ban đầu
    useEffect(() => {
        if (!isOpen || !isInitialDelayComplete || hasFetched) return;
        
        const fetchNotifications = async () => {
            console.log("📨 Fetching notifications (lazy load)");
            setLoading(true);
            try {
                const res = await fetch('/api/auth/notifications', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!res.ok) throw new Error('Failed to fetch notifications');
                const data = await res.json();
                setNotifications(data.notifications || []);
                setHasFetched(true); // Đánh dấu đã fetch
            } catch (err) {
                console.error(err);
                setError('Failed to load notifications');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [isOpen, isInitialDelayComplete, hasFetched]); // 🚀 Chỉ fetch khi mở dropdown

    // 🚀 Realtime notifications - CŨNG DELAY
    useEffect(() => {
        // Chỉ kết nối realtime nếu đã fetch notifications ít nhất 1 lần
        if (!hasFetched || !userId || !window.Echo) return;

        console.log("📡 Connecting to realtime notification channel");
        const channel = window.Echo.private(`user.${userId}`);
        
        channel.listen('NotificationSuccess', (data) => {
            console.log("🔔 New realtime notification received");
            setNotifications(prev => [data, ...prev]);
        });

        return () => {
            if (channel) {
                window.Echo.leave(`user.${userId}`);
            }
        };
    }, [userId, hasFetched]); // 🚀 Chỉ kết nối khi đã fetch lần đầu

    const unreadCount = notifications.filter(n => !n.is_read).length;

    // 🚀 Toggle với lazy loading
    const toggleDropdown = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        
        // Nếu chưa fetch bao giờ và delay đã xong, sẽ trigger fetch trong useEffect
        console.log(`🔔 Notification dropdown ${newState ? 'opened' : 'closed'}`);
    };

    // Mark as read
    const markAsRead = async (id) => {
        try {
            await fetch(`/api/auth/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await fetch('/api/auth/notifications/mark-all-read', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error(err);
        }
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
        }

        if (n.type === 'payment') {
            navigate('/profile?tab=payment');
        }

        if (n.type === 'discount') {
            navigate('/discount');
        }
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

    // Get notification type color
    const getNotificationType = (notification) => {
        if (notification.type) return notification.type;
        // Auto-detect type from content
        const message = notification.message?.toLowerCase() || '';
        if (message.includes('thành công') || message.includes('success') || message.includes('thành công')) 
            return 'success';
        if (message.includes('cảnh báo') || message.includes('warning') || message.includes('chú ý')) 
            return 'warning';
        if (message.includes('lỗi') || message.includes('error') || message.includes('failed')) 
            return 'error';
        return 'info';
    };

    return (
        <div className={styles.notificationContainer} ref={dropdownRef}>
            <button 
                onClick={toggleDropdown} 
                className={styles.notificationButton}
                title="Thông báo"
            >
                🔔
                {unreadCount > 0 && (
                    <span className={styles.notificationBadge}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            <div className={`${styles.dropdown} ${isOpen ? styles.show : ''}`}>
                <div className={styles.dropdownHeader}>
                    <h3>Thông báo</h3>
                    {unreadCount > 0 && (
                        <button 
                            className={styles.markAllReadButton} 
                            onClick={markAllAsRead}
                            disabled={loading}
                        >
                            Đánh dấu đã đọc tất cả
                        </button>
                    )}
                </div>

                <div className={styles.notificationList} ref={listRef}>
                    {/* 🚀 Hiển thị trạng thái loading */}
                    {loading && (
                        <div className={styles.loadingState}>
                            <PartLoading />
                            <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                                Đang tải thông báo...
                            </p>
                        </div>
                    )}
                    
                    {error && <div className={styles.errorState}>{error}</div>}
                    
                    {/* 🚀 Hiển thị placeholder nếu chưa fetch lần nào */}
                    {!loading && !hasFetched && isOpen && (
                        <div className={styles.emptyState}>
                            <p>Nhấn để tải thông báo</p>
                            <small style={{ color: '#999' }}>
                                (Tự động tải sau 2 giây để ưu tiên tìm kiếm)
                            </small>
                        </div>
                    )}
                    
                    {!loading && hasFetched && notifications.length === 0 && (
                        <div className={styles.emptyState}>Không có thông báo</div>
                    )}

                    {hasFetched && notifications.map(notification => {
                        const type = getNotificationType(notification);
                        const isUnread = !notification.is_read;
                        
                        return (
                            <div
                                key={notification.id}
                                className={`${styles.notificationItem} ${
                                    isUnread ? styles.unread : styles.read
                                }`}
                                onClick={() => handleClickNotification(notification)}
                                data-type={type}
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
                                    <div className={styles.notificationTime}>
                                        {formatTime(notification.created_at)}
                                        <p className={styles.statusText}>
                                            {isUnread ? "Chưa đọc" : "Đã đọc"}
                                        </p>
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