import { useState } from "react";
import { mockLogin, mockRegister } from "../../Mock/AutMock";
import { validateLogin, validateRegister } from "../../Helpers/Auth/authHelper";

export function useAuth() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    const err = validateLogin(form);
    if (err) return setError(err);

    const res = mockLogin(form);
    console.log(res);
  };

  const handleRegister = () => {
    const err = validateRegister(form);
    if (err) return setError(err);

    const res = mockRegister(form);
    console.log(res);
  };

  return {
    form,
    error,
    handleChange,
    handleLogin,
    handleRegister
  };
}