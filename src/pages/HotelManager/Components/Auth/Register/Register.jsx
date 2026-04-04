import styles from "./AuthRegister.module.css";
import GoogleLoginButton from "../../../../../components/Auth/GoogleLoginButton";
import { REGISTER_FIELDS } from "./registerField";
import { useRegister } from "../../../hooks/Auth/useRegister";
import FormInput from "../FormInput";
import PasswordInput from "../PasswordInput";
import { Link } from "react-router-dom";

export default function Register() {
  const {
    form,
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
  } = useRegister();

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.background}></div>
        <div className={styles.glassCard} style={{ textAlign: "center", maxWidth: "440px" }}>
          <img src="/assets/images/logos/logo-two.png" alt="Travelwise Admin" style={{ height: "56px", margin: "0 auto 24px" }} />
          <h2 className={styles.title}>Đăng ký thành công!</h2>
          <p className={styles.subtitle} style={{ marginBottom: "30px", fontSize: "16px" }}>
            Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.
          </p>
          <Link to="/hotel-manager/login" className={styles.loginBtn} style={{ display: "inline-block", textAlign: "center", textDecoration: "none" }}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Dynamic Background */}
      <div className={styles.background}></div>

      {/* Glassmorphism Card */}
      <div className={styles.glassCard}>
        <div className={styles.logo}>
          <img src="/assets/images/logos/logo-two.png" alt="Travelwise Admin" />
        </div>

        <h2 className={styles.title}>Partner Registration</h2>
        <p className={styles.subtitle}>
          Join us and manage your property effortlessly.
        </p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className={styles.grid}>
            {REGISTER_FIELDS.map((f) => (
              <div key={f.name} className={styles.formGroup}>
                <FormInput
                  label={f.label}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  error={errors[f.name]}
                />
              </div>
            ))}

            <div className={styles.inputGroupFull}>
              <label htmlFor="businessLicense">Business License (Giấy phép kinh doanh) *</label>
              <input
                id="businessLicense"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <p className={styles.fileHelper}>Dùng ảnh chụp giấy phép kinh doanh để xác thực tài khoản.</p>
            </div>

            <div className={styles.inputGroupFull}>
              <PasswordInput
                label="Password"
                name="password"
                value={form.password}
                onChange={handleChange}
                show={showPass}
                toggle={togglePass}
                error={errors.password}
              />
            </div>

            <div className={styles.inputGroupFull}>
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                show={showConfirm}
                toggle={toggleConfirm}
                error={errors.confirmPassword}
              />
            </div>

            {/* TERMS */}
            <div className={styles.terms}>
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
              />
              <span>
                I agree to the <b>Terms</b> and <b>Privacy Policies</b>
              </span>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className={styles.registerBtn}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className={styles.loginText}>
          Already a partner?{" "}
          <Link to="/hotel-manager/login" className={styles.link}>
            Sign In
          </Link>
        </p>

        <div className={styles.divider}>Or Register with</div>

        <div className={styles.google}>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
