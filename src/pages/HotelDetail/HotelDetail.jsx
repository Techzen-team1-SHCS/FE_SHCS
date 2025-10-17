import React, { useEffect, useState } from 'react'
import IncludedExcluded from '../../components/IncludedExcluded/IncludedExcluded';
import HotelBooking from '../../components/HotelBooking/HotelBooking';
import { useParams } from 'react-router-dom';
import { hotelService } from '../../services/hotelService';
import SearchBar from '../../components/SearchBar/SearchBar';
const HotelDetail = () => {
  const { hotelId } = useParams();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hotelDataMock = {
    id: 1,
    name: "Trần Vĩ homestay",
    address: "15 Phố Duy Tân, Cau Giay, Hà Nội",
    description: "Trần Vĩ homestay là chỗ nghỉ có sân hiên nằm ở Đà Nẵng, cách Cầu khóa Tình yêu Đà Nẵng 2.8 km, Bảo tàng điêu khắc Chăm 3.5 km và Cầu sông Hàn 3.9 km. Chỗ nghỉ điều hòa này cách Bãi biển Mỹ Khê 7 phút đi bộ, khách có thể sử dụng WiFi miễn phí và chỗ đậu xe riêng có sẵn trong khuôn viên.Homestay có TV màn hình phẳng. Khăn tắm và ga trải giường có sẵn ở homestay.Homestay có bể sục.Trần Vĩ homestay cách Trung tâm thương mại Indochina Riverside 4.3 km và Công viên giải trí Asia Park Đà Nẵng 4.9 km.",
    rating: 5,
    images: [
      "assets/images/destinations/destination-details1.jpg",
      "assets/images/destinations/destination-details4.jpg",
      "assets/images/destinations/destination-details3.jpg",
      "assets/images/destinations/destination-details3.jpg",
      "assets/images/destinations/destination-details1.jpg",
      "assets/images/destinations/destination-details4.jpg",
      "assets/images/destinations/destination-details3.jpg",
      "assets/images/destinations/destination-details3.jpg",
    ],
    amenities: {
      included: ["Wi-Fi miễn phí", "Dịch vụ phòng", "Quầy lễ tân 24 giờ", "Phòng xông hơi khô", "Dịch vụ đưa đón miễn phí", "Nhà hàng", "Sân hiên"],
      excluded: ["Gratuities", "Hotel pickup and drop-off", "Lunch, Food & Drinks", "Optional upgrade to a glass", "Additional Services", "Insurance",]
    },
    contact: {
      email: "helpxample@gmail.com",
      phone: "+000 (123) 456 88"
    },
    mapUrl: "https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d96777.16150026117!2d-74.00840582560909!3d40.71171357405996!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1706508986625!5m2!1sen!2sbd"
  };
  useEffect(() => {
    const fetchHotelData = async () => {
      setLoading(true);
      try {
        const response = await hotelService.getHotelById(hotelId);
        setHotelData(response.data); // Giả sử API trả về { data: {...} }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching hotel data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (hotelId) {
      fetchHotelData();
    }
  }, [hotelId])
  if (loading) {
    return <div className="page-wrapper">Loading...</div>;
  }

  if (error) {
    return <div className="page-wrapper">Error: {error}</div>;
  }

  const displayData = hotelData || hotelDataMock;
  const handleBookNow = (data) => {
    console.log("Booking data:", data);
    // Gọi API booking ở đây nếu cần, ví dụ:
    // await bookingService.createBooking(data);
  };
  const galleryColumns = hotelDataMock.images;
  return (
    <div className='page-wrapper'>
      
      <section className="page-banner-two rel z-1 mt-150">
        
        <div className="container-fluid mt-250">
          <SearchBar />
          <hr className="mt-0" />
          <div className="container ">
            
            <div className="banner-inner pt-15  mt-30">
              <h2
                className="page-title "
                data-aos="fade-left"
                data-aos-duration="1500"
                data-aos-offset="50"
              >
                {hotelDataMock.name}

              </h2>

            </div>
            <span className="location d-inline-block mb-10">
              <i className="fal fa-map-marker-alt"></i> {displayData.address}
            </span>
          </div>
        </div>
      </section>
      <div className="tour-gallery" >
        <div className="container-fluid " style={{ width: '88%' }}>
          <div className="row gap-10 justify-content-center rel ">
            {/* Chỉ hiển thị 3 ảnh đầu hoặc toàn bộ */}
            {(showAllPhotos ? galleryColumns : galleryColumns.slice(0, 3)).map((imgSrc, imgIndex) => (
              <div className="col-lg-4 col-md-6 " key={imgIndex}>
                <div className="gallery-item">
                  <img src={imgSrc} alt={`Destination ${imgIndex + 1}`} />
                </div>
              </div>
            ))}

            {/* Nút xem tất cả ảnh */}
            <div className="col-lg-12">
              <div className="gallery-more-btn">
                <button
                  className="theme-btn style-two bgc-secondary"
                  onClick={() => setShowAllPhotos(!showAllPhotos)}
                >
                  <span data-hover={showAllPhotos ? "Show Less" : "See All Photos"}>
                    {showAllPhotos ? "Show Less" : "See All Photos"}
                  </span>
                  <i className={`fal fa-arrow-${showAllPhotos ? "up" : "down"}`}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="tour-header-area pt-70 rel z-1">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-7">
              <div
                className="tour-header-content mb-15"
                data-aos="fade-left"
                data-aos-duration="1500"
                data-aos-offset="50"
              >


                <div className="section-title pb-5">
                  <h2>
                    <div className="tour-details-content">
                      <p>
                        {displayData.description}
                      </p>
                    </div>
                  </h2>
                </div>
              </div>
            </div>

            <div
              className="col-xl-4 col-lg-5 text-lg-end"
              data-aos="fade-right"
              data-aos-duration="1500"
              data-aos-offset="50"
            >
              <div className="tour-header-social mb-10">
                <a href="#">
                  <i className="far fa-share-alt"></i> Share hotel
                </a>
                <a href="#">
                  <i className="fas fa-heart bgc-secondary"></i> Wish list
                </a>
              </div>
            </div>
          </div>

          <hr className="mt-50 mb-70" />
        </div>
      </section>
      <section className="tour-details-page pb-100">
        <div className="container">
          <div className="row">
            {/* Left Content */}
            <div className="col-lg-8">
              {/* Included / Excluded */}
                <IncludedExcluded included={displayData.amenities.included}
                  excluded={displayData.amenities.excluded} />
              {/* Map */}
              <h3>Maps</h3>
              <div className="tour-map mt-30 mb-50">
                <iframe
                  src={displayData.mapUrl}
                  style={{ border: 0, width: "100%" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tour Map"
                ></iframe>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="col-lg-4 col-md-8 col-sm-10 rmt-75">
              <div className="blog-sidebar tour-sidebar">
                {/* Booking Widget */}
                <HotelBooking onBook={handleBookNow} />

                {/* Contact Widget */}
                <div
                  className="widget widget-contact mt-50"
                  data-aos="fade-up"
                  data-aos-duration="1500"
                  data-aos-offset="50"
                >
                  <h5 className="widget-title">Need Help?</h5>
                  <ul className="list-style-one">
                    <li>
                      <i className="far fa-envelope"></i>{" "}
                      <a href={`mailto:${displayData.contact.email}`}>{displayData.contact.email}</a>
                    </li>
                    <li>
                      <i className="far fa-phone-volume"></i>{" "}
                      <a href={`tel:${displayData.contact.phone}`}>{displayData.contact.phone}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default HotelDetail

