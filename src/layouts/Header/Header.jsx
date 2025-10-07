import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Auth from '../../components/Auth/Auth';

const Header = () => {
    const [isAuthVisible, setIsAuthVisible] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthAppear, setIsAuthAppear] = useState(false);
    const handleAuthClick = () => {
        setIsAuthVisible(!isAuthVisible);
    };
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
                            {/* <div className="nav-search">
                                <button
                                    className="far fa-search"
                                    onClick={() => setIsSearchVisible(!isSearchVisible)}
                                ></button>
                                <form className={isSearchVisible ? '' : 'hide'} onSubmit={handleSearchSubmit}>
                                    <input type="text" placeholder="Search" className="searchbox" required="" value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)} />
                                    <button type="submit" className="searchbutton far fa-search"></button>
                                </form>
                            </div> */}

                            {/* Auth Button */}
                            <div className='' onClick={handleAuthAppear}>
                                <div className='auth-t'>
                                    <div className='fal fa-user custom-fa-user'></div>
                                    <div className='auth-user'>Tài khoản</div>
                                    <div className='fal fa-caret-down custom-fa-down'></div>
                                </div>

                                {isAuthAppear && <div className='position-absolute auth-appear '>

                                    <div className="menu-btns py-10 position-relative ">
                                        <div className="theme-btn style-two bgc-secondary " onClick={handleAuthClick}
                                            style={{ cursor: 'pointer' }}>
                                            <span data-hover="Login/Register">Login/Register</span>
                                            <i className="fal fa-arrow-right"></i>
                                        </div>

                                    </div>
                                    <div>
                                        Quý khách đã có tài khoản chưa?
                                    </div>
                                </div>
                                }

                            </div>

                        </div>
                    </div>
                </div>
                {/* End Header Upper */}
                {isAuthVisible && (
                    <Auth setIsAuthVisible={setIsAuthVisible} />
                )}
            </header>


        </>
    );
};

export default Header;
{/* Menu Sidebar */ }
{/* <div className="menu-sidebar" onClick={gotoAuth}>

                                    <button
                                        className="bg-transparent"
                                    >
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                    </button>

                                </div> */}