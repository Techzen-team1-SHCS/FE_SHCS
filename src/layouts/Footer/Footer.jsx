import { Link } from "react-router-dom";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const Footer = () => {
  // Email validation schema
  const emailSchema = Yup.object().shape({
    email: Yup.string()
      .email("❌ Email không hợp lệ")
      .required("❌ Vui lòng nhập email")
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "❌ Email phải có định dạng example@domain.com"
      )
      .test(
        "is-gmail",
        "❌ Chỉ chấp nhận email Gmail",
        (value) => {
          if (!value) return true;
          return value.toLowerCase().endsWith('@gmail.com');
        }
      )
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: emailSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        console.log("Email hợp lệ:", values.email);
        toast.success(`✅ Đăng ký thành công! Chúng tôi sẽ gửi tin tức đến: ${values.email}`);
        resetForm();
      } catch (error) {
        console.error("Lỗi submit:", error);
      } finally {
        setSubmitting(false);
      }
    }
  });

  // -----------------------------
  // Footer menu data (giữ nguyên)
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
        { label: "Huế", path: `/HotelList?destination=${encodeURIComponent("Huế")}` },
        { label: "Đà nẵng", path: `/HotelList?destination=${encodeURIComponent("Đà nẵng")}` },
        { label: "Hồ Chí Minh", path: `/HotelList?destination=${encodeURIComponent("Hồ Chí Minh")}` },
        { label: "Nha trang", path: `/HotelList?destination=${encodeURIComponent("Nha trang")}` },
        { label: "Hà nội", path: `/HotelList?destination=${encodeURIComponent("Hà nội")}` },
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
      text: "Duy Tan University, Da Nang, Vietnam",
    },
    {
      icon: "fal fa-envelope",
      text: "dtu@gmail.com",
      href: "mailto:dtu@gmail.com",
    },
    {
      icon: "fal fa-clock",
      text: "Mon - Fri, 08am - 05pm",
    },
    {
      icon: "fal fa-phone-volume",
      text: "+84 0373234323",
      href: "callto:+840373234323",
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

              {/* Formik Form */}
              <form
                className="newsletter-form mb-50 justify-content-between"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                <div>
                  <input
                    id="news-email"
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.errors.email && formik.touched.email ? "error" : ""}
                    disabled={formik.isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={formik.isSubmitting}
                  className="theme-btn bgc-secondary style-two"
                  style={{ maxHeight: '50px' }}
                >
                  {formik.isSubmitting ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      <span data-hover="Subscribe">Subscribe</span>
                      <i className="fal fa-arrow-right"></i>
                    </>
                  )}
                </button>
              </form>

              {/* Error Message */}
              {formik.errors.email && formik.touched.email && (
                <div
                  className="error-message"
                  style={{
                    color: '#ff6b6b',
                    fontSize: '12px',
                    marginTop: '0px',
                    textAlign: 'left',
                  }}
                >
                  {formik.errors.email}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Widgets area (giữ nguyên) */}
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

      {/* Bottom section (giữ nguyên) */}
      <div className="footer-bottom pt-20 pb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-5">
              <div className="copyright-text text-center text-lg-start">
                <p>
                  @Copy 2025 <Link to="/">Smart Hotel</Link>, All rights reserved
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