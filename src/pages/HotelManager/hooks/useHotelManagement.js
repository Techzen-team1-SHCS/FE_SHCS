import { useEffect, useState, useMemo } from "react";
import { hotelService } from "../../../services/hotelService";

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
      const data = await hotelService.getHotelManagerHotels();
      setAllHotels(data || []);
      setLoading(false);
    };
    fetchHotels();
  }, []);

  // filter theo tab + search
  const filteredHotels = useMemo(() => {
    let result = [...allHotels];

    // filter theo tab
    if (activeTab !== "All") {
      const active = activeTab.toLowerCase();
      result = result.filter((h) => {
        const status = (h.status || "").toLowerCase();
        if (active === "pending") return status === "pending";
        if (active === "open") return status === "open";
        if (active === "close") return status === "close";
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