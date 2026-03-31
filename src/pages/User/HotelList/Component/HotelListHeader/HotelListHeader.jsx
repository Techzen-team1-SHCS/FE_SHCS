import { FaSync, FaThList } from "react-icons/fa";

function HotelListHeader({
  destination,
  loading,
  hotels,
  totalResults,
  viewMode,
  handleViewModeChange,
  hasNextPage,
  sentinelPosition,
  paginationInfo
}) {
  return (
    <div className="hotel-list-header">
      <div className="header-left">

        {!loading || hotels.length > 0 ? (
          <h4 style={{ fontWeight: 300, fontSize: "18px" }}>
            {destination}: tìm thấy {totalResults} chỗ nghỉ
          </h4>
        ) : (
          <h4 style={{ fontWeight: 300, fontSize: "18px" }}>
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
            <FaSync /> Cuộn vô tận
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

            <span style={{ color: "#dc3545", fontWeight: "bold" }}>
              ⚡ LOAD TRƯỚC
            </span>

            <span style={{ marginLeft: "10px" }}>
              Đã tải: {hotels.length}/{totalResults} khách sạn
            </span>

            {hasNextPage && hotels.length > sentinelPosition && (
              <span
                style={{
                  marginLeft: "10px",
                  fontSize: "12px",
                  color: "#28a745"
                }}
              >
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
  );
}

export default HotelListHeader;