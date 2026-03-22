export const LOGIN_FIELDS = [
  { name: "email", type: "text", placeholder: "Email" },
  { name: "password", type: "password", placeholder: "Password" }
];

export const REGISTER_FIELDS = [
  { name: "firstName", placeholder: "First Name" },
  { name: "lastName", placeholder: "Last Name" },
  { name: "email", placeholder: "Email" },
  { name: "phone", placeholder: "Phone Number" },
  { name: "password", placeholder: "Password", type: "password" },
  { name: "confirmPassword", placeholder: "Confirm Password", type: "password" }
];

export const FORGOT_PLACEHOLDER = "Minhvan@gmail.com";

export const FORGOT_TEXT = {
  title: "Forgot your password?",
  desc: "Don’t worry, happens to all of us. Enter your email below to recover your password",
  button: "Submit",
  back: "Back to login"
};

export const RESET_TEXT = {
  title: "Set a password",
  desc: "Your previous password has been reseted. Please set a new password for your account.",
  newPassword: "Create Password",
  confirmPassword: "Re-enter Password",
  button: "Set password"
};