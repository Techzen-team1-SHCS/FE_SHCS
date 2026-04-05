import styles from "./AuthLogin.module.css";
import { useAuth } from "../../../hooks/Auth/useLogin";
import GoogleLoginButton from "../../../../../components/Auth/GoogleLoginButton";
import { Link } from "react-router-dom";

export default function Login() {
  const { form, error, loading, handleChange, handleLogin } = useAuth();

  return (
    <div className={styles.container}>
      {/* Dynamic Background */}
      <div className={styles.background}></div>

      {/* Glassmorphism Card */}
      <div className={styles.glassCard}>
        <div className={styles.logo}>
          <img src="/assets/images/logos/logo-two.png" alt="Travelwise Admin" />
        </div>

        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Enter your details to access the manager dashboard</p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.formGroup}>
          <label>Email Address</label>
          <input
            className={styles.input}
            type="email"
            placeholder="manager@hotel.com"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Password</label>
          <input
            className={styles.input}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <label className={styles.remember}>
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <Link to="/hotel-manager/password-reset" className={styles.forgot}>
            Forgot Password?
          </Link>
        </div>

        <button
          className={styles.loginBtn}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className={styles.signupText}>
          Don’t have an account?{" "}
          <Link to="/hotel-manager/register" className={styles.link}>
            Register Here
          </Link>
        </p>

        <div className={styles.divider}>Or</div>

        <div className={styles.googleWrapper}>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
