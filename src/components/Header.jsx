import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const navigate=useNavigate();
    const gotoAuth=()=>{
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
                                        <ul className="navigation clearfix">
                                            <li className="dropdown current">
                                                <Link to="/">Home</Link>
                                                <ul>
                                                    <li><Link to="/">Travel Agency</Link></li>
                                                    <li><Link to="/city-tour">City Tour</Link></li>
                                                    <li><Link to="/tour-package">Tour Package</Link></li>
                                                </ul>
                                            </li>
                                            <li><Link to="/about">About</Link></li>
                                            <li className="dropdown">
                                                <Link to="/tours">Tours</Link>
                                                <ul>
                                                    <li><Link to="/tour-list">Tour List</Link></li>
                                                    <li><Link to="/tour-grid">Tour Grid</Link></li>
                                                    <li><Link to="/tour-sidebar">Tour Sidebar</Link></li>
                                                    <li><Link to="/tour-details">Tour Details</Link></li>
                                                    <li><Link to="/tour-guide">Tour Guide</Link></li>
                                                </ul>
                                            </li>
                                            <li className="dropdown">
                                                <Link to="/destinations">Destinations</Link>
                                                <ul>
                                                    <li><Link to="/destination1">Destination 01</Link></li>
                                                    <li><Link to="/destination2">Destination 02</Link></li>
                                                    <li><Link to="/destination-details">Destination Details</Link></li>
                                                </ul>
                                            </li>
                                            <li className="dropdown">
                                                <Link to="/pages">Pages</Link>
                                                <ul>
                                                    <li><Link to="/pricing">Pricing</Link></li>
                                                    <li><Link to="/faqs">FAQs</Link></li>
                                                    <li className="dropdown">
                                                        <Link to="/gallery">Gallery</Link>
                                                        <ul>
                                                            <li><Link to="/gallery-grid">Gallery Grid</Link></li>
                                                            <li><Link to="/gallery-slider">Gallery Slider</Link></li>
                                                        </ul>
                                                    </li>
                                                    <li><Link to="/faqs">FAQs</Link></li>
                                                    <li className="dropdown">
                                                        <Link to="/products">Products</Link>
                                                        <ul>
                                                            <li><Link to="/shop">Our Products</Link></li>
                                                            <li><Link to="/product-details">Product Details</Link></li>
                                                        </ul>
                                                    </li>
                                                    <li><Link to="/contact">Contact Us</Link></li>
                                                    <li><Link to="/404">404 Error</Link></li>
                                                </ul>
                                            </li>
                                            <li className="dropdown">
                                                <Link to="/blog">Blog</Link>
                                                <ul>
                                                    <li><Link to="/blog">Blog List</Link></li>
                                                    <li><Link to="/blog-details">Blog Details</Link></li>
                                                </ul>
                                            </li>
                                        </ul>
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
                                <form className={isSearchVisible ? '' : 'hide'}>
                                    <input type="text" placeholder="Search" className="searchbox" required="" />
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