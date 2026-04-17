import React from "react";

const ResetPasswordForm = ({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  errors,
  onReset
}) => {
  return (
    <section className="error-area pt-200 pb-100 rel z-1">
      <div className="container">
        <div className="row align-items-center justify-content-between">

          {/* Form */}
          <div className="col-xl-5 col-lg-6">
            <div className="error-content">

              <h1>Reset password</h1>
              <p>Vui lòng đặt lại mật khẩu mới</p>

              {/* Password */}
              <div className="newsletter-form mt-10 mb-10">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {errors.password && (
                <p className="text-danger">{errors.password}</p>
              )}

              {/* Confirm Password */}
              <div className="newsletter-form mt-10 mb-10">
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {errors.confirmPassword && (
                <p className="text-danger">{errors.confirmPassword}</p>
              )}

              {/* Button */}
              <button
                className="theme-btn bgc-secondary style-two"
                onClick={onReset}
              >
                <span data-hover="Reset">Reset</span>
              </button>

            </div>
          </div>

          {/* Image */}
          <div className="col-xl-5 col-lg-6">
            <div className="error-images">
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
  );
};

export default React.memo(ResetPasswordForm);