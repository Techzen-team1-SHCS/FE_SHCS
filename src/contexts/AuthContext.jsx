import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 🟢 Load từ localStorage ban đầu
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [isFetched, setIsFetched] = useState(false); // tránh fetch trùng

  // 🧠 Fetch user từ backend (chỉ gọi khi có token)
  const fetchCurrentUser = async (accessToken) => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      console.error("❌ Lỗi khi fetch user:", error);
      // Nếu API trả lỗi 401 thì mới logout
      if (error.response?.status === 401) logout();
    } finally {
      setLoading(false);
      setIsFetched(true);
    }
  };

  // 🧩 Chạy 1 lần khi mount — chỉ fetch khi token có sẵn trong localStorage
  useEffect(() => {
    if (token && !isFetched) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  // 🟢 Login (sau khi đăng nhập thành công)
  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
  };

  // 🧹 Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
