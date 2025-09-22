import React from "react";

const PopularDestinations = () => {
  return (
    <section className="popular-destinations-area rel z-1">
      <div className="container-fluid">
        <div className="popular-destinations-wrap br-20 bgc-lighter pt-100 pb-70">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div
                className="section-title text-center counter-text-wrap mb-70"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <h2>Explore Popular Destinations</h2>
                <p>
                  One site{" "}
                  <span
                    className="count-text plus"
                    data-speed="3000"
                    data-stop="34500"
                  >
                    0
                  </span>{" "}
                  most popular experience
                </p>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-3 col-md-6">
                <div
                  className="destination-item style-two"
                  data-aos="flip-up"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                >
                  <div className="image">
                    <a href="#" className="heart">
                      <i className="fas fa-heart"></i>
                    </a>
                    <img
                      src="assets/images/destinations/destination1.jpg"
                      alt="Destination"
                    />
                  </div>
                  <div className="content">
                    <h6>
                      <a href="destination-details.html">Thailand beach</a>
                    </h6>
                    <span className="time">
                      5352+ tours &amp; 856+ Activity
                    </span>
                    <a href="#" className="more">
                      <i className="fas fa-chevron-right"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div
                  className="destination-item style-two"
                  data-aos="flip-up"
                  data-aos-delay="100"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                >
                  <div className="image">
                    <a href="#" className="heart">
                      <i className="fas fa-heart"></i>
                    </a>
                    <img
                      src="assets/images/destinations/destination2.jpg"
                      alt="Destination"
                    />
                  </div>
                  <div className="content">
                    <h6>
                      <a href="destination-details.html">Parga, Greece</a>
                    </h6>
                    <span className="time">
                      5352+ tours &amp; 856+ Activity
                    </span>
                    <a href="#" className="more">
                      <i className="fas fa-chevron-right"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div
                  className="destination-item style-two"
                  data-aos="flip-up"
                  data-aos-delay="200"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                >
                  <div className="image">
                    <a href="#" className="heart">
                      <i className="fas fa-heart"></i>
                    </a>
                    <img
                      src="assets/images/destinations/destination3.jpg"
                      alt="Destination"
                    />
                  </div>
                  <div className="content">
                    <h6>
                      <a href="destination-details.html">
                        Castellammare del Golfo, Italy
                      </a>
                    </h6>
                    <span className="time">
                      5352+ tours &amp; 856+ Activity
                    </span>
                    <a href="#" className="more">
                      <i className="fas fa-chevron-right"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div
                  className="destination-item style-two"
                  data-aos="flip-up"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                >
                  <div className="image">
                    <a href="#" className="heart">
                      <i className="fas fa-heart"></i>
                    </a>
                    <img
                      src="assets/images/destinations/destination4.jpg"
                      alt="Destination"
                    />
                  </div>
                  <div className="content">
                    <h6>
                      <a href="destination-details.html">
                        Reserve of Canada, Canada
                      </a>
                    </h6>
                    <span className="time">
                      5352+ tours &amp; 856+ Activity
                    </span>
                    <a href="#" className="more">
                      <i className="fas fa-chevron-right"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div
                  className="destination-item style-two"
                  data-aos="flip-up"
                  data-aos-delay="100"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                >
                  <div className="image">
                    <a href="#" className="heart">
                      <i className="fas fa-heart"></i>
                    </a>
                    <img
                      src="assets/images/destinations/destination5.jpg"
                      alt="Destination"
                    />
                  </div>
                  <div className="content">
                    <h6>
                      <a href="destination-details.html">
                        Dubai united states
                      </a>
                    </h6>
                    <span className="time">
                      5352+ tours &amp; 856+ Activity
                    </span>
                    <a href="#" className="more">
                      <i className="fas fa-chevron-right"></i>
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-md-6">
                <div
                  className="destination-item style-two"
                  data-aos="flip-up"
                  data-aos-delay="200"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                >
                  <div className="image">
                    <a href="#" className="heart">
                      <i className="fas fa-heart"></i>
                    </a>
                    <img
                      src="assets/images/destinations/destination6.jpg"
                      alt="Destination"
                    />
                  </div>
                  <div className="content">
                    <h6>
                      <a href="destination-details.html">Milos, Greece</a>
                    </h6>
                    <span className="time">
                      5352+ tours &amp; 856+ Activity
                    </span>
                    <a href="#" className="more">
                      <i className="fas fa-chevron-right"></i>
                    </a>
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

export default PopularDestinations;
