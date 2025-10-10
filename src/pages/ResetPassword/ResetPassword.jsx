import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services/authService";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ Lấy token từ URL params và email từ query
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const validateForm = () => {
    const newErrors = {};

    if (!password) newErrors.password = "Vui lòng nhập mật khẩu mới";
    else if (password.length < 6)
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";

    if (!confirmPassword)
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetClick = async () => {
    if (!validateForm()) return;

    try {
      // ✅ Gửi cả token + email + password
      const result = await authService.resetPassword({
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      if (result.status === 200 || result.status === "success") {
        toast.success("Đặt lại mật khẩu thành công!");
        navigate("/");
      } else {
        toast.error(result.message || "Không thể đặt lại mật khẩu");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.response?.data?.message || "Lỗi khi đặt lại mật khẩu");
    }
  };

  return (
    <div className="page-wrapper">
      <section className="error-area pt-200 pb-100 rel z-1">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-xl-5 col-lg-6">
              <div
                className="error-content rmb-55"
                data-aos="fade-left"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <h1>Reset password</h1>
                <p>Vui lòng đặt lại mật khẩu mới</p>

                <div className="newsletter-form mt-10 mb-10">
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {errors.password && (
                    <p className="text-danger">{errors.password}</p>
                  )}
                </div>

                <div className="newsletter-form mt-10 mb-10">
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-danger">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="theme-btn bgc-secondary style-two"
                  onClick={handleResetClick}
                >
                  <span data-hover="Reset">Reset</span>
                  <i className="fal fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <div className="col-xl-5 col-lg-6">
              <div
                className="error-images"
                data-aos="fade-right"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <img
                  src="assets/images/newsletter/404.png"
                  alt="Reset Password"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResetPassword;
