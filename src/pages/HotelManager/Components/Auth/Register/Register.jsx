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
    handleChange,
    togglePass,
    toggleConfirm,
    handleSubmit,
  } = useRegister();

  return (
    <div className={styles.container}>
      {/* LEFT */}
      <div className={styles.left}>
        <div className={styles.imageCard}>
          <img src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png" />

          <div className={styles.dots}>
            <span className={styles.active}></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <div className={styles.logo}>
          <img src="/logo.png" />
          <span>SHCS</span>
        </div>

        <h2 className={styles.title}>Sign up</h2>
        <p className={styles.subtitle}>
          Let’s get you all set up so you can access your personal account.
        </p>

        {/* INPUT GRID */}
        <div className={styles.grid}>
          {REGISTER_FIELDS.map((f) => (
            <FormInput
              key={f.name}
              label={f.label}
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
            />
          ))}

          <div className={styles.inputGroupFull}>
            <PasswordInput
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              show={showPass}
              toggle={togglePass}
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
            />
          </div>
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
            I agree to all the <b>Terms</b> and <b>Privacy Policies</b>
          </span>
        </div>

        {/* BUTTON */}
        <button className={styles.registerBtn} onClick={handleSubmit}>
          Create account
        </button>

        <p className={styles.loginText}>
          Already have an account?{" "}
          <Link to="/hotel-manager/login" className={styles.link}>
            Login
          </Link>
        </p>

        <div className={styles.divider}>Or Sign up with</div>

        <div className={styles.google}>
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
