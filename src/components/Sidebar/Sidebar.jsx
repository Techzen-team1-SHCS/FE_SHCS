import React from "react";
import styles from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";

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
        navLink
    } = styles;

    const menuItems = [
        { path: "/admin/dashboard", label: "Dashboard", icon: "📊" },
        { path: "/admin/bookings", label: "Bookings", icon: "📅" },
        { path: "/admin/rooms", label: "Rooms", icon: "📈" },
        { path: "/admin/guests", label: "Guests", icon: "👥" },
        { path: "/admin/messages", label: "Messages", icon: "🏨" },
        { path: "/admin/settings", label: "Settings", icon: "⚙️" },
        { path: "/admin/payment", label: "Payment", icon: "" },
        { path: "/admin/log-out", label: "Log out", icon: "" },
    ];

    return (
        <div className={sidebar}>
            <div className={logo}>
                <h2>SHCS Admin</h2>
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
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;