import { GoogleLogin } from "@react-oauth/google";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton({ onSuccess }) {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) return toast.error("Không lấy được mã Google!");

    const result = await authService.loginGoogle(idToken);

    if (result.success) {
      const token = result.token;
      const fullUser = result.user;

      // Lưu vào context + localStorage
      login(fullUser, token);

      toast.success(`Xin chào ${fullUser.name}!`);
      if (onSuccess) onSuccess(fullUser);
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => toast.error("Đăng nhập Google thất bại!")}
    />
  );
}
