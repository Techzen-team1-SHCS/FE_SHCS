import React from "react";

const Features = () => {
  return (
    <section className="features-area pt-100 pb-45 rel z-1">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-6">
            <div
              className="features-content-part mb-55"
              data-aos="fade-left"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="section-title mb-60">
                <h2>
                  The Ultimate Travel Experience Features That Set Our Agency
                  Apart
                </h2>
              </div>
              <div className="features-customer-box">
                <div className="image">
                  <img
                    src="assets/images/features/features-box.jpg"
                    alt="Features"
                  />
                </div>
                <div className="content">
                  <div className="feature-authors mb-15">
                    <img
                      src="assets/images/features/feature-author1.jpg"
                      alt="Author"
                    />
                    <img
                      src="assets/images/features/feature-author2.jpg"
                      alt="Author"
                    />
                    <img
                      src="assets/images/features/feature-author3.jpg"
                      alt="Author"
                    />
                    <span>4k+</span>
                  </div>
                  <h6>850K+ Happy Customer</h6>
                  <div className="divider style-two counter-text-wrap my-25">
                    <span>
                      <span
                        className="count-text plus"
                        data-speed="3000"
                        data-stop="25"
                      >
                        0
                      </span>{" "}
                      Years
                    </span>
                  </div>
                  <p>We pride ourselves offering personalized itineraries</p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-xl-6"
            data-aos="fade-right"
            data-aos-duration="1500"
            data-aos-offset="50"
          >
            <div className="row pb-25">
              <div className="col-md-6">
                <div className="feature-item">
                  <div className="icon">
                    <i className="flaticon-tent"></i>
                  </div>
                  <div className="content">
                    <h5>
                      <a href="tour-details.html">Tent Camping</a>
                    </h5>
                    <p>
                      Tent camping is wonderful way to connect with nature
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="icon">
                    <i className="flaticon-tent"></i>
                  </div>
                  <div className="content">
                    <h5>
                      <a href="tour-details.html">Kayaking</a>
                    </h5>
                    <p>
                      Kayaking is a thrilling outdoor activity that adventure
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="feature-item mt-20">
                  <div className="icon">
                    <i className="flaticon-tent"></i>
                  </div>
                  <div className="content">
                    <h5>
                      <a href="tour-details.html">Mountain Biking</a>
                    </h5>
                    <p>
                      Mountain biking is exhilarating sport that physical
                      fitness
                    </p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="icon">
                    <i className="flaticon-tent"></i>
                  </div>
                  <div className="content">
                    <h5>
                      <a href="tour-details.html">Fishing &amp; Boat</a>
                    </h5>
                    <p>
                      Fishing and boat bring joy quintessential activities that
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
