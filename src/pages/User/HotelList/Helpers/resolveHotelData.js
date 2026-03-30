export function resolveHotelData({
  viewMode,
  infiniteQuery,
  paginationQuery
}) {
  if (viewMode === "infinite") {
    console.log(infiniteQuery.data?.pages);
    return {
      hotels: infiniteQuery.data?.pages?.flatMap(
        p => p.hotels || p.data || []
      ) || [],
      totalResults: infiniteQuery.data?.pages?.[0]?.total || 0,
      paginationInfo: infiniteQuery.data?.pages?.[0]?.pagination,
      loading: infiniteQuery.isLoading,
      isError: infiniteQuery.isError,
      error: infiniteQuery.error
    };
  }

  return {
    hotels: paginationQuery.data?.hotels || [],
    totalResults: paginationQuery.data?.total || 0,
    paginationInfo: paginationQuery.data?.pagination,
    loading: paginationQuery.isLoading,
    isError: paginationQuery.isError,
    error: paginationQuery.error
  };
}