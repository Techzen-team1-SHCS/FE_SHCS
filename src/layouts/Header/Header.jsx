import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth from '../../components/Auth/Auth';
import '../Header/index.css'
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import PopUpButton from "../../components/PopupButton/PopUpButton"
import { toast } from 'react-toastify';
import Notification from '../../components/Notification/Notification';
const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const [isAuthVisible, setIsAuthVisible] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthAppear, setIsAuthAppear] = useState(false);
    const [isLogin, setIsLogin] = useState('');

    const handleAuthAppear = () => {
        setIsAuthAppear(!isAuthAppear);
    };
    const navigate = useNavigate();
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= 250) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const navItems = [
        {
            label: "Home",
            path: "/",
            // sub: [
            //     { label: "Travel Agency", path: "/" },
            //     { label: "City Tour", path: "/city-tour" },
            //     { label: "Tour Package", path: "/tour-package" },
            // ],
        },
        { label: "About", path: "/About", },
        {
            label: "Hotels",
            path: "/Hotels",
            sub: [
                { label: "Hotel List", path: "/HotelList" },
                // { label: "Tour Grid", path: "/tour-grid" },
                // { label: "Tour Sidebar", path: "/tour-sidebar" },
                { label: "Hotel Details", path: "/HotelDetail" },
                { label: "Hotel Recommendation", path: "/HotelsRecommend" },
                // { label: "Tour Guide", path: "/tour-guide" },
            ],
        },
        {
            label: "Destinations",
            path: "/destinations",
            sub: [
                { label: "Destination 01", path: "/destination1" },
                // { label: "Destination 02", path: "/destination2" },
                // { label: "Destination Details", path: "/destination-details" },
            ],
        },
        {
            label: "Pages",
            path: "/pages",
            sub: [
                { label: "Contact Us", path: "/ContactUs" },
                { label: "404 Error", path: "*" },
            ],
        },
        {
            label: "Blog",
            path: "/blog",
            sub: [
                { label: "Blog List", path: "/BlogList" },
            ],
        },
    ];
    const renderMenu = (items) => (
        <ul className="navigation clearfix">
            {items.map((item, idx) => (
                <li key={idx} className={item.sub ? "dropdown" : ""}>
                    <Link to={item.path}>{item.label}</Link>
                    {item.sub && <ul>{renderSubMenu(item.sub)}</ul>}
                </li>
            ))}
        </ul>
    );
    const renderSubMenu = (items) => (
        <>
            {items.map((subItem, idx) => (
                <li key={idx} className={subItem.sub ? "dropdown" : ""}>
                    <Link to={subItem.path}>{subItem.label}</Link>
                    {subItem.sub && <ul>{renderSubMenu(subItem.sub)}</ul>}
                </li>
            ))}
        </>
    );

    return (
        <>
            {/* Preloader */}
            {/* Main Header */}
            <header className={`main-header header-one white-menu menu-absolute ${isScrolled ? 'fixed-header' : ''}`}>
                {/* Header-Upper */}
                <div className="header-upper py-30 rpy-0">
                    <div className="container-fluid clearfix">
                        <div className="header-inner rel d-flex align-items-center">
                            <div className="logo-outer">
                                <div className="logo">
                                    <Link to="/">
                                        <img src="/assets/images/logos/logo.png" alt="Logo" title="Logo" />
                                    </Link>
                                </div>
                            </div>

                            <div className="nav-outer mx-lg-auto ps-xxl-5 clearfix">
                                {/* Main Menu */}
                                <nav className="main-menu navbar-expand-lg">
                                    <div className="navbar-header">
                                        <div className="mobile-logo">
                                            <Link to="/">
                                                <img src="/assets/images/logos/logo.png" alt="Logo" title="Logo" />
                                            </Link>
                                        </div>

                                        {/* Toggle Button */}
                                        <button
                                            type="button"
                                            className="navbar-toggle"
                                            data-bs-toggle="collapse"
                                            data-bs-target=".navbar-collapse"
                                        >
                                            <span className="icon-bar"></span>
                                            <span className="icon-bar"></span>
                                            <span className="icon-bar"></span>
                                        </button>
                                    </div>

                                    <div className="navbar-collapse collapse clearfix">
                                        {renderMenu(navItems)}
                                    </div>
                                </nav>
                                {/* Main Menu End */}
                            </div>
                            <div className='px-3'>
                                <Notification userId={user ? user.id : null} />
                            </div>
                            {/* Auth Button */}
                            <div className="auth-wrapper">
                                <div onClick={handleAuthAppear}>
                                    <div className='auth-t'>
                                        <div className='fal fa-user custom-fa-user'></div>

                                        <div className='auth-user'>
                                            {user ? `Xin chào, ${user.name}` : 'Tài khoản'}
                                        </div>

                                        <div className='fal fa-caret-down custom-fa-down'></div>
                                    </div>

                                    {isAuthAppear && (
                                        <div >
                                            <div className='triangle-up position-absolute'></div>
                                            <div className='position-absolute auth-appear show' style={{ minWidth: '220px' }}>
                                                {!user ? (
                                                    // Nếu chưa đăng nhập
                                                    <div className="btnRegister">
                                                        <div className="content">
                                                            <span
                                                                onClick={() => {
                                                                    setIsLogin(false);
                                                                    setIsAuthVisible(true);
                                                                    setIsAuthAppear(false);
                                                                }}
                                                                className='dangky'
                                                            >
                                                                Đăng ký
                                                            </span>
                                                            <span>Quý khách đã có tài khoản chưa?</span>
                                                            <a
                                                                className='linkLogin'
                                                                onClick={() => {
                                                                    setIsLogin(true);
                                                                    setIsAuthVisible(true);
                                                                    setIsAuthAppear(false);
                                                                }}
                                                            >
                                                                Đăng nhập ngay
                                                            </a>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Nếu đã đăng nhập
                                                    <div className="user-menu p-0" >
                                                        <div className="user-header">
                                                            <img
                                                                src={user?.image || '/default-avatar.png'}
                                                                alt="avatar"
                                                                className="user-avatar rounded-circle"
                                                                width={80}
                                                                height={80}
                                                            />
                                                            <p className="fw-semibold mb-0 mt-2" style={{ fontSize: '16px' }}>
                                                                Xin chào, {user?.name}
                                                            </p>
                                                            <p className="text-light opacity-75 mb-0" style={{ fontSize: '12px' }}>
                                                                Tài khoản của bạn
                                                            </p>
                                                        </div>

                                                        <div className="py-2">
                                                            <ul className="list-unstyled mb-0">
                                                                <li>
                                                                    <button
                                                                        className="menu-item"
                                                                        onClick={() => navigate('/profile')}
                                                                    >
                                                                        <span className="icon">👤</span>
                                                                        Hồ sơ của tôi
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="menu-item"
                                                                        onClick={() => navigate('/my-bookings')}
                                                                    >
                                                                        <span className="icon">🧳</span>
                                                                        Đặt phòng của tôi
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="menu-item"
                                                                        onClick={() => navigate('/wishlist')}
                                                                    >
                                                                        <span className="icon">💖</span>
                                                                        Địa điểm đã lưu
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="menu-item"
                                                                        onClick={() => navigate('/privacy-settings')}
                                                                    >
                                                                        <span className="icon">⚙️</span>
                                                                        Cài đặt quyền riêng tư
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button
                                                                        className="menu-item"
                                                                        onClick={() => navigate('/help')}
                                                                    >
                                                                        <span className="icon">❓</span>
                                                                        Trung tâm hỗ trợ
                                                                    </button>
                                                                </li>
                                                            </ul>

                                                            <hr className="menu-divider" />

                                                            <button
                                                                onClick={() => {
                                                                    logout();
                                                                    toast.success('Đăng xuất thành công!');
                                                                    setIsAuthAppear(false);
                                                                }}
                                                                className="logout-btn"
                                                            >
                                                                <span className="icon">🚪</span>
                                                                Đăng xuất
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>


                        </div>
                    </div>
                </div>
                {/* End Header Upper */}
                {isAuthVisible && (
                    <Auth
                        setIsAuthVisible={setIsAuthVisible}
                        isLogin={isLogin}
                        setIsLogin={setIsLogin}
                    />
                )}
            </header>
            {!user && !isAuthVisible && <PopUpButton onLoginClick={() => {
                setIsLogin(true);
                setIsAuthVisible(true);
            }} />}
        </>
    );
};

export default Header;
