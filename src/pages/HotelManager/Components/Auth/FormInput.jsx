export default function FormInput({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}