import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordField({ label, value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label>{label}</label>
      <div style={{ display: "flex", border: "1px solid #ddd", padding: "10px" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          style={{ flex: 1, border: "none" }}
        />
        <span onClick={() => setShow(!show)}>
          {show ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
    </div>
  );
}