import { useContext } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../../../../components/SearchBar/SearchBar";
import ErrorMessage from "../Component/ErrorMessage/ErrorMessage";
import HotelListFilter from "../Component/HotelListFilter/HotelListFilter";
import "../HotelList.css";
import TopHotelSlider from "../../../../components/TopHotelSlider/TopHotelSlider";
import PartLoading from "../../../../components/Loading/PartLoading";
import InfiniteHotelList from "../Component/InfiniteHotelList/InfiniteHotelList";
import PaginationHotelList from "../Component/PaginationHotelList/PaginationHotelList";
import NoResults from "../Component/NoResults/NoResults";
import { useApproveUser } from "../Hooks/useApproveUser";
import { AuthContext } from "../../../../contexts/AuthContext";
import { AMENITIES_MAP } from "../Constants/hotelListConstants";
import { mapSelectedFilters, getFiltersFromQuery, getSentinelPosition } from "../Helpers/hotelListHelpers";
import { useHotelListState } from "../Hooks/useHotelListState";
import { useHotelQueries } from "../Hooks/useHotelQueries";
import { useInfiniteScroll } from "../Hooks/useInfiniteScroll";
import { resolveHotelData } from "../Helpers/resolveHotelData";
import HotelPagination from "../Component/HotelPagination/HotelPagination";
import { useHotelListHandlers } from "../Hooks/useHotelListHandlers";
import HotelListHeader from "../Component/HotelListHeader/HotelListHeader";
import MobileFilterDrawer from "../Component/MobileFilterDrawer/MobileFilterDrawer";
import DestinationMap from "../Component/DestinationMap/DestinationMap";
function HotelList() {
  const location = useLocation();
  const {
    selectedFilters,
    setSelectedFilters,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    tempMobileFilters,
    setTempMobileFilters,
    loadMoreRef,
    observerRef,
    lastLoadTimeRef,
    isInitialMountRef,
    sentinelTriggeredRef
  } = useHotelListState();
  const { user } = useContext(AuthContext);
  // Approve user
  useApproveUser(user);
  // Map tiện nghi
  const amenitiesMap = AMENITIES_MAP;

  // Lấy filter từ URL
  const filtersFromQuery = getFiltersFromQuery(location.search);
  const mappedFilters = mapSelectedFilters(selectedFilters, amenitiesMap);
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
  const { infiniteQuery, paginationQuery } = useHotelQueries({
    queryKeyBase,
    filtersFromQuery,
    mappedFilters,
    currentPage,
    viewMode
  });
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchInfinite,
  } = infiniteQuery;
  const {
    refetch: refetchPagination,
    isFetching: paginationFetching,
  } = paginationQuery;
  const {
    hotels,
    totalResults,
    paginationInfo,
    loading,
    isError,
    error
  } = resolveHotelData({
    viewMode,
    infiniteQuery,
    paginationQuery
  });
  const sentinelPosition = getSentinelPosition(hotels);
  useInfiniteScroll({
    viewMode,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    observerRef,
    sentinelTriggeredRef,
    lastLoadTimeRef,
    loadMoreRef
  });


  // Tính vị trí đặt sentinel (ở giữa danh sách)
  const destination = filtersFromQuery.destination || "Tổng khách sạn";

  // =========== HANDLERS ===========
  const {
    handleFilterChange,
    handlePageChange,
    handleViewModeChange
  } = useHotelListHandlers({
    viewMode,
    setSelectedFilters,
    setCurrentPage,
    setViewMode,
    isInitialMountRef,
    sentinelTriggeredRef,
    lastLoadTimeRef
  });


  // =========== RENDER ===========
  return (
    <div className="page-wrapper">
      <section
        className="page-banner-area pt-50 pb-35 rel bgs-cover"
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
            <div className="col-lg-3 col-md-6 col-sm-10 rmb-75 desktop-sidebar">
              <div className="sticky-sidebar">
                <DestinationMap destination={destination} />

                <HotelListFilter selected={selectedFilters} onFilterChange={handleFilterChange} />
              </div>
            </div>

            {/* Mobile Filter Button */}
            <MobileFilterDrawer
              tempMobileFilters={tempMobileFilters}
              setTempMobileFilters={setTempMobileFilters}
              handleFilterChange={handleFilterChange}
            />

            <div className="col-lg-9">
              {/* Header với view mode toggle */}
              <HotelListHeader
                destination={destination}
                loading={loading}
                hotels={hotels}
                totalResults={totalResults}
                viewMode={viewMode}
                handleViewModeChange={handleViewModeChange}
                hasNextPage={hasNextPage}
                sentinelPosition={sentinelPosition}
                paginationInfo={paginationInfo}
              />

              {/* Error message */}
              {isError && (
                <ErrorMessage
                  error={error}
                  onRetry={() =>
                    viewMode === "infinite"
                      ? refetchInfinite()
                      : refetchPagination()
                  }
                />
              )}

              {/* Nội dung hotels - INFINITE MODE */}
              {viewMode === "infinite" && (
                <InfiniteHotelList
                  hotels={hotels}
                  sentinelPosition={sentinelPosition}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  sentinelTriggeredRef={sentinelTriggeredRef}
                  loadMoreRef={loadMoreRef}
                  totalResults={totalResults}
                />
              )}

              {/* Nội dung hotels - PAGINATION MODE */}
              {viewMode === "pagination" && (
                <PaginationHotelList hotels={hotels} />
              )}

              {/* Hiển thị khi không có kết quả */}
              {!loading && hotels.length === 0 && (
                <NoResults
                  onClear={() => {
                    setSelectedFilters([]);
                    setCurrentPage(1);
                  }}
                />
              )}

              {/* Loading ban đầu */}
              {loading && hotels.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <PartLoading />
                  <p>Đang tải khách sạn...</p>
                </div>
              )}

              {/* Pagination controls */}
              {viewMode === "pagination" && hotels.length > 0 && (
                <HotelPagination
                  paginationInfo={paginationInfo}
                  totalResults={totalResults}
                  paginationFetching={paginationFetching}
                  handlePageChange={handlePageChange}
                />
              )}
            </div>
          </div>

          <TopHotelSlider />
        </div>
      </section>

      {/* CSS */}
      <style  >{`
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
        
        /* Mobile Filter Styles */
        .desktop-sidebar {
          display: block;
        }
        
        .mobile-filter-section {
          display: none;
          position: relative;
          margin-bottom: 20px;
        }
        
        .mobile-filter-btn {
          width: 100%;
          padding: 14px 16px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .mobile-filter-btn:active {
          transform: scale(0.98);
        }
        
        .filter-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }
        
        .mobile-filter-drawer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-radius: 20px 20px 0 0;
          max-height: 90vh;
          overflow-y: auto;
          z-index: 10000;
          animation: slideUp 0.3s ease;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .drawer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 16px;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          background: white;
          border-radius: 20px 20px 0 0;
          z-index: 10;
        }
        
        .drawer-header h3 {
          margin: 0;
          font-size: 18px;
          color: #2d3748;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 32px;
          color: #718096;
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s;
        }
        
        .close-btn:active {
          color: #2d3748;
        }
        
        .drawer-content {
          padding: 16px;
        }
        
        /* Responsive */
        @media (max-width: 991px) {
          .desktop-sidebar {
            display: none;
          }
          
          .mobile-filter-section {
            display: block;
          }
        }
        
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
          
          .mobile-filter-drawer {
            max-height: 80vh;
          }
        }
      `}</style>
    </div>
  );
}

export default HotelList;