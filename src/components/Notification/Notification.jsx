import React, { useState, useEffect } from 'react';
import styles from './Notification.module.css';

const Notification = () => {
    const {
        notificationContainer,
        notificationButton,
        notificationIcon,
        notificationBadge,
        dropdown,
        dropdownHeader,
        dropdownTitle,
        notificationList,
        notificationItem,
        notificationContent,
        notificationTitle,
        notificationMessage,
        notificationTime,
        notificationDivider,
        unreadDot,
        hotelName,
        bookingInfo,
        loadingState,
        errorState,
        emptyState
    } = styles;

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch notifications from API
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch notifications');
            }
            
            const data = await response.json();
            setNotifications(data.notifications || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    // Mark notification as read
    const markAsRead = async (notificationId) => {
        try {
            await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Update local state
            setNotifications(prev => 
                prev.map(noti => 
                    noti.id === notificationId ? { ...noti, unread: false } : noti
                )
            );
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/mark-all-read', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            setNotifications(prev => 
                prev.map(noti => ({ ...noti, unread: false }))
            );
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    // Fetch notifications when component mounts and dropdown opens
    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    const unreadCount = notifications.filter(noti => noti.unread).length;

    const handleNotificationClick = (notification) => {
        if (notification.unread) {
            markAsRead(notification.id);
        }
        // Handle notification click logic - navigate to booking details
        if (notification.bookingId) {
            window.location.href = `/bookings/${notification.bookingId}`;
        }
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        
        const time = new Date(timeString);
        const now = new Date();
        const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        return `${Math.floor(diffInHours / 24)} days ago`;
    };

    // Sample data for hotel booking notifications (replace with actual API data)
    const sampleNotifications = [
        {
            id: 1,
            type: 'new_booking',
            title: 'New Booking Received',
            hotelName: 'Hilton DaNang',
            message: 'New booking for 2 guests in Deluxe Room',
            bookingInfo: 'Check-in: 15 Jan 2024 • 2 nights',
            time: '2 hours ago',
            unread: true,
            bookingId: 'BK001'
        },
        {
            id: 2,
            type: 'cancellation',
            title: 'Booking Cancelled',
            hotelName: 'Sheraton Hanoi',
            message: 'Booking #BK202 has been cancelled by guest',
            bookingInfo: 'Refund processed',
            time: '5 hours ago',
            unread: true,
            bookingId: 'BK202'
        },
        {
            id: 3,
            type: 'checkin_reminder',
            title: 'Check-in Reminder',
            hotelName: 'Intercontinental Nha Trang',
            message: 'Guest checking in today at 2:00 PM',
            bookingInfo: 'Room 301 • 3 guests',
            time: '1 day ago',
            unread: false,
            bookingId: 'BK305'
        },
        {
            id: 4,
            type: 'payment_received',
            title: 'Payment Received',
            hotelName: 'Marriott Saigon',
            message: 'Payment confirmed for booking #BK410',
            bookingInfo: 'Amount: $250 • Credit Card',
            time: '2 days ago',
            unread: false,
            bookingId: 'BK410'
        }
    ];

    // Use sample data if no API data (for demo)
    const displayNotifications = notifications.length > 0 ? notifications : sampleNotifications;

    return (
        <div className={notificationContainer}>
            <button 
                className={notificationButton}
                onClick={toggleDropdown}
            >
                <svg 
                    className={notificationIcon}
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className={notificationBadge}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className={`${dropdown} ${isOpen ? styles.show : ''}`}>
                    <div className={dropdownHeader}>
                        <h3 className={dropdownTitle}>Booking Notifications</h3>
                        {unreadCount > 0 && (
                            <button 
                                className={styles.markAllReadButton}
                                onClick={markAllAsRead}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <div className={notificationList}>
                        {loading && (
                            <div className={loadingState}>Loading notifications...</div>
                        )}
                        
                        {/* {error && (
                            <div className={errorState}>
                                Failed to load notifications
                                <button 
                                    className={styles.retryButton}
                                    onClick={fetchNotifications}
                                >
                                    Retry
                                </button>
                            </div>
                        )} */}
                        
                        {!loading && !error && displayNotifications.length === 0 && (
                            <div className={emptyState}>No new notifications</div>
                        )}
                        
                        {!loading  && displayNotifications.map((notification, index) => (  //Có thể bỏ !Error để xem dữ liệu mẫu
                            <div key={notification.id}>
                                <div 
                                    className={notificationItem}
                                    data-type={notification.type}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className={notificationContent}>
                                        <div className={notificationTitle}>
                                            {notification.unread && (
                                                <span className={unreadDot}></span>
                                            )}
                                            {notification.title}
                                        </div>
                                        
                                        {notification.hotelName && (
                                            <div className={hotelName}>
                                                {notification.hotelName}
                                            </div>
                                        )}
                                        
                                        <div className={notificationMessage}>
                                            {notification.message}
                                        </div>
                                        
                                        {notification.bookingInfo && (
                                            <div className={bookingInfo}>
                                                {notification.bookingInfo}
                                            </div>
                                        )}
                                        
                                        <div className={notificationTime}>
                                            {notification.time || formatTime(notification.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                {index < displayNotifications.length - 1 && (
                                    <div className={notificationDivider}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notification;