import React from 'react'

const NotFoundPage = () => {
  return (
    <div>
      <section className="error-area pt-200 pb-100 rel z-1">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-xl-5 col-lg-6">
              <div
                className="error-content rmb-55"
                data-aos="fade-left"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <h1>OPPS!</h1>
                <div className="section-title mt-15 mb-25">
                  <h2>This Page Can’t be Found</h2>
                </div>
                <p>
                  Best features to include on business landing page are those that
                  quickly convey your value proposition, build trust, and
                  encourage action.
                </p>
              </div>
            </div>

            <div className="col-xl-5 col-lg-6">
              <div
                className="error-images"
                data-aos="fade-right"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                <img
                  src="assets/images/newsletter/404.png"
                  alt="404 Error"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NotFoundPage
