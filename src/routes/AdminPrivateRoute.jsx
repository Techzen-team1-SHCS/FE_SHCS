import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const AdminPrivateRoute = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cho AuthContext thời gian sync dữ liệu từ localStorage
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return null; // hoặc return <Spinner />

  // Kiểm tra chưa login
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Kiểm tra không phải admin → văng ra login
  if (user.role !== 1) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminPrivateRoute;
