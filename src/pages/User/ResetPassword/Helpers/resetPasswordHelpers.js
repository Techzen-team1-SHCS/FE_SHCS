import {
  PASSWORD_MIN_LENGTH,
  RESET_PASSWORD_MESSAGES
} from "../Constants/resetPasswordConstants";

export const validateResetPassword = (password, confirmPassword) => {
  const errors = {};

  if (!password) {
    errors.password = RESET_PASSWORD_MESSAGES.PASSWORD_REQUIRED;
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    errors.password = RESET_PASSWORD_MESSAGES.PASSWORD_MIN;
  }

  if (!confirmPassword) {
    errors.confirmPassword = RESET_PASSWORD_MESSAGES.CONFIRM_REQUIRED;
  } else if (password !== confirmPassword) {
    errors.confirmPassword = RESET_PASSWORD_MESSAGES.CONFIRM_NOT_MATCH;
  }

  return errors;
};