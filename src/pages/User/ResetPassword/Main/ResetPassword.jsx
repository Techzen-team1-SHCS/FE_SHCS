import "react-toastify/dist/ReactToastify.css";
import { useResetPassword } from "../Hooks/useResetPassword";
import ResetPasswordForm from "../Component/ResetPasswordForm/ResetPasswordForm";

const ResetPassword = () => {
  const {
    password,
    confirmPassword,
    errors,
    setPassword,
    setConfirmPassword,
    handleResetClick
  } = useResetPassword();

  return (
    <div className="page-wrapper">
      <ResetPasswordForm
        password={password}
        confirmPassword={confirmPassword}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        errors={errors}
        onReset={handleResetClick}
      />
    </div>
  );
};

export default ResetPassword;