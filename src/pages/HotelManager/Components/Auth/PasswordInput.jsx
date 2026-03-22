import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({
  label,
  name,
  value,
  onChange,
  show,
  toggle
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
        />
        <span
          onClick={toggle}
          style={{ position: "absolute", right: 10, top: 10, cursor: "pointer" }}
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </div>
  );
}