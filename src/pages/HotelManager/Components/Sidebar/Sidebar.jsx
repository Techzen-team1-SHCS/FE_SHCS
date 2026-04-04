import { useContext, useState, useEffect } from "react";
import styles from "./Sidebar.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from '../../../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FiBell } from "react-icons/fi";
import { FaChartBar } from "react-icons/fa";
import { FaHotel } from "react-icons/fa";
import { MdAddBusiness } from "react-icons/md";
import { FaBed } from "react-icons/fa";
import { FiTool } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import { notificationService } from '../../../../services/notificationService';
import '../../../../config/echo';

const Sidebar = () => {
    const {
        sidebar,
        logo,
        nav,
        navList,
        navItem,
        active,
        icon,
        notActive,
        navLink,
        logoutButton
    } = styles;

    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch unread count & listen to realtime events
    useEffect(() => {
        if (!user) return;

        const fetchUnread = async () => {
            try {
                const res = await notificationService.getUnreadCount();
                if (res.status === 'success') {
                    setUnreadCount(res.unread_count || 0);
                }
            } catch (error) {
                console.error("Lỗi lấy số lượng thông báo", error);
            }
        };

        fetchUnread();

        if (window.Echo) {
            const channel = window.Echo.private(`user.${user.id}`);
            channel.listen('NotificationSuccess', () => {
                setUnreadCount(prev => prev + 1);
            });

            return () => {
                window.Echo.leave(`user.${user.id}`);
            };
        }
    }, [user]);

    // Also listen to a custom window event in case the Notification page marks it as read
    useEffect(() => {
        const handleUnreadUpdate = () => {
            // refresh
            notificationService.getUnreadCount()
                .then(res => setUnreadCount(res.unread_count || 0))
                .catch(() => { });
        };

        window.addEventListener('notifications-read', handleUnreadUpdate);
        return () => window.removeEventListener('notifications-read', handleUnreadUpdate);
    }, []);

    const handleLogout = () => {
        logout();
        toast.success('Đăng xuất thành công!');
        navigate('/hotel-manager/login');
    };

    const menuItems = [
        { path: "/hotel-manager/hotel", label: "Hotel", icon: <FaHotel /> },
        { path: "/hotel-manager/rooms", label: "Rooms", icon: <FaBed /> },
        { path: "/hotel-manager/registerhotel", label: "RegisterHotel", icon: <MdAddBusiness /> },
        { path: "/hotel-manager/analysis", label: "Analysis", icon: <FaChartBar /> },
        { path: "/hotel-manager/chat", label: "Chat HM", icon: <span>💬</span> },
        { path: "/hotel-manager/housekeeping", label: "HouseKeeping", icon: <FiTool /> },
        { path: "/hotel-manager/notification", label: "Notifications", icon: <FiBell /> },
        { path: "/hotel-manager/staff", label: "Staff", icon: <FaUsers /> },
        {
            path: "/hotel-manager/notification", label: "Notifications", icon: (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <FiBell />
                    {unreadCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: '#ff4d4f',
                            color: 'white',
                            borderRadius: '50%',
                            padding: '2px 6px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            lineHeight: 1
                        }}>
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </div>
            )
        },
    ];

    return (
        <div className={sidebar}>
            <div className={logo}>
                <div className="logo-outer">
                    <div className="logo">
                        <Link to="/">
                            <img src="/assets/images/logos/logo-two.png" alt="Logo" title="Logo" />
                        </Link>
                    </div>
                </div>
            </div>
            <nav className={nav}>
                <ul className={navList}>
                    {menuItems.map((item) => (
                        <li key={item.path} className={navItem}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `${navLink} ${isActive ? active : notActive}`
                                }
                                end={item.path === "/hotel-manager/notification" ? false : undefined}
                            >
                                <span className={icon}>{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}

                    {/* Logout Button */}
                    <li className={navItem}>
                        <button
                            className={`${navLink} ${logoutButton}`}
                            onClick={handleLogout}
                        >
                            <span className={icon}>🚪</span>
                            <span>Log out</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;