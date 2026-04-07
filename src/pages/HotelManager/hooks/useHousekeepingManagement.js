import { useMemo, useState } from "react";
import { housekeepingSchedules } from "../Mock/housekeepingData";
import { filterSchedulesByTab, searchSchedules } from "../Helpers/HousekeepingHelpers";
import { getPaginationPages } from "../Helpers/HotelHelpers";

export const useHousekeepingManagement = (itemsPerPage = 10) => {
  const [schedules, setSchedules] = useState(housekeepingSchedules);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const handleOpenAddModal = () => {
    setModalData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (schedule) => {
    setModalData(schedule);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleSaveSchedule = (scheduleData) => {
    if (modalData) {
      setSchedules((prev) =>
        prev.map((s) => (s.id === scheduleData.id ? scheduleData : s))
      );
    } else {
      const newSchedule = {
        ...scheduleData,
        id: Date.now(),
      };
      setSchedules((prev) => [newSchedule, ...prev]);
    }
  };

  const filteredByTab = useMemo(() => filterSchedulesByTab(schedules, activeTab), [schedules, activeTab]);
  const searchedSchedules = useMemo(() => searchSchedules(filteredByTab, search), [filteredByTab, search]);

  const totalPages = Math.max(1, Math.ceil(searchedSchedules.length / itemsPerPage));

  const currentSchedules = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return searchedSchedules.slice(start, start + itemsPerPage);
  }, [searchedSchedules, currentPage, itemsPerPage]);

  const pages = getPaginationPages(totalPages);

  return {
    schedules: currentSchedules,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    totalPages,
    pages,
    scheduleCount: searchedSchedules.length,
    isModalOpen,
    modalData,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveSchedule,
  };
};
