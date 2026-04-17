export const validateLogin = ({ email, password }) => {
  if (!email || !password) return "Missing fields";
  return null;
};

export const validateRegister = (data) => {
  if (!data.email || !data.password) return "Missing fields";
  if (data.password !== data.confirmPassword)
    return "Password not match";
  return null;
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};