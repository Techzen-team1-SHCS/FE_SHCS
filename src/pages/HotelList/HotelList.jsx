import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { hotelService } from "../../services/hotelService";
import SearchBar from "../../components/SearchBar/SearchBar";
import Hotel from "../../components/Hotel/Hotel";

function HotelList() {
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [totalResults,setTotalResults]=useState([]);
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
                                    <h4 style={{fontWeight:700}}>{destination}: tìm thấy {totalResults} chỗ nghỉ</h4>
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
            </section>
            
        </div>
  );
}

export default HotelList;
