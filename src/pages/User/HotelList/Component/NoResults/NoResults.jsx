function NoResults({ onClear }) {

  return (
    <div className="no-results">

      <div className="no-results-icon">🏨</div>

      <h3>Không tìm thấy khách sạn phù hợp</h3>

      <p>Hãy thử thay đổi bộ lọc hoặc tìm kiếm với điều kiện khác</p>

      <button className="clear-filters-btn" onClick={onClear}>
        Xóa bộ lọc
      </button>

    </div>
  );
}

export default NoResults;