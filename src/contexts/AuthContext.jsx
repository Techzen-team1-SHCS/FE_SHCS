/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    // Chỉ parse khi storedUser là JSON hợp lệ
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Lỗi parse JSON user:", error);
        localStorage.removeItem("user"); // Xóa giá trị hỏng
      }
    }

    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
    }
  }, []);

  const updateUser = (newUser) => {
    setUser(prev => {
      const merged = { ...prev, ...newUser };
      localStorage.setItem("user", JSON.stringify(merged));
      return merged;
    });
  };

  const login = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
