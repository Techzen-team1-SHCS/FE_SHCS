import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { hotelApi } from '../../api';
const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const navigate = useNavigate();
     const handleSearchSubmit = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) return;
      // CÁCH 3: Chỉ chuyển hướng URL, không gọi API
      const searchUrl = hotelApi.createSearchUrl(searchTerm);
      navigate(searchUrl);

      // Ẩn form search sau khi tìm kiếm
      setIsSearchVisible(false);
      setSearchTerm('');
  };
    const gotoAuth = () => {
        navigate("/AuthPage")
    }
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
            sub: [
                { label: "Travel Agency", path: "/" },
                { label: "City Tour", path: "/city-tour" },
                { label: "Tour Package", path: "/tour-package" },
            ],
        },
        { label: "About", path: "/about" },
        {
            label: "Tours",
            path: "/tours",
            sub: [
                { label: "Hotel List", path: "/HotelList" },
                { label: "Tour Grid", path: "/tour-grid" },
                { label: "Tour Sidebar", path: "/tour-sidebar" },
                { label: "Tour Details", path: "/tour-details" },
                { label: "Tour Guide", path: "/tour-guide" },
            ],
        },
        {
            label: "Destinations",
            path: "/destinations",
            sub: [
                { label: "Destination 01", path: "/destination1" },
                { label: "Destination 02", path: "/destination2" },
                { label: "Destination Details", path: "/destination-details" },
            ],
        },
        {
            label: "Pages",
            path: "/pages",
            sub: [
                { label: "Pricing", path: "/pricing" },
                { label: "FAQs", path: "/faqs" },
                {
                    label: "Gallery",
                    path: "/gallery",
                    sub: [
                        { label: "Gallery Grid", path: "/gallery-grid" },
                        { label: "Gallery Slider", path: "/gallery-slider" },
                    ],
                },
                {
                    label: "Products",
                    path: "/products",
                    sub: [
                        { label: "Our Products", path: "/shop" },
                        { label: "Product Details", path: "/product-details" },
                    ],
                },
                { label: "Contact Us", path: "/contact" },
                { label: "404 Error", path: "/404" },
            ],
        },
        {
            label: "Blog",
            path: "/blog",
            sub: [
                { label: "Blog List", path: "/blog" },
                { label: "Blog Details", path: "/blog-details" },
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
            <div className="preloader">
                <div className="custom-loader"></div>
            </div>

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

                            {/* Nav Search */}
                            <div className="nav-search">
                                <button
                                    className="far fa-search"
                                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                                ></button>
                                <form className={isSearchVisible ? '' : 'hide'} onSubmit={handleSearchSubmit}>
                                    <input type="text" placeholder="Search" className="searchbox" required="" value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} />
                                    <button type="submit" className="searchbutton far fa-search"></button>
                                </form>
                            </div>

                            {/* Menu Button */}
                            <div className="menu-btns py-10">
                                <Link to="/contact" className="theme-btn style-two bgc-secondary">
                                    <span data-hover="Book Now">Book Now</span>
                                    <i className="fal fa-arrow-right"></i>
                                </Link>
                                {/* Menu Sidebar */}
                                <div className="menu-sidebar" onClick={gotoAuth}>

                                    <button
                                        className="bg-transparent"
                                    >
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Header Upper */}
            </header>


        </>
    );
};

export default Header; 