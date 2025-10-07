import React, { useState } from 'react'
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import GoogleLoginButton from './GoogleLoginButton';
const Auth = ({ setIsAuthVisible }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [username, setUsername] = useState('');
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
        } else {
            const hasMinLength = password.length >= 8;
            const hasSpecialChar = /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password);

            // Ưu tiên hiển thị cả 2 lỗi cùng lúc
            if (!hasMinLength && !hasSpecialChar) {
                newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 ký tự đặc biệt';
            }
            // Các trường hợp khác hiển thị lỗi riêng
            else if (!hasMinLength) {
                newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
            } else if (!hasSpecialChar) {
                newErrors.password = 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt';
            }
        }
        if (!isLogin) {
            if (!username.trim()) {
                newErrors.username = 'Tên người dùng là bắt buộc';
            } else if (username.length < 3) {
                newErrors.username = 'Tên người dùng phải có ít nhất 3 ký tự';
            } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                newErrors.username = 'Tên người dùng chỉ được chứa chữ cái, số và dấu gạch dưới';
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
                        setIsAuthVisible(false);
                        window.location.reload();
                    }
                } else {
                    const result = await authService.register({
                        name: username,
                        email,
                        password
                    });
                    if (result.status === 'success') {
                        toast.success('Đăng ký thành công!');
                        setIsLogin(true);
                    }
                }
            } catch (error) {
                toast.error(error.response?.data?.error || 'Có lỗi xảy ra');
            }
        }
    };
    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setErrors({});
        setUsername('');
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleInputChange = (field, value) => {
        if (field === 'email') {
            setEmail(value);
        } else if (field === 'password') {
            setPassword(value);
        } else if (field === 'username') {
            setUsername(value);
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
                            <label htmlFor="username">Tên người dùng</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Nhập tên người dùng"
                                value={username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                                className={errors.username ? 'error' : ''}
                            />
                            {errors.username && <span className="error-message">{errors.username}</span>}
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
                                <i className="far fa-eye "></i> // Icon ẩn mật khẩu
                            ) : (
                                <i className="far fa-eye-slash"></i> // Icon hiện mật khẩu
                            )}
                        </button>
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
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
