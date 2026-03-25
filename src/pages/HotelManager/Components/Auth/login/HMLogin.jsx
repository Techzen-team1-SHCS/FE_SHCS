import styles from "./AuthLogin.module.css";
import { useAuth } from "../../../hooks/Auth/useLogin";
import GoogleLoginButton from "../../../../../components/Auth/GoogleLoginButton";
import { Link } from "react-router-dom";

export default function Login() {
  const { form, error, loading, recentLogins, handleChange, handleLogin, handleRecentLogin } = useAuth();

  return (
    <div className={styles.container}>
      {/* LEFT SIDE */}
      <div className={styles.left}>
        {/* LOGO */}
        <div className={styles.logo}>
          <img src="/assets/images/logos/logo-two.png" alt="logo" />
        </div>

        {/* TITLE */}
        <h2 className={styles.title}>Login</h2>
        <p className={styles.subtitle}>
          Login to access your travelwise account
        </p>

        {error && <div className={styles.error}>{error}</div>}

        {/* EMAIL */}
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className={styles.formGroup}>
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>

        {/* OPTIONS */}
        <div className={styles.row}>
          <label className={styles.remember}>
            <input type="checkbox" />
            <span>Remember me</span>
          </label>

          <Link to="/hotel-manager/password-reset" className={styles.ForgotpasswordLink}>
            Forgot password
          </Link>
        </div>

        {/* LOGIN BUTTON */}
        <button
          className={styles.loginBtn}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGN UP */}
        <p>
          Don’t have an account?{" "}
          <Link to="/hotel-manager/register" className={styles.link}>
            Sign up
          </Link>
        </p>

        {/* DIVIDER */}
        <div className={styles.divider}>Or login with</div>

        {/* GOOGLE LOGIN */}
        <div className={styles.googleWrapper}>
          <GoogleLoginButton />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.right}>
        <h3 className={styles.recentTitle}>Recent login</h3>

        <p className={styles.recentSubtitle}>
          Click on the image to log in or add an account.
        </p>

        <div className={styles.cards}>
          {recentLogins.length > 0 ? (
            recentLogins.map((user) => (
              <>
                <div key={user.email} className={styles.card} onClick={() => handleRecentLogin(user)} style={{ cursor: "pointer" }}>
                  <img src={user.avatar || "https://i.pravatar.cc/150?img=3"} alt={user.name} />
                  <div className={styles.cardName}>{user.name}</div>
                </div>
              </>

            ))
          ) : (
            <>
              <div className={styles.card}>
                <img src="https://i.pravatar.cc/150?img=3" alt="user" />
                <div className={styles.cardName}>Van</div>
              </div>
              <div className={styles.card}>
                <div className={styles.addCard}>+</div>
                <div className={styles.cardName}>Add account</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
