import { useMemo, useState } from "react";
import { hotelRooms } from "../Mock/roomData";
import { filterRoomsByTab, searchRooms } from "../Helpers/RoomHelpers";
import { getPaginationPages } from "../Helpers/HotelHelpers";

export const useRoomManagement = (itemsPerPage = 10) => {
  const [rooms] = useState(() => {
    const saved = localStorage.getItem("hotelRooms");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : hotelRooms;
      } catch {
        return hotelRooms;
      }
    }
    return hotelRooms;
  });
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);

  const filteredByTab = useMemo(
    () => filterRoomsByTab(rooms, activeTab),
    [rooms, activeTab],
  );
  const searchedRooms = useMemo(
    () => searchRooms(filteredByTab, search),
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
