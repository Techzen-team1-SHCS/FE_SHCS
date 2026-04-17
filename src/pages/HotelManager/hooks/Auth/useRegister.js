import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../services/api";

export const useRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
    // Xóa error khi user bắt đầu nhập lại
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const togglePass = () => setShowPass((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  const handleSubmit = async () => {
    if (!form.agree) {
      setError("Bạn phải đồng ý với các điều khoản và chính sách.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    setError(null);
    setErrors({});

    try {
      const data = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.confirmPassword, // Laravel confirmed validation
        role: 2 // Hotel manager role
      };

      const response = await api.post('/auth/register', data);

      setSuccess(true);
      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        navigate('/hotel-manager/login');
      }, 1500);
      console.log("Registration successful:", response.data);
    } catch (err) {
      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        // Flatten array errors to string
        const formattedErrors = {};
        Object.keys(validationErrors).forEach(key => {
          if (Array.isArray(validationErrors[key])) {
            formattedErrors[key] = validationErrors[key][0]; // Lấy lỗi đầu tiên
          } else {
            formattedErrors[key] = validationErrors[key];
          }
        });
        setErrors(formattedErrors);
        setError(err.response.data.message || "Dữ liệu không hợp lệ");
      } else {
        setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    showPass,
    showConfirm,
    loading,
    error,
    errors,
    handleChange,
    togglePass,
    toggleConfirm,
    handleSubmit
  };
};