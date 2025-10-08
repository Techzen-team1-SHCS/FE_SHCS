import React from 'react'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'

const ContactUs = () => {
  return (
    <div className='page-wrapper'>
      <section
        className="page-banner-area pt-50 pb-35 rel z-1 bgs-cover"
        style={{ backgroundImage: "url(assets/images/banner/banner.jpg)" }}
      >
        <div className="container">
          <div className="banner-inner text-white mb-50">
            <h2
              className="page-title mb-10"
              data-aos="fade-left"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              Contact Us
            </h2>
            <Breadcrumb items={[
              { label: "Home", href: "/", active: false },
              { label: "Contact Us", active: true },
            ]} />
          </div>
        </div>
      </section>
      <section className="contact-info-area pt-100 rel z-1">
        <div className="container">
          <div className="row align-items-center">
            {/* --- LEFT CONTENT --- */}
            <div className="col-lg-4">
              <div
                className="contact-info-content mb-30 rmb-55"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <div className="section-title mb-30">
                  <h2>Let’s Talk Our Expert Travel Guides</h2>
                </div>
                <p>
                  Our dedicated support team is always ready to assist you with
                  any questions or issues, offering prompt and personalized
                  solutions to meet your needs.
                </p>

                <div className="features-team-box mt-40">
                  <h6>5 Expert Team member</h6>
                  <div className="feature-authors">
                    <img
                      src="assets/images/features/feature-author1.png"
                      alt="Author"
                    />
                    <img
                      src="assets/images/features/feature-author2.png"
                      alt="Author"
                    />
                    <img
                      src="assets/images/features/feature-author3.png"
                      alt="Author"
                    />
                    <img
                      src="assets/images/features/feature-author4.png"
                      alt="Author"
                    />
                    <img
                      src="assets/images/features/feature-author5.png"
                      alt="Author"
                    />
                    
                  </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT CONTACT INFO BOXES --- */}
            <div className="col-lg-8">
              <div className="row">
                {/* --- 1. Support --- */}
                <div className="col-md-6">
                  <div
                    className="contact-info-item"
                    data-aos="fade-up"
                    data-aos-duration="1500"
                    data-aos-offset="50"
                    data-aos-delay="50"
                  >
                    <div className="icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="content">
                      <h5>Need Help & Support</h5>
                      <div className="text">
                        <i className="far fa-envelope"></i>{" "}
                        <a href="mailto:support@gmail.com">support@gmail.com</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- 2. Phone --- */}
                <div className="col-md-6">
                  <div
                    className="contact-info-item"
                    data-aos="fade-up"
                    data-aos-duration="1500"
                    data-aos-offset="50"
                    data-aos-delay="100"
                  >
                    <div className="icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="content">
                      <h5>Need Any Urgent</h5>
                      <div className="text">
                        <i className="far fa-phone"></i>{" "}
                        <a >037 232 5455</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- 3. New York Branch --- */}
                <div className="col-md-6">
                  <div
                    className="contact-info-item"
                    data-aos="fade-up"
                    data-aos-duration="1500"
                    data-aos-offset="50"
                    data-aos-delay="50"
                  >
                    <div className="icon">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="content">
                      <h5>Techzen</h5>
                      <div className="text">
                        <i className="fal fa-map-marker-alt"></i> 06 Tran Phu
                      </div>
                    </div>
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export default ContactUs