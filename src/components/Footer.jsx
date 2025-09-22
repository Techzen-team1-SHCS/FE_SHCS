import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="main-footer bgs-cover overlay rel z-1 pb-25" style={{ backgroundImage: 'url(/assets/images/backgrounds/footer.jpg)' }}>
            <div className="container">
                <div className="footer-top pt-100 pb-30">
                    <div className="row justify-content-between">
                        <div className="col-xl-5 col-lg-6" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-text">
                                <div className="footer-logo mb-25">
                                    <Link to="/">
                                        <img src="/assets/images/logos/logo.png" alt="Logo" />
                                    </Link>
                                </div>
                                <p>We curate bespoke itineraries tailored to your preferences, ensuring every trip is seamless and enriching hidden gems beaten</p>
                                <div className="social-style-one mt-15">
                                    <a href="/contact"><i className="fab fa-facebook-f"></i></a>
                                    <a href="/contact"><i className="fab fa-youtube"></i></a>
                                    <a href="/contact"><i className="fab fa-pinterest"></i></a>
                                    <a href="/contact"><i className="fab fa-twitter"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-5 col-lg-6" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1500" data-aos-offset="50">
                            <div className="section-title counter-text-wrap mb-35">
                                <h2>Subscribe Newsletter</h2>
                                <p>One site <span className="count-text plus" data-speed="3000" data-stop="34500">0</span> most popular experience you'll remember</p>
                            </div>
                            <form className="newsletter-form mb-50" action="#">
                                <input id="news-email" type="email" placeholder="Email Address" required />
                                <button type="submit" className="theme-btn bgc-secondary style-two">
                                    <span data-hover="Subscribe">Subscribe</span>
                                    <i className="fal fa-arrow-right"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="widget-area pt-95 pb-45">
                <div className="container">
                    <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-2">
                        <div className="col col-small" data-aos="fade-up" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-links">
                                <div className="footer-title">
                                    <h5>Services</h5>
                                </div>
                                <ul className="list-style-three">
                                    <li><Link to="/destination-details">Best Tour Guide</Link></li>
                                    <li><Link to="/destination-details">Tour Booking</Link></li>
                                    <li><Link to="/destination-details">Hotel Booking</Link></li>
                                    <li><Link to="/destination-details">Ticket Booking</Link></li>
                                    <li><Link to="/destination-details">Rental Services</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-small" data-aos="fade-up" data-aos-delay="50" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-links">
                                <div className="footer-title">
                                    <h5>Company</h5>
                                </div>
                                <ul className="list-style-three">
                                    <li><Link to="/about">About Company</Link></li>
                                    <li><Link to="/blog">Community Blog</Link></li>
                                    <li><Link to="/contact">Jobs and Careers</Link></li>
                                    <li><Link to="/blog">Latest News Blog</Link></li>
                                    <li><Link to="/contact">Contact Us</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-small" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-links">
                                <div className="footer-title">
                                    <h5>Destinations</h5>
                                </div>
                                <ul className="list-style-three">
                                    <li><Link to="/destination-details">African Safaris</Link></li>
                                    <li><Link to="/destination-details">Alaska & Canada</Link></li>
                                    <li><Link to="/destination-details">South America</Link></li>
                                    <li><Link to="/destination-details">Middle East</Link></li>
                                    <li><Link to="/destination-details">South America</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-small" data-aos="fade-up" data-aos-delay="150" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-links">
                                <div className="footer-title">
                                    <h5>Categories</h5>
                                </div>
                                <ul className="list-style-three">
                                    <li><Link to="/contact">Adventure</Link></li>
                                    <li><Link to="/contact">Hiking & Trekking</Link></li>
                                    <li><Link to="/contact">Cycling Tours</Link></li>
                                    <li><Link to="/contact">Family Tours</Link></li>
                                    <li><Link to="/contact">Wildlife Tours</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col col-md-6 col-10 col-small" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1500" data-aos-offset="50">
                            <div className="footer-widget footer-contact">
                                <div className="footer-title">
                                    <h5>Get In Touch</h5>
                                </div>
                                <ul className="list-style-one">
                                    <li><i className="fal fa-map-marked-alt"></i> 578 Level, D-block 45 Street Melbourne, Australia</li>
                                    <li><i className="fal fa-envelope"></i> <a href="mailto:supportrevelo@gmail.com">supportrevelo@gmail.com</a></li>
                                    <li><i className="fal fa-clock"></i> Mon - Fri, 08am - 05pm</li>
                                    <li><i className="fal fa-phone-volume"></i> <a href="callto:+88012334588">+880 (123) 345 88</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom pt-20 pb-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-5">
                            <div className="copyright-text text-center text-lg-start">
                                <p>@Copy 2024 <Link to="/">Ravelo</Link>, All rights reserved</p>
                            </div>
                        </div>
                        <div className="col-lg-7 text-center text-lg-end">
                            <ul className="footer-bottom-nav">
                                <li><Link to="/about">Terms</Link></li>
                                <li><Link to="/about">Privacy Policy</Link></li>
                                <li><Link to="/about">Legal notice</Link></li>
                                <li><Link to="/about">Accessibility</Link></li>
                            </ul>
                        </div>
                    </div>
                    {/* Scroll Top Button */}
                    <button className="scroll-top scroll-to-target" data-target="html">
                        <img src="/assets/images/icons/scroll-up.png" alt="Scroll Up" />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 