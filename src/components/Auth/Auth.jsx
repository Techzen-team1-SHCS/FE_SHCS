import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import GoogleLoginButton from './GoogleLoginButton';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
const Auth = ({ setIsAuthVisible,isLogin, setIsLogin}) => {
    const navigate = useNavigate();
    const{login}=useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
   
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
            } else if (!/^[0-9+\-\s()]+$/.test(phone)) {
                newErrors.phone = 'Số điện thoại không hợp lệ';
            } else if (phone.replace(/[^0-9]/g, '').length < 10) {
                newErrors.phone = 'Số điện thoại phải có ít nhất 10 chữ số';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                if (isLogin) {
                    const result = await authService.login(email, password);
                    if (result.status === 200) {
                        toast.success('Đăng nhập thành công!');
                        login(result.user,result.token);
                        setIsAuthVisible(false);
                    }
                } else {
                    const result = await authService.register({
                        name,
                        email,
                        password,
                        password_confirmation: confirmPassword,
                        phone
                    });
                    if (result.status === 'success') {
                        toast.success('Đăng ký thành công!');
                        setIsLogin(true);
                        // Reset form
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                        setName('');
                        setPhone('');
                        setErrors({});
                    }
                }
            } catch (error) {
                console.error('Auth error:', error);
                if (error.response?.data?.errors) {
                    // Handle validation errors from API
                    const apiErrors = error.response.data.errors;
                    const newErrors = {};
                    Object.keys(apiErrors).forEach(key => {
                        newErrors[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
                    });
                    setErrors(newErrors);
                    toast.error('Vui lòng kiểm tra lại thông tin');
                } else {
                    toast.error(error.response?.data?.message || error.response?.data?.error || 'Có lỗi xảy ra');
                }
            }
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
        }

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="auth-popup ">
            <div className="auth-overlay" onClick={() => setIsAuthVisible(false)}></div>
            <div className="auth-container">
                <div className="auth-header">
                    <h3>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h3>
                    <button
                        className="auth-close"
                        onClick={() => setIsAuthVisible(false)}
                    >
                        ×
                    </button>
                </div>
                <form onSubmit={handleAuthSubmit} className="auth-form" noValidate>
                    <div className="formAuth-group">
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
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    {!isLogin && (
                        <div className="formAuth-group">
                            <label htmlFor="name">Họ và tên</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Nhập họ và tên"
                                value={name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={errors.name ? 'error' : ''}
                            />
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>
                    )}
                    {!isLogin && (
                        <div className="formAuth-group">
                            <label htmlFor="phone">Số điện thoại</label>
                            <input
                                type="tel"
                                id="phone"
                                placeholder="Nhập số điện thoại"
                                value={phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>
                    )}
                    <div className="formAuth-group ">
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
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <i className="far fa-eye "></i>
                            ) : (
                                <i className="far fa-eye-slash"></i>
                            )}
                        </button>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                    {!isLogin && (
                        <div className="formAuth-group ">
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
                                className="password-toggle"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? (
                                    <i className="far fa-eye "></i>
                                ) : (
                                    <i className="far fa-eye-slash"></i>
                                )}
                            </button>
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                    )}
                    <button type="submit" className="auth-submit-btn">
                        {isLogin ? 'Đăng nhập' : 'Đăng ký'}
                    </button>
                    <GoogleLoginButton
                        onSuccess={() => {
                            // Đóng popup, điều hướng nếu cần
                            setIsAuthVisible?.(false);
                            navigate('/');
                        }}
                    />
                </form>
                <div className="auth-footer">
                    <p>
                        {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                        <span
                            className="auth-toggle"
                            onClick={toggleAuthMode}
                        >
                            {isLogin ? ' Đăng ký ngay' : ' Đăng nhập ngay'}
                        </span>
                    </p>
                </div>
            </div>
        </div>

    )
}

export default Auth