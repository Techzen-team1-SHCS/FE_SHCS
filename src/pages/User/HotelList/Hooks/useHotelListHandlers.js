export const useHotelListHandlers = ({
  viewMode,
  refetchInfinite,
  refetchPagination,
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

  return {
    handleFilterChange,
    handlePageChange,
    handleViewModeChange
  };
};