import { useContext } from "react";
import styles from "./HotelManagerLayout.module.css";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../pages/HotelManager/Components/Sidebar/Sidebar";
import { AuthContext } from "../../contexts/AuthContext";

const HotelManagerLayout = () => {
  const {
    layout,
    header,
    title,
    mainContent,
    sidebar,
    contentArea,
    userInfo,
    userName,
    userRole,
  } = styles;

  const location = useLocation();
  const { user } = useContext(AuthContext);

  const getTitleFromPath = () => {
    const pathToTitle = {
      "/hotel-manager/hotel": "Hotel",
      "/hotel-manager/rooms": "Rooms",
      "/hotel-manager/housekeeping": "House keeping",
      "/hotel-manager/analysis": "Analysis",
      "/hotel-manager/notification": "Notifications",
    };

    if (
      location.pathname.startsWith("/hotel-manager/hotel/") &&
      location.pathname.split("/").length === 4
    ) {
      return "Hotel Detail";
    }

    return pathToTitle[location.pathname] || "Hotel Manager Panel";
  };

  const getRoleText = (role) => {
    return role === 2 ? "Chủ khách sạn ngu" : "Người dùng";
  };

  return (
    <div className={layout}>
      <div className={sidebar}>
        <Sidebar />
      </div>
      <div className={mainContent}>
        <header className={header}>
          <div className={title}>{getTitleFromPath()}</div>
          <div className={userInfo}>
            <div className={userName}>
              Xin chào, {user?.name || "Hotel Manager"}
            </div>
            <div className={userRole}>{getRoleText(user?.role)}</div>
          </div>
        </header>
        <div className={contentArea}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default HotelManagerLayout;
