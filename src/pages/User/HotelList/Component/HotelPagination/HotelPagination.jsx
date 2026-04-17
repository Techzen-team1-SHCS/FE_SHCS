import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function HotelPagination({
  paginationInfo,
  totalResults,
  paginationFetching,
  handlePageChange
}) {
  if (!paginationInfo) return null;

  const { current_page, last_page } = paginationInfo;

  const pages = [];

  let startPage = Math.max(1, current_page - 2);
  let endPage = Math.min(last_page, current_page + 2);

  if (current_page <= 3) endPage = Math.min(5, last_page);
  if (current_page >= last_page - 2) startPage = Math.max(last_page - 4, 1);

  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="pagination-container">
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
    </div>
  );
}

export default HotelPagination;