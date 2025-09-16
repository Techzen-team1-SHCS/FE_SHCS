import React from "react";

const AboutUs = () => {
  return (
    <section className="about-us-area py-100 rpb-90 rel z-1">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-5 col-lg-6">
            <div
              className="about-us-content rmb-55"
              data-aos="fade-left"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="section-title mb-25">
                <h2>Travel with Confidence Top Reasons to Choose Our Agency</h2>
              </div>
              <p>
                We go above and beyond to make your travel dreams reality hidden
                gems and must-see attractions
              </p>
              <div className="divider counter-text-wrap mt-45 mb-55">
                <span>
                  We have{" "}
                  <span>
                    <span
                      className="count-text plus"
                      data-speed="3000"
                      data-stop="25"
                    >
                      0
                    </span>{" "}
                    Years
                  </span>{" "}
                  of experience
                </span>
              </div>
              <div className="row">
                <div className="col-6">
                  <div className="counter-item counter-text-wrap">
                    <span
                      className="count-text k-plus"
                      data-speed="3000"
                      data-stop="3"
                    >
                      0
                    </span>
                    <span className="counter-title">Popular Destination</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="counter-item counter-text-wrap">
                    <span
                      className="count-text m-plus"
                      data-speed="3000"
                      data-stop="9"
                    >
                      0
                    </span>
                    <span className="counter-title">Satisfied Clients</span>
                  </div>
                </div>
              </div>
              <a href="destination1.html" className="theme-btn mt-10 style-two">
                <span data-hover="Explore Destinations">
                  Explore Destinations
                </span>
                <i className="fal fa-arrow-right"></i>
              </a>
            </div>
          </div>
          <div
            className="col-xl-7 col-lg-6"
            data-aos="fade-right"
            data-aos-duration="1500"
            data-aos-offset="50"
          >
            <div className="about-us-image">
              <div className="shape">
                <img src="assets/images/about/shape1.png" alt="Shape" />
              </div>
              <div className="shape">
                <img src="assets/images/about/shape2.png" alt="Shape" />
              </div>
              <div className="shape">
                <img src="assets/images/about/shape3.png" alt="Shape" />
              </div>
              <div className="shape">
                <img src="assets/images/about/shape4.png" alt="Shape" />
              </div>
              <div className="shape">
                <img src="assets/images/about/shape5.png" alt="Shape" />
              </div>
              <div className="shape">
                <img src="assets/images/about/shape6.png" alt="Shape" />
              </div>
              <div className="shape">
                <img src="assets/images/about/shape7.png" alt="Shape" />
              </div>
              <img src="assets/images/about/about.png" alt="About" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
