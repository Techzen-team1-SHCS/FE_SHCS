import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "../../../../services/authService";
import { validateResetPassword } from "../Helpers/resetPasswordHelpers";
import { RESET_PASSWORD_MESSAGES } from "../Constants/resetPasswordConstants";

export const useResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const handleResetClick = async () => {
    const validationErrors = validateResetPassword(password, confirmPassword);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await authService.resetPassword({
        token,
        email,
        password,
        password_confirmation: confirmPassword
      });

      if (result.status === 200 || result.status === "success") {
        toast.success(RESET_PASSWORD_MESSAGES.SUCCESS);
        navigate("/");
      } else {
        toast.error(result.message || RESET_PASSWORD_MESSAGES.ERROR);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(
        error.response?.data?.message ||
          RESET_PASSWORD_MESSAGES.SERVER_ERROR
      );
    }
  };

  return {
    password,
    confirmPassword,
    errors,
    setPassword,
    setConfirmPassword,
    handleResetClick
  };
};