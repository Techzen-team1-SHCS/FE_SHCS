import React from "react";

const Destinations = () => {
  return (
    <section className="destinations-area bgc-black pt-100 pb-70 rel z-1">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div
              className="section-title text-white text-center counter-text-wrap mb-70"
              data-aos="fade-up"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <h2>Discover the World's Treasures with Ravelo</h2>
              <p>
                One site{" "}
                <span
                  className="count-text plus"
                  data-speed="3000"
                  data-stop="34500"
                >
                  0
                </span>{" "}
                most popular experience you’ll remember
              </p>
            </div>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-xxl-3 col-xl-4 col-md-6">
            <div
              className="destination-item"
              data-aos="fade-up"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="image">
                <div className="ratting">
                  <i className="fas fa-star"></i> 4.8
                </div>
                <a href="#" className="heart">
                  <i className="fas fa-heart"></i>
                </a>
                <img
                  src="assets/images/destinations/visiting-place1.jpg"
                  alt="Destination"
                />
              </div>
              <div className="content">
                <span className="location">
                  <i className="fal fa-map-marker-alt"></i> Tours, France
                </span>
                <h5>
                  <a href="destination-details.html">
                    Brown Concrete Building Basilica St Martin
                  </a>
                </h5>
                <span className="time">3 days 2 nights - Couple</span>
              </div>
              <div className="destination-footer">
                <span className="price">
                  <span>$58.00</span>/per person
                </span>
                <a href="#" className="read-more">
                  Book Now <i className="fal fa-angle-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-4 col-md-6">
            <div
              className="destination-item"
              data-aos="fade-up"
              data-aos-delay="100"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="image">
                <div className="ratting">
                  <i className="fas fa-star"></i> 4.8
                </div>
                <a href="#" className="heart">
                  <i className="fas fa-heart"></i>
                </a>
                <img
                  src="assets/images/destinations/visiting-place2.jpg"
                  alt="Destination"
                />
              </div>
              <div className="content">
                <span className="location">
                  <i className="fal fa-map-marker-alt"></i> Wildest, Italy
                </span>
                <h5>
                  <a href="destination-details.html">
                    Blue lake water view taken travel with daytime
                  </a>
                </h5>
                <span className="time">3 days 2 nights - Couple</span>
              </div>
              <div className="destination-footer">
                <span className="price">
                  <span>$63.00</span>/per person
                </span>
                <a href="#" className="read-more">
                  Book Now <i className="fal fa-angle-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-4 col-md-6">
            <div
              className="destination-item"
              data-aos="fade-up"
              data-aos-delay="200"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="image">
                <div className="ratting">
                  <i className="fas fa-star"></i> 4.8
                </div>
                <a href="#" className="heart">
                  <i className="fas fa-heart"></i>
                </a>
                <img
                  src="assets/images/destinations/visiting-place3.jpg"
                  alt="Destination"
                />
              </div>
              <div className="content">
                <span className="location">
                  <i className="fal fa-map-marker-alt"></i> Rome, Italy
                </span>
                <h5>
                  <a href="destination-details.html">
                    Woman standing near Colosseum, Rome
                  </a>
                </h5>
                <span className="time">3 days 2 nights - Couple</span>
              </div>
              <div className="destination-footer">
                <span className="price">
                  <span>$42</span>/per person
                </span>
                <a href="#" className="read-more">
                  Book Now <i className="fal fa-angle-right"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-xxl-3 col-xl-4 col-md-6">
            <div
              className="destination-item"
              data-aos="fade-up"
              data-aos-delay="300"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="image">
                <div className="ratting">
                  <i className="fas fa-star"></i> 4.8
                </div>
                <a href="#" className="heart">
                  <i className="fas fa-heart"></i>
                </a>
                <img
                  src="assets/images/destinations/visiting-place4.jpg"
                  alt="Destination"
                />
              </div>
              <div className="content">
                <span className="location">
                  <i className="fal fa-map-marker-alt"></i> Rome, Italy
                </span>
                <h5>
                  <a href="destination-details.html">
                    Woman standing near Colosseum, Rome
                  </a>
                </h5>
                <span className="time">3 days 2 nights - Couple</span>
              </div>
              <div className="destination-footer">
                <span className="price">
                  <span>$52.00</span>/per person
                </span>
                <a href="#" className="read-more">
                  Book Now <i className="fal fa-angle-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Destinations;
