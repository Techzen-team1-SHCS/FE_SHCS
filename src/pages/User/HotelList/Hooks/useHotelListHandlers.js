export const useHotelListHandlers = ({
  viewMode,
  setSelectedFilters,
  setCurrentPage,
  setViewMode,
  isInitialMountRef,
  sentinelTriggeredRef,
  lastLoadTimeRef
}) => {

  const handleFilterChange = (newFilters) => {
    setSelectedFilters(newFilters);
    setCurrentPage(1);

    isInitialMountRef.current = true;
    sentinelTriggeredRef.current = false;
    lastLoadTimeRef.current = 0;

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

  return {
    handleFilterChange,
    handlePageChange,
    handleViewModeChange
  };
};