import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { hotelService } from "../../../services/hotelService";
import { filterRoomsByTab, searchRooms } from "../Helpers/RoomHelpers";
import { getPaginationPages } from "../Helpers/HotelHelpers";

export const useRoomManagement = (itemsPerPage = 10) => {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);

  // Fetch rooms từ API
  const { data: rawRooms, isLoading: loading } = useQuery({
    queryKey: ["hotel-manager-rooms"],
    queryFn: () => hotelService.getHotelManagerRooms(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Đảm bảo allRooms luôn là array dù API trả về paginated object hay plain array
  const allRooms = Array.isArray(rawRooms)
    ? rawRooms
    : Array.isArray(rawRooms?.data)
      ? rawRooms.data
      : [];

  const filteredByTab = useMemo(
    () => filterRoomsByTab(allRooms, activeTab),
    [allRooms, activeTab],
  );
  const searchedRooms = useMemo(
    () => searchRooms(filteredByTab, search) || [],
    [filteredByTab, search],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(searchedRooms.length / itemsPerPage),
  );

  const currentRooms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return searchedRooms.slice(start, start + itemsPerPage);
  }, [searchedRooms, currentPage, itemsPerPage]);

  const pages = getPaginationPages(totalPages);

  const isRoomSelected = (id) => selectedRoomIds.includes(id);

  const toggleSelectedRoom = (id) => {
    setSelectedRoomIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const selectAll = (checked) => {
    if (checked) {
      setSelectedRoomIds(currentRooms.map((room) => room.id));
    } else {
      setSelectedRoomIds([]);
    }
  };

  return {
    rooms: currentRooms,
    loading,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    pages,
    isRoomSelected,
    toggleSelectedRoom,
    selectAll,
    selectedRoomIds,
    roomCount: searchedRooms.length,
  };
};
