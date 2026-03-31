import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import GoogleLoginButton from './GoogleLoginButton';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import "../Auth/index.css"
import styles from './Auth.module.css';
import LoaderButton from '../Loading/LoaderButton';

const Auth = ({ setIsAuthVisible, isLogin, setIsLogin }) => {
    const {
        authPopup,
        authOverlay,
        authContainer,
        authHeader,
        authClose,
        formAuthGroup,
        authSubmitBtn,
        authFooter,
        authToggle,
        passwordToggle,
        errorMessage,
        forgotPassBtn
    } = styles;
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const validateForm = () => {
        const newErrors = {};

        // Validate email
        if (!email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // Validate password
        if (!password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
        } else if (!/[a-z]/.test(password)) {
            newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ thường';
        } else if (!/[0-9]/.test(password)) {
            newErrors.password = 'Mật khẩu phải chứa ít nhất 1 số';
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            newErrors.password = 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt';
        }

        // Validate confirm password for register
        if (!isLogin) {
            if (!confirmPassword) {
                newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
            } else if (password !== confirmPassword) {
                newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            }
        }

        // Validate name for register
        if (!isLogin) {
            if (!name.trim()) {
                newErrors.name = 'Tên không được để trống';
            } else if (name.length < 2) {
                newErrors.name = 'Tên phải có ít nhất 2 ký tự';
            }
        }

        // Validate phone for register
        if (!isLogin) {
            if (!phone.trim()) {
                newErrors.phone = 'Số điện thoại là bắt buộc';
            } else if (!/^[0-9+\-()]+$/.test(phone)) { // bỏ \s để ko cho phép khoảng trắng
                newErrors.phone = 'Số điện thoại không hợp lệ';
            } else if (phone.replace(/[^0-9]/g, '').length < 10) {
                newErrors.phone = 'Số điện thoại phải có ít nhất 10 chữ số';
            } else if (/^(\d)\1+$/.test(phone.replace(/[^0-9]/g, ''))) {
                newErrors.phone = 'Số điện thoại không hợp lệ';
            }
            else if (/\s/.test(phone.trim())) {
                newErrors.phone = 'Số điện thoại không được chứa dấu cách';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleAuthSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    if (isLogin) {
      const result = await authService.login(email, password);

      // ❗ LẤY ĐÚNG KEY
      login(result.user, result.token);

      toast.success('Đăng nhập thành công!');
      setIsAuthVisible(false);
      navigate('/');
    } else {
      const result = await authService.register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        phone,
      });

      if (result.status === 'success') {
        toast.success('Đăng ký thành công!');
        setIsLogin(true);
      }
    }
  } catch (error) {
    if (error.response?.status === 403) {
      toast.warn(error.response.data.message);
    } else if (error.response?.status === 401) {
      toast.error(error.response.data.message);
    } else {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  } finally {
    setIsLoading(false);
  }
};


    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!forgotEmail.trim()) {
            newErrors.forgotEmail = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(forgotEmail)) {
            newErrors.forgotEmail = 'Email không hợp lệ';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;
        setIsLoading(true);
        try {
            const result = await authService.forgotPassword(forgotEmail);
            if (result.status === 200 || result.status === 'success') {
                toast.success('Email đặt lại mật khẩu đã được gửi!');
                setIsForgotPassword(false);
                setForgotEmail('');
                setIsAuthVisible(false);
                navigate('/');
            } else {
                toast.error(result.message || 'Không thể gửi email, vui lòng thử lại');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi gửi email');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setErrors({});
        setName('');
        setPhone('');
        setShowPassword(false);
        setShowConfirmPassword(false);
        setForgotEmail('')
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const handleInputChange = (field, value) => {
        if (field === 'email') {
            setEmail(value);
        } else if (field === 'password') {
            setPassword(value);
        } else if (field === 'confirmPassword') {
            setConfirmPassword(value);
        } else if (field === 'name') {
            setName(value);
        } else if (field === 'phone') {
            setPhone(value);
        } else if (field === 'forgotEmail') {
            setForgotEmail(value);
        }
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className={authPopup}>
            <div className={authOverlay} onClick={() => setIsAuthVisible(false)}></div>
            <div className={authContainer}>
                <div className={authHeader}>
                    <h3>{isForgotPassword ? 'Quên mật khẩu' : isLogin ? 'Đăng nhập' : 'Đăng ký'}</h3>
                    <button
                        className={authClose}
                        onClick={() => setIsAuthVisible(false)}
                    >
                        ×
                    </button>
                </div>
                {isForgotPassword ? (
                    <form onSubmit={handleForgotPasswordSubmit} className="auth-form">
                        <div className={formAuthGroup}>
                            <label htmlFor="forgotEmail">Email</label>
                            <input
                                type="forgotEmail"
                                id="forgotEmail"
                                placeholder="Nhập email của bạn"
                                value={forgotEmail}
                                onChange={(e) => handleInputChange('forgotEmail', e.target.value)}
                                required
                                className={errors.forgotEmail ? 'error' : ''}
                            />
                            {errors.forgotEmail && <span className={errorMessage}>{errors.forgotEmail}</span>}
                        </div>
                        <button type="submit" className={authSubmitBtn}>
                            {isLoading ? <LoaderButton /> : 'Gửi email đặt lại mật khẩu'}
                        </button>
                        <div
                            className={authToggle}
                            style={{
                                textAlign: "center",
                                marginTop: "12px",
                                cursor: "pointer",
                            }}
                            onClick={() => setIsForgotPassword(false)}
                        >
                            ← Quay lại đăng nhập
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleAuthSubmit} className="auth-form" noValidate>
                        <div className={formAuthGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                required
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className={errorMessage}>{errors.email}</span>}
                        </div>

                        {!isLogin && (
                            <div className={formAuthGroup}>
                                <label htmlFor="name">Họ và tên</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Nhập họ và tên"
                                    value={name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={errors.name ? 'error' : ''}
                                />
                                {errors.name && <span className={errorMessage}>{errors.name}</span>}
                            </div>
                        )}

                        {!isLogin && (
                            <div className={formAuthGroup}>
                                <label htmlFor="phone">Số điện thoại</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    placeholder="Nhập số điện thoại"
                                    value={phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={errors.phone ? 'error' : ''}
                                />
                                {errors.phone && <span className={errorMessage}>{errors.phone}</span>}
                            </div>
                        )}

                        <div className={formAuthGroup}>
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                required
                                className={errors.password ? 'error' : ''}
                            />
                            <button
                                type="button"
                                className={passwordToggle}
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <i className="far fa-eye"></i>
                                ) : (
                                    <i className="far fa-eye-slash"></i>
                                )}
                            </button>
                            {errors.password && (
                                <span className={errorMessage}>{errors.password}</span>
                            )}
                        </div>

                        {isLogin && (
                            <div
                                className={forgotPassBtn}
                                onClick={() => setIsForgotPassword(true)}
                            >
                                Quên mật khẩu
                            </div>
                        )}

                        {!isLogin && (
                            <div className={formAuthGroup}>
                                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    placeholder="Nhập lại mật khẩu"
                                    value={confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    className={errors.confirmPassword ? 'error' : ''}
                                />
                                <button
                                    type="button"
                                    className={passwordToggle}
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? (
                                        <i className="far fa-eye"></i>
                                    ) : (
                                        <i className="far fa-eye-slash"></i>
                                    )}
                                </button>
                                {errors.confirmPassword && (
                                    <span className={errorMessage}>{errors.confirmPassword}</span>
                                )}
                            </div>
                        )}

                        <button type="submit" className={authSubmitBtn}>
                            {isLoading ? <LoaderButton /> : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
                        </button>

                        <GoogleLoginButton
                            onSuccess={() => {
                                setIsAuthVisible?.(false);
                                navigate('/');
                            }}
                        />
                    </form>
                )}

                {!isForgotPassword && (
                    <div className={authFooter}>
                        <p>
                            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                            <span className={authToggle} onClick={toggleAuthMode}>
                                {isLogin ? ' Đăng ký ngay' : ' Đăng nhập ngay'}
                            </span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Auth