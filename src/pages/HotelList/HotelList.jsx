import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { hotelService } from "../../services/hotelService";
import SearchBar from "../../components/SearchBar/SearchBar";
import Hotel from "../../components/Hotel/Hotel";
import HotelListFilter from "../../components/HotelListFilter/HotelListFilter";
import { useBehavior } from "../../contexts/BehaviorContext";

import './HotelList.css';
import TopHotelSlider from "../../components/TopHotelSlider/TopHotelSlider";
function HotelList() {
  const location = useLocation();
  const { logBehavior } = useBehavior();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
  const [totalResults, setTotalResults] = useState(0);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const amenitiesMap = {
    // Tiện nghi phổ biến
    "WiFi miễn phí": "WiFi",
    "Nhà hàng": "Restaurant",
    "Dịch vụ phòng": "Room service",
    "Lễ tân 24 giờ": "24h front desk",
    "Trung tâm thể dục": "Fitness center",
    "Trung tâm Spa & chăm sóc sức khoẻ": "Spa",
    "Hồ bơi": "Swimming pool",
    "Ban công": "Balcony",
    "Căn hộ": "Apartment",
    "Chỗ đỗ xe": "Parking",
    "Bể sục": "Jacuzzi",
    "Phòng tắm riêng": "Private bathroom",
    "Nhìn ra biển": "Sea view",
    "Quầy Bar": "Bar",
    "Quầy tour": "Tour desk",
    "Family rooms": "Family rooms",
    "Kitchenette": "Kitchenette",
    "Shared kitchen": "Shared kitchen",
    "Common area": "Common area",
    "Laundry": "Laundry",
    "Sky bar": "Sky bar",
    "Fitness center": "Fitness center",
    "Beach access": "Beach access",
    "Private pool": "Private pool",
    "Garden": "Garden",
    "Terrace": "Terrace",
    "Spa": "Spa"
  };
  // Lấy filter từ URL
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
      page: Number(searchParams.get("page")) || 1,
      per_page: 10,
    };
  };

  // Load hotels
  const loadHotels = async (params) => {
    setLoading(true);
    try {
      const mappedFilters = selectedFilters.map(
        (f) => amenitiesMap[f] || f
      );
      const filters = { ...params, selectedFilters: mappedFilters }; // lấy từ state
      const response = await hotelService.searchHotels(filters);
      setHotels(response.hotels || []);
      setPagination(response.pagination || { current_page: 1, last_page: 1 });
      setTotalResults(response.total || 0);
    } catch (error) {
      console.error("Error loading hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  // Khi mount hoặc URL query thay đổi
  useEffect(() => {
    const filtersFromQuery = getFiltersFromQuery();
    loadHotels(filtersFromQuery);
  }, [location.search, selectedFilters]);

  // Khi tick/un-tick filter
 const handleFilterChange = (newFilters) => {
  setSelectedFilters(newFilters); // cập nhật state
  logBehavior("filter_change", { filters: newFilters }); // log cho tracking
  const filtersFromQuery = getFiltersFromQuery();
  // override selectedFilters bằng newFilters
  const filtersToLoad = { ...filtersFromQuery, selectedFilters: newFilters };
  loadHotels(filtersToLoad); // gửi filter chính xác
};

  // Pagination
  const handlePageChange = (page) => {
    const filters = getFiltersFromQuery();
    filters.page = page;
    loadHotels(filters);
  };

  const destination = getFiltersFromQuery().destination || "Hanoi";

  return (
    <div className="page-wrapper">
      <section
        className="page-banner-area pt-50 pb-35 rel z-1 bgs-cover"
        style={{ backgroundImage: "url(assets/images/banner/banner.jpg)" }}
      >
        <div className="container">
          <div className="banner-inner text-white mb-50">
            <h2 className="page-title mb-10">Tour List View</h2>
          </div>
        </div>
      </section>

      <SearchBar />

      <section className="tour-list-page py-50 rel z-1">
        <div className="container">
          <div className="row flex">
            <div className="col-lg-3 col-md-6 col-sm-10 rmb-75">
              <div className="sticky-sidebar">
                <div
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    marginBottom: "15px",
                  }}
                >
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(destination)}&output=embed`}
                    width="100%"
                    height="300px"
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    loading="lazy"
                    title="Map"
                  ></iframe>
                </div>

                <HotelListFilter onFilterChange={handleFilterChange} />
              </div>
            </div>
            <div className="col-lg-9">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <h4 style={{ fontWeight: 700 }}>
                    {destination}: tìm thấy {totalResults} chỗ nghỉ
                  </h4>

                  {hotels.map((hotel) => {
                    const firstRoom = hotel.rooms?.[0];
                    const dateRoom = firstRoom?.available_from || null;
                    const dueRoom = firstRoom?.available_to || null;
                    const duration =
                      dateRoom && dueRoom
                        ? `Từ ${dateRoom} đến ${dueRoom}`
                        : "Chưa có thông tin";

                    return (
                      <Hotel
                        key={hotel.id}
                        image={hotel.images?.[0]?.url || "/assets/images/default-hotel.jpg"}
                        title={hotel.name}
                        description={hotel.description}
                        location={hotel.province}
                        duration={duration}
                        guests={firstRoom?.max_guest || 0}
                        price={`${hotel.price_formatted || hotel.price} VNĐ`}
                        badgeLabel={hotel.badge}
                        badgeClass={hotel.hotel_class}
                        rating={(hotel.hotel_class / 10).toFixed(1)}
                        detailsUrl={`/hotel/${hotel.id}`}
                        id={hotel.id}
                      />
                    );
                  })}
                </>
              )}

              {pagination.last_page > 1 && (
                <div className="pagination mt-30" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {Array.from({ length: pagination.last_page }, (_, i) => (
                    <button
                      key={i}
                      disabled={pagination.current_page === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: pagination.current_page === i + 1 ? "#007bff" : "#f0f0f0",
                        color: pagination.current_page === i + 1 ? "white" : "black",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <TopHotelSlider></TopHotelSlider>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HotelList;
