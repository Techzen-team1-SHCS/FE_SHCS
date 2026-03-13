import { useState } from "react";
import HotelListFilter from "../HotelListFilter/HotelListFilter";

function MobileFilterDrawer({
  tempMobileFilters,
  setTempMobileFilters,
  handleFilterChange
}) {
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const handleClose = () => {
    handleFilterChange(tempMobileFilters);
    setShowMobileFilter(false);
  };

  return (
    <div className="mobile-filter-section">

      <button
        className="mobile-filter-btn"
        onClick={() => setShowMobileFilter(!showMobileFilter)}
      >
        <i className="fal fa-filter" style={{ marginRight: "8px" }}></i>
        Bộ lọc
      </button>

      {showMobileFilter && (
        <>
          <div
            className="filter-backdrop"
            onClick={() => setShowMobileFilter(false)}
          />

          <div className="mobile-filter-drawer">
            <div className="drawer-header">
              <h3>Bộ lọc tìm kiếm</h3>

              <button
                className="close-btn"
                onClick={handleClose}
              >
                ×
              </button>
            </div>

            <div className="drawer-content">
              <HotelListFilter
                selected={tempMobileFilters}
                onFilterChange={setTempMobileFilters}
              />
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default MobileFilterDrawer;