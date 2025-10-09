
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../services/authService"; // giả sử bạn có API này
import "react-toastify/dist/ReactToastify.css";
const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

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
      const result = await authService.resetPassword({ password });
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

        <div className='page-wrapper'>
            <div className=''>
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
                                    <div className="section-title mt-15 mb-25">
                                        <h2></h2>
                                    </div>
                                    <p>
                                        Vui lòng đặt lại mật khẩu
                                    </p>
                                    <div className="newsletter-form mt-10 mb-10">
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
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
                                        
                                    </div>
                                    {errors.confirmPassword && (
                                            <p className="text-danger">{errors.confirmPassword}</p>
                                        )}
                                    <button type="submit" className="theme-btn bgc-secondary style-two" onClick={handleResetClick}>
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
                                        alt="404 Error"
                                        className="img-fluid"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default ResetPassword
