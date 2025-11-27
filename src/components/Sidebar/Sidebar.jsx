import React, { useContext } from "react";
import styles from "./Sidebar.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

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

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Đăng xuất thành công!');
        navigate('/admin/login');
    };

    const menuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/admin/booking-manage", label: "Bookings", icon: "📅" },
        { path: "/admin/rooms-manage", label: "Rooms", icon: "📈" },
        { path: "/admin/users-manage", label: "Users", icon: "👥" },
        { path: "/admin/notification", label: "Notification", icon: "🏨" },
        { path: "/admin/settings", label: "Settings", icon: "⚙️" },
        { path: "/admin/payment", label: "Payment", icon: "" },
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
                                end={item.path === "/admin/dashboard"}
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