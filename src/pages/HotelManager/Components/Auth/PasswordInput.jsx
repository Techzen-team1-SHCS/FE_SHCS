import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  show,
  toggle,
  error
}) {
  return (
    <div>
      <label>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          style={error ? { borderColor: "#dc3545", borderWidth: "1px" } : {}}
        />
        <span
          onClick={toggle}
          style={{ position: "absolute", right: 10, top: 10, cursor: "pointer" }}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
      {error && <span style={{ color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block" }}>{error}</span>}
    </div>
  );
}