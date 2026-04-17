export const mapSelectedFilters = (selectedFilters, amenitiesMap) => {
  return selectedFilters.map((f) => amenitiesMap[f] || f);
};

export const getFiltersFromQuery = (locationSearch) => {
  const searchParams = new URLSearchParams(locationSearch);

  return {
    destination: searchParams.get("destination") || "",
    roomType: searchParams.get("roomType") || "",
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: searchParams.get("guests") || "",
    searchTerm: searchParams.get("searchTerm") || "",
    sort: searchParams.get("sort") || "price_asc",
  };
};

export const getSentinelPosition = (hotels) => {
  if (hotels.length <= 5) return Math.floor(hotels.length / 2);
  return 5;
};