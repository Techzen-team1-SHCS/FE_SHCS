import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth from '../../components/Auth/Auth';
import '../Header/index.css'
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import PopUpButton from "../../components/PopupButton/PopUpButton"
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
                // { label: "Pricing", path: "/pricing" },
                // { label: "FAQs", path: "/faqs" },
                // {
                //     label: "Gallery",
                //     path: "/gallery",
                //     sub: [
                //         { label: "Gallery Grid", path: "/gallery-grid" },
                //         { label: "Gallery Slider", path: "/gallery-slider" },
                //     ],
                // },
                // {
                //     label: "Products",
                //     path: "/products",
                //     sub: [
                //         { label: "Our Products", path: "/shop" },
                //         { label: "Product Details", path: "/product-details" },
                //     ],
                // },
                { label: "Contact Us", path: "/ContactUs" },
                { label: "404 Error", path: "*" },
            ],
        },
        {
            label: "Blog",
            path: "/blog",
            sub: [
                { label: "Blog List", path: "/BlogList" },
                // { label: "Blog Details", path: "/blog-details" },
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
                            {/* Auth Button */}
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
                                        <div className='position-absolute auth-appear show'>
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
                                                <div className="btnRegister p-3" style={{ minWidth: '200px' }}>
                                                    <div className="content text-start">
                                                        <p className="fw-semibold mb-1">Xin chào, {user.name}</p>
                                                        <img
                                                            src={user.avatar_url || 'assets/images/avatar/avatar_default.png'}
                                                            alt="avatar"
                                                            className="rounded-circle"
                                                            width={60}
                                                            height={60}
                                                        />

                                                        {/* Các tùy chọn giống trang booking */}
                                                        <ul className="list-unstyled mb-2">
                                                            <li>
                                                                <button
                                                                    className="btn btn-link text-dark p-0 w-100 text-start"
                                                                    onClick={() => navigate('/profile')}
                                                                >
                                                                    👤 Hồ sơ của tôi
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className="btn btn-link text-dark p-0 w-100 text-start"
                                                                    onClick={() => navigate('/my-bookings')}
                                                                >
                                                                    🧳 Đặt phòng của tôi
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className="btn btn-link text-dark p-0 w-100 text-start"
                                                                    onClick={() => navigate('/saved-places')}
                                                                >
                                                                    💖 Địa điểm đã lưu
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className="btn btn-link text-dark p-0 w-100 text-start"
                                                                    onClick={() => navigate('/privacy-settings')}
                                                                >
                                                                    ⚙️ Cài đặt quyền riêng tư
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button
                                                                    className="btn btn-link text-dark p-0 w-100 text-start"
                                                                    onClick={() => navigate('/help')}
                                                                >
                                                                    ❓ Trung tâm hỗ trợ
                                                                </button>
                                                            </li>
                                                        </ul>

                                                        <hr className="my-2" />
                                                        <button
                                                            onClick={() => {
                                                                logout();
                                                                setIsAuthAppear(false);
                                                            }}
                                                            className='btn btn-danger btn-sm w-100'
                                                        >
                                                            🚪 Đăng xuất
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
                {/* End Header Upper */}
                {isAuthVisible && (
                    <Auth
                        setIsAuthVisible={setIsAuthVisible}
                        isLogin={isLogin}
                        setIsLogin={setIsLogin}
                    />
                )}
            </header>
             {!user && <PopUpButton />}
        </>
    );
};

export default Header;
