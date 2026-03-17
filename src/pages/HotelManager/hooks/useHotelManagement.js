import { useState } from "react";

export function useHotelManagement(hotels, itemsPerPage) {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredHotels =
    activeTab === "All"
      ? hotels
      : hotels.filter((hotel) => hotel.status === activeTab);

  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentHotels = filteredHotels.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    currentHotels,
    totalPages
  };
}