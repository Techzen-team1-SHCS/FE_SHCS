import React, { useContext } from "react";
import styles from "./AdminLayout.module.css";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from "../../components/Sidebar/Sidebar";
import { AuthContext } from '../../contexts/AuthContext';

const AdminLayout = () => {
    const {
        layout,
        header,
        title,
        mainContent,
        sidebar,
        contentArea,
        userInfo,
        userName,
        userRole
    } = styles;
    
    const location = useLocation();
    const { user } = useContext(AuthContext);

    const getTitleFromPath = () => {
        const pathToTitle = {
            "/admin/dashboard": "Dashboard",
            "/admin/booking-manage": "Quản lý đặt phòng",
            "/admin/rooms-manage": "Quản lý phòng",
            "/admin/users-manage": "Quản lý người dùng",
            "/admin/notification": "Thông báo",
            "/admin/settings": "Cài đặt"
        };

        return pathToTitle[location.pathname] || "Admin Panel";
    };

    const getRoleText = (role) => {
        return role === 1 ? "Quản trị viên" : "Người dùng";
    };

    return (
        <div className={layout}>
            <div className={sidebar}>
                <Sidebar />
            </div>
            <div className={mainContent}>
                <header className={header}>
                    <div className={title}>{getTitleFromPath()}</div>
                    
                    {/* User Info Section - Simple */}
                    <div className={userInfo}>
                        <div className={userName}>
                            Xin chào, {user?.name || 'Admin'}
                        </div>
                        <div className={userRole}>
                            {getRoleText(user?.role)}
                        </div>
                    </div>
                </header>
                <div className={contentArea}>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;