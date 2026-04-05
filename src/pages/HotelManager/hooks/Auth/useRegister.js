import { useState } from "react";
import api from "../../../../services/api";
import { toast } from "react-toastify";

export const useRegister = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [file, setFile] = useState(null);
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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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

    if (!file) {
      setError("Vui lòng tải lên Giấy phép kinh doanh (hình ảnh).");
      return;
    }

    setLoading(true);
    setError(null);
    setErrors({});

    try {
      // 1. Upload ảnh giấy phép lên ImgBB
      const imgBBApiKey = import.meta.env.VITE_IMGBB_API_KEY;
      const formData = new FormData();
      formData.append("image", file);

      const uploadResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgBBApiKey}`, {
        method: "POST",
        body: formData,
      });

      const imgData = await uploadResponse.json();

      if (!imgData.success) {
        throw new Error("Không thể tải lên giấy phép kinh doanh.");
      }

      const downloadURL = imgData.data.url;

      // 2. Gọi API đăng ký kèm đường dẫn ảnh
      const data = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        password: form.password,
        password_confirmation: form.confirmPassword,
        business_license_url: downloadURL,
        role: 2,
      };

      const response = await api.post("/auth/hotel-manager/register", data);

      if (response.data.status === "success") {
        setSuccess(true);
        toast.success("Đăng ký thành công!");
        // setTimeout(() => navigate("/hotel-manager/login"), 3000);
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.message || "Dữ liệu không hợp lệ");
        setErrors(err.response.data.errors);
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
    file,
    showPass,
    showConfirm,
    loading,
    error,
    errors,
    success,
    handleChange,
    handleFileChange,
    togglePass,
    toggleConfirm,
    handleSubmit,
  };
};
