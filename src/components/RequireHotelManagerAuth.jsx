import { Navigate, Outlet, useLocation } from "react-router-dom";

function isHotelManagerSession() {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined") return false;

  const raw = localStorage.getItem("user");
  if (!raw || raw === "undefined") return false;

  try {
    const user = JSON.parse(raw);
    return user?.role === 2;
  } catch {
    return false;
  }
}

/**
 * Bảo vệ toàn bộ route con: chưa đăng nhập hotel manager → /hotel-manager/login
 */
export default function RequireHotelManagerAuth() {
  const location = useLocation();

  if (!isHotelManagerSession()) {
    return (
      <Navigate
        to="/hotel-manager/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}
