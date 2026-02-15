import { useState, useEffect, useContext, useRef, useCallback } from "react";
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
import {
  FaThList,
  FaSync,
  FaArrowRight,
  FaChevronRight,
  FaChevronLeft,
  FaSpinner
} from "react-icons/fa";
import { behaviorService } from "../../services/behaviorService";
import { AuthContext } from "../../contexts/AuthContext";

function HotelList() {
  const location = useLocation();
  const { logBehavior } = useBehavior();
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [viewMode, setViewMode] = useState("infinite");
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useContext(AuthContext);
  
  // Approve user
  const userRef = useRef(null);
  const hasSentRef = useRef(false);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    return () => {
      if (!userRef.current || hasSentRef.current) return;

      hasSentRef.current = true;

      behaviorService.approveUser(userRef.current.id);
    };
  }, []);


  // Refs
  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);
  const lastLoadTimeRef = useRef(0);
  const isInitialMountRef = useRef(true);
  const sentinelTriggeredRef = useRef(false);

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
  const getFiltersFromQuery = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    return {
      destination: searchParams.get("destination") || "",
      roomType: searchParams.get("roomType") || "",
      checkIn: searchParams.get("checkIn") || "",
      checkOut: searchParams.get("checkOut") || "",
      guests: searchParams.get("guests") || "",
      searchTerm: searchParams.get("searchTerm") || "",
      sort: searchParams.get("sort") || "price_asc",
    };
  }, [location.search]);

  const filtersFromQuery = getFiltersFromQuery();
  const mappedFilters = selectedFilters.map((f) => amenitiesMap[f] || f);

  // Query key
  const queryKeyBase = [
    "hotels",
    filtersFromQuery.destination,
    filtersFromQuery.roomType,
    filtersFromQuery.checkIn,
    filtersFromQuery.checkOut,
    filtersFromQuery.guests,
    filtersFromQuery.searchTerm,
    filtersFromQuery.sort,
    JSON.stringify(mappedFilters)
  ];

  // =========== INFINITE QUERY ===========
  const fetchHotelsInfinite = async ({ pageParam = 1 }) => {
    console.log(`🔍 Fetching page ${pageParam}...`);
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
    isFetching: infiniteFetching,
    isError: infiniteError,
    error: infiniteErrorData
  } = useInfiniteQuery({
    queryKey: [...queryKeyBase, "infinite"],
    queryFn: fetchHotelsInfinite,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const next = lastPage.pagination.current_page + 1;
      return next <= lastPage.pagination.last_page ? next : undefined;
    },
    keepPreviousData: true,
    initialPageParam: 1,
    staleTime: 60000,
    // 🚀 LOAD NGAY TỪ ĐẦU
    onSuccess: (data) => {
      if (isInitialMountRef.current && data?.pages?.[0]?.hotels?.length > 0) {
        isInitialMountRef.current = false;
        
        const hasMore = data.pages[0].pagination?.current_page < data.pages[0].pagination?.last_page;
        if (hasMore && !isFetchingNextPage && !sentinelTriggeredRef.current) {
          setTimeout(() => {
            console.log("⚡ Auto-loading page 2 on initial mount");
            fetchNextPage();
            sentinelTriggeredRef.current = true;
          }, 300);
        }
      }
    },
    enabled: viewMode === "infinite",
  });

  // =========== PAGINATION QUERY ===========
  const fetchHotelsPagination = async () => {
    console.log(`🔍 Fetching page ${currentPage} (pagination)...`);
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
    isError: paginationError,
    error: paginationErrorData
  } = useQuery({
    queryKey: [...queryKeyBase, "pagination", currentPage],
    queryFn: fetchHotelsPagination,
    keepPreviousData: true,
    staleTime: 60000,
    enabled: viewMode === "pagination",
  });

  // =========== INTERSECTION OBSERVER VỚI SENTINEL Ở GIỮA ===========
  useEffect(() => {
    // Cleanup observer cũ
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    // Reset sentinel flag
    sentinelTriggeredRef.current = false;

    // Chỉ chạy khi ở chế độ infinite và có trang tiếp theo
    if (viewMode !== "infinite" || !hasNextPage || isFetchingNextPage) {
      return;
    }

    console.log("🔄 Setting up EARLY Intersection Observer (mid-list)");

    const options = {
      root: null,
      rootMargin: "0px 0px 0px 0px", // 🚀 Trigger ngay khi vừa thấy
      threshold: 0.01, // Rất nhạy
    };

    const handleIntersection = (entries) => {
      const [entry] = entries;
      const now = Date.now();
      
      // Throttle
      if (now - lastLoadTimeRef.current < 500) {
        return;
      }

      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && !sentinelTriggeredRef.current) {
        console.log("⚡ MID-LIST Sentinel detected! Loading next page...");
        lastLoadTimeRef.current = now;
        sentinelTriggeredRef.current = true;
        fetchNextPage();
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, options);

    // QUAN TRỌNG: Đặt sentinel ở vị trí giữa danh sách
    setTimeout(() => {
      const sentinelElement = document.querySelector('.mid-list-sentinel');
      if (sentinelElement && observerRef.current) {
        observerRef.current.observe(sentinelElement);
        console.log("👁️ Observer attached to MID-LIST sentinel");
        
        // Kiểm tra xem sentinel có đang trong viewport không
        const checkSentinelVisibility = () => {
          if (sentinelElement) {
            const rect = sentinelElement.getBoundingClientRect();
            const isVisible = rect.top <= window.innerHeight;
            
            if (isVisible && hasNextPage && !isFetchingNextPage && !sentinelTriggeredRef.current) {
              console.log("🎯 Sentinel is already visible! Triggering immediate load...");
              sentinelTriggeredRef.current = true;
              fetchNextPage();
            }
          }
        };
        
        setTimeout(checkSentinelVisibility, 100);
      }
    }, 100);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [viewMode, hasNextPage, isFetchingNextPage, fetchNextPage, infiniteData?.pages?.length]);

  // =========== DATA PROCESSING ===========
  let hotels = [];
  let totalResults = 0;
  let paginationInfo = null;
  let loading = false;
  let isError = false;
  let error = null;

  if (viewMode === "infinite") {
    hotels = infiniteData?.pages.flatMap((page) => page.hotels || []) || [];
    totalResults = infiniteData?.pages?.[0]?.total || 0;
    paginationInfo = infiniteData?.pages?.[0]?.pagination;
    loading = infiniteLoading;
    isError = infiniteError;
    error = infiniteErrorData;
  } else {
    hotels = paginationData?.hotels || [];
    totalResults = paginationData?.total || 0;
    paginationInfo = paginationData?.pagination;
    loading = paginationLoading;
    isError = paginationError;
    error = paginationErrorData;
  }

  // Tính vị trí đặt sentinel (ở giữa danh sách)
  const getSentinelPosition = () => {
    if (hotels.length <= 5) return Math.floor(hotels.length / 2); // Giữa danh sách
    return 5; // Sau hotel thứ 5
  };

  const sentinelPosition = getSentinelPosition();

  const destination = filtersFromQuery.destination || "Tổng khách sạn";

  // =========== HANDLERS ===========
  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1);
    isInitialMountRef.current = true;
    sentinelTriggeredRef.current = false;
    lastLoadTimeRef.current = 0;
    
    setTimeout(() => {
      if (viewMode === "infinite") {
        refetchInfinite();
      } else {
        refetchPagination();
      }
    }, 0);
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
    isInitialMountRef.current = true;
    sentinelTriggeredRef.current = false;
    lastLoadTimeRef.current = 0;
  };

  const renderPagination = () => {
    if (!paginationInfo || viewMode !== "pagination") return null;

    const { current_page, last_page } = paginationInfo;
    const pages = [];

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
                  {!loading || hotels.length > 0 ? (
                    <h4 style={{ fontWeight: 700 }}>
                      {destination}: tìm thấy {totalResults} chỗ nghỉ
                    </h4>
                  ) : (
                    <h4 style={{ fontWeight: 700 }}>
                      {destination}: đang tìm kiếm...
                    </h4>
                  )}
                  <div className="view-mode-toggle">
                    <span className="toggle-label">Chế độ xem:</span>
                    <button
                      className={`mode-btn ${viewMode === "infinite" ? "active" : ""}`}
                      onClick={() => handleViewModeChange("infinite")}
                      title="Cuộn vô tận - load cực sớm"
                    >
                      <FaSync /> Cuộn vô tận (LOAD SỚM)
                    </button>
                    <button
                      className={`mode-btn ${viewMode === "pagination" ? "active" : ""}`}
                      onClick={() => handleViewModeChange("pagination")}
                      title="Phân trang truyền thống"
                    >
                      <FaThList /> Phân trang
                    </button>
                  </div>
                </div>

                {viewMode === "infinite" && hotels.length > 0 && (
                  <div className="header-right">
                    <div className="page-info">
                      <span style={{ color: '#dc3545', fontWeight: 'bold' }}>
                        ⚡ LOAD TRƯỚC
                      </span>
                      <span style={{ marginLeft: '10px' }}>
                        Đã tải: {hotels.length}/{totalResults} khách sạn
                      </span>
                      {hasNextPage && hotels.length > sentinelPosition && (
                        <span style={{ marginLeft: '10px', fontSize: '12px', color: '#28a745' }}>
                          (Sẽ load tiếp khi xem tới hotel thứ {sentinelPosition + 1})
                        </span>
                      )}
                    </div>
                  </div>
                )}
                {viewMode === "pagination" && paginationInfo && (
                  <div className="header-right">
                    <div className="page-info">
                      Trang {paginationInfo.current_page} / {paginationInfo.last_page}
                    </div>
                  </div>
                )}
              </div>

              {/* Error message */}
              {isError && (
                <div style={{
                  background: '#fee',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  border: '1px solid #fcc'
                }}>
                  <strong>❌ Lỗi tải dữ liệu:</strong> {error?.message}
                  <button
                    onClick={() => viewMode === "infinite" ? refetchInfinite() : refetchPagination()}
                    style={{
                      marginLeft: '10px',
                      padding: '5px 10px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {/* Nội dung hotels - INFINITE MODE */}
              {viewMode === "infinite" && (
                <div className="hotel-list-infinite">
                  {/* Danh sách hotels */}
                  {hotels.map((hotel, index) => (
                    <div key={`${hotel.id}-${index}`}>
                      <HotelCard hotel={hotel} index={index} />
                      
                      {/* 🚀🚀 SENTINEL ĐẶT Ở GIỮA DANH SÁCH */}
                      {index === sentinelPosition && hasNextPage && !isFetchingNextPage && !sentinelTriggeredRef.current && (
                        <div
                          ref={loadMoreRef}
                          className="mid-list-sentinel"
                          style={{
                            height: '1px',
                            width: '100%',
                            background: 'transparent',
                            position: 'relative',
                            margin: '10px 0'
                          }}
                        >
                          {/* Visual indicator */}
                          <div style={{
                            position: 'absolute',
                            top: '-20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '15px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            zIndex: 10,
                            opacity: 0.7
                          }}>
                            ⚡ LOAD TRƯỚC (ở giữa)
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* THÊM MỘT SENTINEL DỰ PHÒNG Ở CUỐI */}
                  {hasNextPage && !sentinelTriggeredRef.current && (
                    <div
                      ref={loadMoreRef}
                      className="backup-sentinel"
                      style={{
                        height: '1px',
                        width: '100%',
                        background: 'transparent'
                      }}
                    />
                  )}      
                  {/* End message */}
                  {!hasNextPage && hotels.length > 0 && !infiniteFetching && (
                    <div className="infinite-end-message">
                      <p>🎉 Bạn đã xem hết tất cả {totalResults} khách sạn!</p>
                      <button
                        className="back-to-top"
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      >
                        <FaArrowRight /> Lên đầu trang
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Nội dung hotels - PAGINATION MODE */}
              {viewMode === "pagination" && (
                <div className="hotel-list-pagination">
                  {hotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>
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

              {/* Loading ban đầu */}
              {loading && hotels.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <PartLoading />
                  <p>Đang tải khách sạn...</p>
                </div>
              )}

              {/* Pagination controls */}
              {viewMode === "pagination" && hotels.length > 0 && renderPagination()}
            </div>
          </div>

          <TopHotelSlider />
        </div>
      </section>

      {/* CSS */}
      <style jsx>{`
        .mid-list-sentinel {
          opacity: 0.7;
          transition: opacity 0.3s;
        }
        
        .mid-list-sentinel:hover {
          opacity: 1;
        }
        
        .spinner {
          animation: spin 0.8s linear infinite;
          margin-right: 8px;
          display: inline-block;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
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
        
        .mode-btn.active:hover {
          background: #0056b3;
          border-color: #0056b3;
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
        
        .infinite-loading {
          padding: 20px 0;
          text-align: center;
        }
        
        .infinite-end-message {
          text-align: center;
          padding: 40px 20px;
          color: #666;
          border-top: 1px solid #eee;
          margin-top: 20px;
          background: #f8f9fa;
          border-radius: 8px;
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
          transition: all 0.3s;
        }
        
        .back-to-top:hover {
          background: #0056b3;
          transform: translateY(-2px);
        }
        
        .no-results {
          text-align: center;
          padding: 60px 20px;
          background: #f8f9fa;
          border-radius: 12px;
          margin-top: 20px;
        }
        
        .no-results-icon {
          font-size: 64px;
          margin-bottom: 20px;
          animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .clear-filters-btn {
          margin-top: 20px;
          padding: 12px 24px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .clear-filters-btn:hover {
          background: #c82333;
          transform: translateY(-2px);
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
          
          .no-results {
            padding: 40px 15px;
          }
          
          .mid-list-sentinel > div {
            font-size: 9px;
            padding: 2px 8px;
          }
        }
      `}</style>
    </div>
  );
}

// Helper component để render hotel card
function HotelCard({ hotel, index }) {
  const firstRoom = hotel.firstroom;
  const duration = firstRoom?.available_from && firstRoom?.available_to
    ? `Từ ${firstRoom.available_from} đến ${firstRoom?.available_to}`
    : "Chưa có thông tin";

  return (
    <Hotel
      key={`${hotel.id}-${index || ''}`}
      image={hotel.firstimage?.url || "/default-hotel.jpg"}
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