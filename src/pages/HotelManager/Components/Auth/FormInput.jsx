export default function FormInput({ label, name, value, onChange, placeholder, error }) {
  return (
    <div>
      <label>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={error ? { borderColor: "#dc3545", borderWidth: "1px" } : {}}
      />
      {error && <span style={{ color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block" }}>{error}</span>}
    </div>
  );
}