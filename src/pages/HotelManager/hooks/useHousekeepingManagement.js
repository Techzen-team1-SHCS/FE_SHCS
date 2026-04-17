import { useMemo, useState } from "react";
import { housekeepingSchedules } from "../Mock/housekeepingData";
import { filterSchedulesByTab, searchSchedules } from "../Helpers/HousekeepingHelpers";
import { getPaginationPages } from "../Helpers/HotelHelpers";

export const useHousekeepingManagement = (itemsPerPage = 10) => {
  const [schedules] = useState(housekeepingSchedules);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
  };
};
