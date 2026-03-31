import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../../services/api";
import { toast } from "react-toastify";

export const useRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
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
        password_confirmation: form.confirmPassword,
        role: 2,
      };

      const response = await api.post("/auth/register", data);
      if (response.data.status === "success") {
        setSuccess(true);
        toast.success("Đăng ký thành công");
        navigate("/hotel-manager/login");
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.message || "Dữ liệu không hợp lệ");
      } else {
        setError(
          err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.",
        );
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
    handleSubmit,
  };
};
