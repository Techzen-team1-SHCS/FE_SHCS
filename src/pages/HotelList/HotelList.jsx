import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { hotelService } from "../../services/hotelService";
import SearchBar from "../../components/SearchBar/SearchBar";
import Hotel from "../../components/Hotel/Hotel";
import TopHotelSlider from "../../components/TopHotelSlider/TopHotelSlider";

function HotelList() {
  const mockHotels = [
    {
      id: 1,
      name: "Luxury Beach Resort & Spa",
      description: "Khách sạn 5 sao với view biển tuyệt đẹp, dịch vụ spa đẳng cấp và hồ bơi vô cực",
      province: "Nha Trang",
      duration: "Từ 2025-10-20 đến 2025-12-31",
      guests: '2',
      price: 2500000,
      price_formatted: "2,500,000",
      badge: "Best Seller",
      hotel_class: 5,
      rating:5,
      images: [
        { url: "/assets/images/gallery/gallery-slider1.jpg" }
      ]
    },
    {
      id: 2,
      name: "Mountain View Premium Hotel",
      description: "Trải nghiệm nghỉ dưỡng giữa thiên nhiên với không khí trong lành và view núi non hùng vĩ",
      province: "Đà Lạt",
      duration: "2 ngày 1 đêm",
      guests: 2,
      price: 1800000,
      price_formatted: "1,800,000",
      badge: "Trending",
      hotel_class: 4,
      images: [
        { url: "assets/images/hotels/hotel2.jpg" }
      ]
    },
    {
      id: 3,
      name: "City Center Business Hotel",
      description: "Khách sạn hiện đại nằm ngay trung tâm thành phố, thuận tiện cho công việc và giải trí",
      province: "Hồ Chí Minh",
      duration: "1 ngày",
      guests: 1,
      price: 1200000,
      price_formatted: "1,200,000",
      badge: "Special Offer",
      hotel_class: 4,
      images: [
        { url: "assets/images/hotels/hotel3.jpg" }
      ]
    },
    {
      id: 4,
      name: "Heritage Boutique Hotel",
      description: "Khách sạn mang đậm nét kiến trúc cổ điển, phù hợp cho những ai yêu thích văn hóa truyền thống",
      province: "Hội An",
      duration: "3 ngày 2 đêm",
      guests: 2,
      price: 1900000,
      price_formatted: "1,900,000",
      badge: "Cultural",
      hotel_class: 5,
      images: [
        { url: "assets/images/hotels/hotel4.jpg" }
      ]
    },
    {
      id: 5,
      name: "Riverside Luxury Resort",
      description: "Khu nghỉ dưỡng sang trọng bên bờ sông, mang đến trải nghiệm thư giãn tuyệt vời",
      province: "Cần Thơ",
      duration: "2 ngày 1 đêm",
      guests: 2,
      price: 1600000,
      price_formatted: "1,600,000",
      badge: "Luxury",
      hotel_class: 4,
      images: [
        { url: "assets/images/hotels/hotel5.jpg" }
      ]
    },
    {
      id: 6,
      name: "Skyline Premium Hotel",
      description: "Khách sạn cao cấp với view toàn cảnh thành phố, phòng ốc tiện nghi hiện đại",
      province: "Hà Nội",
      duration: "2 ngày 1 đêm",
      guests: 2,
      price: 2200000,
      price_formatted: "2,200,000",
      badge: "Premium",
      hotel_class: 5,
      images: [
        { url: "assets/images/hotels/hotel6.jpg" }
      ]
    },
    {
      id: 7,
      name: "Seaside Paradise Resort",
      description: "Thiên đường nghỉ dưỡng bên bờ biển với dịch vụ all-inclusive đẳng cấp",
      province: "Phú Quốc",
      duration: "4 ngày 3 đêm",
      guests: 2,
      price: 3500000,
      price_formatted: "3,500,000",
      badge: "All Inclusive",
      hotel_class: 5,
      images: [
        { url: "assets/images/hotels/hotel7.jpg" }
      ]
    },
    {
      id: 8,
      name: "Eco Friendly Mountain Lodge",
      description: "Khu nghỉ dưỡng thân thiện với môi trường, lý tưởng cho du lịch xanh và bền vững",
      province: "Sa Pa",
      duration: "3 ngày 2 đêm",
      guests: 2,
      price: 1400000,
      price_formatted: "1,400,000",
      badge: "Eco Friendly",
      hotel_class: 3,
      images: [
        { url: "assets/images/hotels/hotel8.jpg" }
      ]
    }
  ];
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [totalResults, setTotalResults] = useState([]);
  // Hàm parse query params từ URL
  const getFiltersFromQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return {
      destination: searchParams.get("destination") || "",
      roomType: searchParams.get("roomType") || "",
      checkIn: searchParams.get("checkIn") || "",
      checkOut: searchParams.get("checkOut") || "",
      guests: searchParams.get("guests") || "",
      searchTerm: searchParams.get("searchTerm") || "",
      sort: searchParams.get("sort") || "price_asc",
      page: searchParams.get("page") || 1,
      per_page: 10
    };
  };

  const loadHotels = async (filters) => {
  setLoading(true);
    try {
      const response = await hotelService.searchHotels(filters);
      setHotels(response.hotels || []);
      setPagination(response.pagination || { current_page: 1, last_page: 1 });
      setTotalResults(response.total);
    } catch (error) {
      console.error("Error loading hotels:", error);
      setHotels(mockHotels);
      
    } finally {
      setLoading(false);
    }
  };
  console.log(hotels);

  // Load khi component mount hoặc URL query params thay đổi
  useEffect(() => {
    const filters = getFiltersFromQuery();
    loadHotels(filters);
  }, [location.search]);

  const handlePageChange = (page) => {
    const filters = getFiltersFromQuery();
    filters.page = page;
    loadHotels(filters);
  };
  const destination = getFiltersFromQuery().destination || "Hanoi";
  console.log(totalResults);
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
              Tour List View
            </h2>
          </div>
        </div>
      </section>
      <SearchBar />
      <section className="tour-list-page py-50 rel z-1">
        <div className="container">
          <div className="row flex">
            <div className="col-lg-3 col-md-6 col-sm-10 rmb-75">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(destination)}&output=embed`}
                width="100%"
                height="300px"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Map"
              ></iframe>
            </div>
            <div className="col-lg-9">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <h4 style={{ fontWeight: 700 }}>{destination}: tìm thấy {totalResults} chỗ nghỉ</h4>
                  {hotels.map((hotel) => (
                    <Hotel
                      key={hotel.id}
                      image={hotel.images?.[0]?.url || '/assets/images/default-hotel.jpg'}
                      title={hotel.name}
                      description={hotel.description}
                      location={hotel.province}
                      duration={hotel.duration}
                      guests={hotel.guests}
                      price={`${hotel.price_formatted || hotel.price} VNĐ`}
                      badgeLabel={hotel.badge}
                      badgeClass={hotel.hotel_class}
                      rating={(hotel.hotel_class / 10).toFixed(1)}
                      detailsUrl={`/hotel/${hotel.id}`}
                    />
                  ))}
                </>
              )}
              {pagination.last_page > 1 && (
                <div className="pagination mt-30" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Array.from({ length: pagination.last_page }, (_, i) => (
                    <button
                      key={i}
                      disabled={pagination.current_page === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: pagination.current_page === i + 1 ? '#007bff' : '#f0f0f0',
                        color: pagination.current_page === i + 1 ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <TopHotelSlider />
        </div>
      </section>

    </div>
  );
}

export default HotelList;
