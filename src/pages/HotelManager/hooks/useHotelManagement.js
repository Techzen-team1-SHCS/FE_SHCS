import {  useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { hotelService } from "../../../services/hotelService";

export const useHotelManagement = (itemsPerPage = 5) => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch hotels từ API
  const { data: allHotels = [], isLoading: loading } = useQuery({
    queryKey: ['hotel-manager-list'],
    queryFn: () => hotelService.getHotelManagerHotels(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // filter theo tab + search
  const filteredHotels = useMemo(() => {
    let result = [...allHotels];

    // filter theo tab
    if (activeTab !== "All") {
      result = result.filter((h) => {
        const status = h.status || "";
        if (activeTab === "Open") return status === "approved";
        if (activeTab === "Close") return status === "rejected";
        if (activeTab === "Pending") return status === "pending";
        return true;
      });
    }

    // search
    if (search) {
      result = result.filter((h) =>
        h.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result;
  }, [allHotels, activeTab, search]);

  // pagination
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  const currentHotels = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredHotels.slice(start, start + itemsPerPage);
  }, [filteredHotels, currentPage, itemsPerPage]);

  return {
    loading,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    currentHotels,
    totalPages,
  };
};