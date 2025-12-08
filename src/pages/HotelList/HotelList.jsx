import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { hotelService } from "../../services/hotelService";
import SearchBar from "../../components/SearchBar/SearchBar";
import Hotel from "../../components/Hotel/Hotel";
import HotelListFilter from "../../components/HotelListFilter/HotelListFilter";
import { useBehavior } from "../../contexts/BehaviorContext";
import "./HotelList.css";
import TopHotelSlider from "../../components/TopHotelSlider/TopHotelSlider";
import PartLoading from "../../components/Loading/PartLoading";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { 
  FaThList, 
  FaSync, 
  FaArrowRight, 
  FaArrowLeft,
  FaChevronRight,
  FaChevronLeft,
  FaSpinner 
} from "react-icons/fa";

function HotelList() {
  const location = useLocation();
  const { logBehavior } = useBehavior();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [viewMode, setViewMode] = useState("infinite"); // "infinite" hoặc "pagination"
  const [currentPage, setCurrentPage] = useState(1);

  // Map tiện nghi
  const amenitiesMap = {
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
    "Beach access": "Beach access",
    "Private pool": "Private pool",
    "Garden": "Garden",
    "Terrace": "Terrace",
    "Spa": "Spa",
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
      per_page: 10,
    };
  };

  const filtersFromQuery = getFiltersFromQuery();
  const mappedFilters = selectedFilters.map((f) => amenitiesMap[f] || f);

  // =========== INFINITE QUERY ===========
  const fetchHotelsInfinite = async ({ pageParam = 1 }) => {
    const response = await hotelService.searchHotels({
      ...filtersFromQuery,
      selectedFilters: mappedFilters,
      page: pageParam,
      per_page: 10,
    });
    return response;
  };

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchInfinite,
    isLoading: infiniteLoading,
  } = useInfiniteQuery({
    queryKey: ["hotels-infinite", { ...filtersFromQuery, selectedFilters: mappedFilters }],
    queryFn: fetchHotelsInfinite,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const next = lastPage.pagination.current_page + 1;
      return next <= lastPage.pagination.last_page ? next : undefined;
    },
    keepPreviousData: true,
  });

  // =========== PAGINATION QUERY ===========
  const fetchHotelsPagination = async () => {
    const response = await hotelService.searchHotels({
      ...filtersFromQuery,
      selectedFilters: mappedFilters,
      page: currentPage,
      per_page: 10,
    });
    return response;
  };

  const {
    data: paginationData,
    refetch: refetchPagination,
    isLoading: paginationLoading,
    isFetching: paginationFetching,
  } = useQuery({
    queryKey: ["hotels-pagination", { 
      ...filtersFromQuery, 
      selectedFilters: mappedFilters,
      page: currentPage 
    }],
    queryFn: fetchHotelsPagination,
    keepPreviousData: true,
  });

  // =========== DATA PROCESSING ===========
  let hotels = [];
  let totalResults = 0;
  let paginationInfo = null;
  let loading = false;

  if (viewMode === "infinite") {
    hotels = infiniteData?.pages.flatMap((page) => page.hotels || []) || [];
    totalResults = infiniteData?.pages?.[0]?.total || 0;
    paginationInfo = infiniteData?.pages?.[0]?.pagination;
    loading = infiniteLoading;
  } else {
    hotels = paginationData?.hotels || [];
    totalResults = paginationData?.total || 0;
    paginationInfo = paginationData?.pagination;
    loading = paginationLoading;
  }

  const destination = filtersFromQuery.destination || "Tổng khách sạn";

  // =========== HANDLERS ===========
  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
    logBehavior("filter_change", { filters: newFilters });
    setCurrentPage(1); // Reset về trang 1
    
    if (viewMode === "infinite") {
      refetchInfinite();
    } else {
      refetchPagination();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === "pagination") {
      setCurrentPage(1);
    }
    logBehavior("view_mode_change", { mode });
  };

  const renderPagination = () => {
    if (!paginationInfo || viewMode !== "pagination") return null;

    const { current_page, last_page } = paginationInfo;
    const pages = [];

    // Logic hiển thị trang
    let startPage = Math.max(1, current_page - 2);
    let endPage = Math.min(last_page, current_page + 2);

    if (current_page <= 3) {
      endPage = Math.min(5, last_page);
    }

    if (current_page >= last_page - 2) {
      startPage = Math.max(last_page - 4, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination-container">
        <div className="pagination-info">
          Hiển thị {(current_page - 1) * 10 + 1} - {Math.min(current_page * 10, totalResults)} của {totalResults} kết quả
        </div>
        
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(current_page - 1)}
            disabled={current_page === 1 || paginationFetching}
          >
            <FaChevronLeft /> Trước
          </button>

          {startPage > 1 && (
            <>
              <button
                className={`pagination-btn ${1 === current_page ? "active" : ""}`}
                onClick={() => handlePageChange(1)}
                disabled={paginationFetching}
              >
                1
              </button>
              {startPage > 2 && <span className="pagination-dots">...</span>}
            </>
          )}

          {pages.map((page) => (
            <button
              key={page}
              className={`pagination-btn ${page === current_page ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
              disabled={paginationFetching}
            >
              {page}
            </button>
          ))}

          {endPage < last_page && (
            <>
              {endPage < last_page - 1 && <span className="pagination-dots">...</span>}
              <button
                className={`pagination-btn ${last_page === current_page ? "active" : ""}`}
                onClick={() => handlePageChange(last_page)}
                disabled={paginationFetching}
              >
                {last_page}
              </button>
            </>
          )}

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(current_page + 1)}
            disabled={current_page === last_page || paginationFetching}
          >
            Sau <FaChevronRight />
          </button>
        </div>

        <div className="pagination-jump">
          <span>Đến trang:</span>
          <input
            type="number"
            min="1"
            max={last_page}
            defaultValue={current_page}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= last_page) {
                  handlePageChange(page);
                }
              }
            }}
          />
          <button 
            onClick={() => {
              const input = document.querySelector('.pagination-jump input');
              const page = parseInt(input.value);
              if (page >= 1 && page <= last_page) {
                handlePageChange(page);
              }
            }}
          >
            Đi
          </button>
        </div>
      </div>
    );
  };

  // =========== RENDER ===========
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
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      destination
                    )}&output=embed`}
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
              {/* Header với view mode toggle */}
              <div className="hotel-list-header">
                <div className="header-left">
                  <h4 style={{ fontWeight: 700 }}>
                    {destination}: tìm thấy {totalResults} chỗ nghỉ
                  </h4>
                  <div className="view-mode-toggle">
                    <span className="toggle-label">Chế độ xem:</span>
                    <button
                      className={`mode-btn ${viewMode === "infinite" ? "active" : ""}`}
                      onClick={() => handleViewModeChange("infinite")}
                      title="Cuộn vô tận"
                    >
                      <FaSync /> Cuộn vô tận
                    </button>
                    <button
                      className={`mode-btn ${viewMode === "pagination" ? "active" : ""}`}
                      onClick={() => handleViewModeChange("pagination")}
                      title="Phân trang"
                    >
                      <FaThList /> Phân trang
                    </button>
                  </div>
                </div>

                {paginationInfo && viewMode === "pagination" && (
                  <div className="header-right">
                    <div className="page-info">
                      Trang {paginationInfo.current_page} / {paginationInfo.last_page}
                    </div>
                  </div>
                )}
              </div>

              {/* Nội dung hotels */}
              {viewMode === "infinite" ? (
                <InfiniteScroll
                  dataLength={hotels.length}
                  next={fetchNextPage}
                  hasMore={!!hasNextPage}
                  loader={<PartLoading />}
                  style={{ overflow: "visible" }}
                  endMessage={
                    hotels.length > 0 && (
                      <div className="infinite-end-message">
                        <p>Bạn đã xem hết tất cả {totalResults} khách sạn!</p>
                        <button 
                          className="back-to-top"
                          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                          <FaArrowRight /> Lên đầu trang
                        </button>
                      </div>
                    )
                  }
                >
                  {hotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                  {isFetchingNextPage && <PartLoading />}
                </InfiniteScroll>
              ) : (
                <>
                  {hotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                  
                  {paginationFetching && (
                    <div className="loading-overlay">
                      <FaSpinner className="spinner" />
                      <span>Đang tải trang {currentPage}...</span>
                    </div>
                  )}
                </>
              )}

              {/* Hiển thị khi không có kết quả */}
              {!loading && hotels.length === 0 && (
                <div className="no-results">
                  <div className="no-results-icon">🏨</div>
                  <h3>Không tìm thấy khách sạn phù hợp</h3>
                  <p>Hãy thử thay đổi bộ lọc hoặc tìm kiếm với điều kiện khác</p>
                  <button 
                    className="clear-filters-btn"
                    onClick={() => {
                      setSelectedFilters([]);
                      setCurrentPage(1);
                    }}
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}

              {/* Pagination controls */}
              {viewMode === "pagination" && hotels.length > 0 && renderPagination()}
            </div>
          </div>

          <TopHotelSlider />
        </div>
      </section>

      {/* CSS inline để không phải tạo file mới */}
      <style jsx>{`
        .hotel-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }

        .header-left {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .view-mode-toggle {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .toggle-label {
          font-weight: 600;
          color: #666;
        }

        .mode-btn {
          padding: 8px 16px;
          border: 2px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          transition: all 0.3s;
        }

        .mode-btn:hover {
          border-color: #007bff;
          color: #007bff;
        }

        .mode-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .pagination-container {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          display: flex;
          flex-direction: column;
          gap: 20px;
          align-items: center;
        }

        .pagination-info {
          color: #666;
          font-size: 14px;
        }

        .pagination-controls {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .pagination-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          min-width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f8f9fa;
          border-color: #007bff;
        }

        .pagination-btn.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-dots {
          padding: 8px;
          color: #999;
        }

        .pagination-jump {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pagination-jump input {
          width: 60px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          text-align: center;
        }

        .pagination-jump button {
          padding: 8px 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .loading-overlay {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.9);
          padding: 20px 30px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 1000;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .infinite-end-message {
          text-align: center;
          padding: 30px;
          color: #666;
          border-top: 1px solid #eee;
          margin-top: 20px;
        }

        .back-to-top {
          margin-top: 15px;
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
        }

        .no-results-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .clear-filters-btn {
          margin-top: 20px;
          padding: 12px 24px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hotel-list-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .view-mode-toggle {
            flex-wrap: wrap;
          }
          
          .pagination-controls {
            gap: 4px;
          }
          
          .pagination-btn {
            padding: 6px 12px;
            min-width: 36px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}

// Helper component để render hotel card
function HotelCard({ hotel }) {
  const firstRoom = hotel.rooms?.[0];
  const duration = firstRoom?.available_from && firstRoom?.available_to
    ? `Từ ${firstRoom.available_from} đến ${firstRoom.available_to}`
    : "Chưa có thông tin";

  return (
    <Hotel
      key={hotel.id}
      image={hotel.images?.[0]?.url || "/default-hotel.jpg"}
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
}

export default HotelList;