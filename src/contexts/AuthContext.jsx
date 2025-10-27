import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

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
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem("user", JSON.stringify(updatedUserData));
  };
  return (
    <AuthContext.Provider value={{ user, token, login, logout,updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
