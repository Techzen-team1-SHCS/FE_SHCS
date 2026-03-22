export const validateRegister = (form) => {
  if (!form.email) return "Email is required";
  if (form.password.length < 6) return "Password too short";
  if (form.password !== form.confirmPassword) return "Passwords not match";
  if (!form.agree) return "You must agree terms";

  return null;
};