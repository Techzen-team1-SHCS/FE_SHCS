import React from "react";
import styles from "./AdminLayout.module.css";
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from "../../components/Sidebar/Sidebar";
const AdminLayout = () => {
    const {
        layout,
        header,
        title,
        mainContent,
        sidebar,
        contentArea
    } = styles;
    const location = useLocation();

    const getTitleFromPath = () => {
        const pathToTitle = {
            "/admin/dashboard": "Dashboard",
            "/admin/booking-manage": "Bookings Management",
            "/admin/reports": "Reports & Analytics",
            "/admin/guests": "Guest Management",
            "/admin/hotels": "Hotel Management", 
            "/admin/settings": "Settings"
        };
        
        return pathToTitle[location.pathname] || "Admin Panel";
    };
    return (
        <div className={layout}>
            <div className={sidebar}>
                <Sidebar/>
            </div>
            <div className={mainContent}>
                <header className={header}>
                    <div className={title}>{getTitleFromPath()}</div>
                    <div>
                        <div>
                            <img></img>
                        </div>
                        
                    </div>
                </header>
                <div className={contentArea}>
                    <Outlet/>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;