import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  // -----------------------------
  // Footer menu data
  // -----------------------------
  const footerLinks = [
    {
      title: "Services",
      links: [
        { label: "Best Tour Guide", path: "/destination-details" },
        { label: "Tour Booking", path: "/destination-details" },
        { label: "Hotel Booking", path: "/destination-details" },
        { label: "Ticket Booking", path: "/destination-details" },
        { label: "Rental Services", path: "/destination-details" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Company", path: "/about" },
        { label: "Community Blog", path: "/blog" },
        { label: "Jobs and Careers", path: "/contact" },
        { label: "Latest News Blog", path: "/blog" },
        { label: "Contact Us", path: "/contact" },
      ],
    },
    {
      title: "Destinations",
      links: [
        { label: "African Safaris", path: "/destination-details" },
        { label: "Alaska & Canada", path: "/destination-details" },
        { label: "South America", path: "/destination-details" },
        { label: "Middle East", path: "/destination-details" },
        { label: "South America", path: "/destination-details" },
      ],
    },
    {
      title: "Categories",
      links: [
        { label: "Adventure", path: "/contact" },
        { label: "Hiking & Trekking", path: "/contact" },
        { label: "Cycling Tours", path: "/contact" },
        { label: "Family Tours", path: "/contact" },
        { label: "Wildlife Tours", path: "/contact" },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: "fal fa-map-marked-alt",
      text: "578 Level, D-block 45 Street Melbourne, Australia",
    },
    {
      icon: "fal fa-envelope",
      text: "supportrevelo@gmail.com",
      href: "mailto:supportrevelo@gmail.com",
    },
    {
      icon: "fal fa-clock",
      text: "Mon - Fri, 08am - 05pm",
    },
    {
      icon: "fal fa-phone-volume",
      text: "+880 (123) 345 88",
      href: "callto:+88012334588",
    },
  ];

  const bottomNav = [
    { label: "Terms", path: "/about" },
    { label: "Privacy Policy", path: "/about" },
    { label: "Legal notice", path: "/about" },
    { label: "Accessibility", path: "/about" },
  ];

  return (
    <footer
      className="main-footer bgs-cover overlay rel z-1 pb-25"
      style={{ backgroundImage: "url(/assets/images/backgrounds/footer.jpg)" }}
    >
      <div className="container">
        {/* Top section */}
        <div className="footer-top pt-100 pb-30">
          <div className="row justify-content-between">
            <div
              className="col-xl-5 col-lg-6"
              data-aos="fade-up"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="footer-widget footer-text">
                <div className="footer-logo mb-25">
                  <Link to="/">
                    <img src="/assets/images/logos/logo.png" alt="Logo" />
                  </Link>
                </div>
                <p>
                  We curate bespoke itineraries tailored to your preferences,
                  ensuring every trip is seamless and enriching hidden gems
                  beaten
                </p>
                <div className="social-style-one mt-15">
                  <a href="/contact">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="/contact">
                    <i className="fab fa-youtube"></i>
                  </a>
                  <a href="/contact">
                    <i className="fab fa-pinterest"></i>
                  </a>
                  <a href="/contact">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>

            <div
              className="col-xl-5 col-lg-6"
              data-aos="fade-up"
              data-aos-delay="50"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="section-title counter-text-wrap mb-35">
                <h2>Subscribe Newsletter</h2>
                <p>
                  One site{" "}
                  <span
                    className="count-text plus"
                    data-speed="3000"
                    data-stop="34500"
                  >
                    0
                  </span>{" "}
                  most popular experience you'll remember
                </p>
              </div>
              <form className="newsletter-form mb-50" action="#">
                <input
                  id="news-email"
                  type="email"
                  placeholder="Email Address"
                  required
                />
                <button
                  type="submit"
                  className="theme-btn bgc-secondary style-two"
                >
                  <span data-hover="Subscribe">Subscribe</span>
                  <i className="fal fa-arrow-right"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Widgets area */}
      <div className="widget-area pt-95 pb-45">
        <div className="container">
          <div className="row row-cols-xl-5 row-cols-lg-4 row-cols-md-3 row-cols-2">
            {footerLinks.map((section, idx) => (
              <div
                key={idx}
                className="col col-small"
                data-aos="fade-up"
                data-aos-delay={idx * 50}
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <div className="footer-widget footer-links">
                  <div className="footer-title">
                    <h5>{section.title}</h5>
                  </div>
                  <ul className="list-style-three">
                    {section.links.map((link, i) => (
                      <li key={i}>
                        <Link to={link.path}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* Contact Info */}
            <div
              className="col col-md-6 col-10 col-small"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="footer-widget footer-contact">
                <div className="footer-title">
                  <h5>Get In Touch</h5>
                </div>
                <ul className="list-style-one">
                  {contactInfo.map((item, i) => (
                    <li key={i}>
                      <i className={item.icon}></i>{" "}
                      {item.href ? (
                        <a href={item.href}>{item.text}</a>
                      ) : (
                        item.text
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="footer-bottom pt-20 pb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="copyright-text text-center text-lg-start">
                <p>
                  @Copy 2024 <Link to="/">Ravelo</Link>, All rights reserved
                </p>
              </div>
            </div>
            <div className="col-lg-7 text-center text-lg-end">
              <ul className="footer-bottom-nav">
                {bottomNav.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Scroll Top Button */}
          <button className="scroll-top scroll-to-target" data-target="html">
            <img
              src="/assets/images/icons/scroll-up.png"
              alt="Scroll Up"
            />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
