import { useContext, useState } from 'react'
import './style.css';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';
import { toast } from 'react-toastify';
import { AuthContext } from '../../../contexts/AuthContext';
const LoginPage = () => {
    const navigate = useNavigate()
    const { login } = useContext(AuthContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const validateForm = () => {
        const newErrors = {}

        // Validate email
        if (!email.trim()) {
            newErrors.email = 'Email là bắt buộc'
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email không hợp lệ'
        }

        // Validate password
        if (!password) {
            newErrors.password = 'Mật khẩu là bắt buộc'
        } else if (password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        try {
            const result = await authService.login(email, password)

            if (result.status === 200) {
                const user = result.user
                const token = result.token

                if (!user || !token) {
                    toast.error("Không lấy được dữ liệu người dùng. Vui lòng thử lại.")
                    return
                }

                // 🔹 Kiểm tra role - chỉ cho phép role = 1 (admin) đăng nhập
                if (user.role !== 1) {
                    toast.error('Tài khoản không có quyền truy cập trang quản trị')
                    return
                }

                // 🔹 Lấy thông tin chi tiết user nếu cần
                const userRes = await authService.getUserById(user.id)
                const fullUser = userRes.user || user

                // 🔹 Lưu vào context & localStorage
                login(fullUser, token)
                toast.success('Đăng nhập Admin thành công!')
                navigate('/admin/dashboard') // Chuyển hướng đến dashboard admin
            }
        } catch (error) {
            console.error('Admin login error:', error)

            if (error.response?.data?.errors) {
                const apiErrors = error.response.data.errors
                const newErrors = {}
                Object.keys(apiErrors).forEach(key => {
                    newErrors[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key]
                })
                setErrors(newErrors)
                toast.error('Vui lòng kiểm tra lại thông tin đăng nhập')
            } else {
                toast.error(error.response?.data?.message || error.response?.data?.error || 'Tài khoản hoặc mật khẩu không đúng vui lòng kiểm tra lại')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const handleInputChange = (field, value) => {
        if (field === 'email') {
            setEmail(value)
        } else if (field === 'password') {
            setPassword(value)
        }

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <div className="admin-login-card">
                    {/* Header */}
                    <div className="admin-login-header">
                        <div className="admin-logo">
                            <i className="fas fa-shield-alt"></i>
                            <h2>Admin System</h2>
                        </div>
                        <p className="admin-login-subtitle">Đăng nhập vào trang quản trị</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="admin-login-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                <i className="fas fa-envelope"></i>
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`form-input ${errors.email ? 'error' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                <i className="fas fa-lock"></i>
                                Mật khẩu
                            </label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`form-input ${errors.password ? 'error' : ''}`}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={togglePasswordVisibility}
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <i className="far fa-eye-slash"></i>
                                    ) : (
                                        <i className="far fa-eye"></i>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <span className="error-message">{errors.password}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`admin-login-btn ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Đang đăng nhập...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i>
                                    Đăng nhập
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="admin-login-footer">
                        <p className="security-notice">
                            <i className="fas fa-info-circle"></i>
                            Chỉ tài khoản Admin mới có quyền truy cập
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage