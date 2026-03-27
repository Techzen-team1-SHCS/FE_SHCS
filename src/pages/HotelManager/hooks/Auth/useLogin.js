import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../../services/authService";
import { AuthContext } from "../../../../contexts/AuthContext";

export function useAuth() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentLogins, setRecentLogins] = useState([]);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentLogins");
      if (stored) setRecentLogins(JSON.parse(stored));
    } catch (e) {
      console.error("Error loading recent logins", e);
    }
  }, []);


  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    // Xóa error khi user bắt đầu nhập lại
    if (error) setError("");
  };

  const handleLogin = async () => {
    // Validation cơ bản
    if (!form.email.trim()) {
      setError("Email không được để trống");
      return;
    }
    if (!form.password.trim()) {
      setError("Mật khẩu không được để trống");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authService.login(form.email, form.password);

      // Check role = 2 (Hotel Manager)
      if (result.user.role !== 2) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error("Tài khoản này không có quyền truy cập trang quản lý khách sạn");
      }

      // Login thành công với role 2
      login(result.user, result.token);

      const newRecent = [
        {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          avatar: result.user.image || "https://i.pravatar.cc/150?img=3",
          token: result.token,
          role: result.user.role
        },
        ...recentLogins.filter((x) => x.email !== result.user.email)
      ].slice(0, 4);

      localStorage.setItem("recentLogins", JSON.stringify(newRecent));
      setRecentLogins(newRecent);

      navigate('/hotel-manager/hotel');


    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRecentLogin = (recent) => {
    if (!recent?.token || recent.role !== 2) {
      setError("Không thể login nhanh: tài khoản không hợp lệ");
      return;
    }
    login({ id: recent.id, name: recent.name, email: recent.email, image: recent.avatar, role: recent.role }, recent.token);
    navigate('/hotel-manager/hotel');
  };

  return {
    form,
    error,
    loading,
    recentLogins,
    handleChange,
    handleLogin,
    handleRecentLogin
  };
}