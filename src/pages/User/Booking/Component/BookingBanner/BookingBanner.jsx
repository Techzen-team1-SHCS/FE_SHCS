const BookingBanner = ({ image }) => {
  return (
    <section
      className="page-banner-area pt-50 pb-35 rel z-1 bgs-cover"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="container">
        <div className="banner-inner text-white mb-50">
          <h2 className="page-title mb-10">Booking</h2>
        </div>
      </div>
    </section>
  );
};

export default BookingBanner;