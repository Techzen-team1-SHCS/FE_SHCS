import { useEffect, useState, useMemo } from "react";
import { hotels } from "../Mock/hotelData";

export const useHotelManagement = (itemsPerPage = 5) => {
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // fetch API
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      // Sử dụng dữ liệu giả từ file mock thay vì gọi API
      setAllHotels(hotels || []);
      setLoading(false);
    };
    fetchHotels();
  }, []);

  // filter theo tab + search
  const filteredHotels = useMemo(() => {
    let result = [...allHotels];

    // filter theo tab
    if (activeTab !== "All") {
      result = result.filter((h) => {
        const status = h.status || "";
        if (activeTab === "Open") return status === "Open";
        if (activeTab === "Close") return status === "Close";
        if (activeTab === "Pending") return status === "Pending";
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