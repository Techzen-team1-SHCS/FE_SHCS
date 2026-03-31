import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { hotelService } from "../../../../services/hotelService";

export const useHotelQueries = ({
  queryKeyBase,
  filtersFromQuery,
  mappedFilters,
  currentPage,
  viewMode
}) => {

  const fetchHotelsInfinite = async ({ pageParam = 1 }) => {
    return hotelService.searchHotels({
      ...filtersFromQuery,
      selectedFilters: mappedFilters,
      page: pageParam,
      per_page: 10
    });
  };

  const infiniteQuery = useInfiniteQuery({
    queryKey: [...queryKeyBase, "infinite"],
    queryFn: fetchHotelsInfinite,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const next = lastPage.pagination.current_page + 1;
      return next <= lastPage.pagination.last_page ? next : undefined;
    },
    initialPageParam: 1,
    enabled: viewMode === "infinite",
    staleTime: 60000
  });

  const fetchHotelsPagination = async () => {
    return hotelService.searchHotels({
      ...filtersFromQuery,
      selectedFilters: mappedFilters,
      page: currentPage,
      per_page: 10
    });
  };

  const paginationQuery = useQuery({
    queryKey: [...queryKeyBase, "pagination", currentPage],
    queryFn: fetchHotelsPagination,
    enabled: viewMode === "pagination",
    staleTime: 60000
  });

  return {
    infiniteQuery,
    paginationQuery
  };
};