import { useState, useRef } from "react";

export const useHotelListState = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [viewMode, setViewMode] = useState("infinite");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [tempMobileFilters, setTempMobileFilters] = useState([]);

  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);
  const lastLoadTimeRef = useRef(0);
  const isInitialMountRef = useRef(true);
  const sentinelTriggeredRef = useRef(false);

  return {
    selectedFilters,
    setSelectedFilters,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    showMobileFilter,
    setShowMobileFilter,
    tempMobileFilters,
    setTempMobileFilters,
    loadMoreRef,
    observerRef,
    lastLoadTimeRef,
    isInitialMountRef,
    sentinelTriggeredRef
  };
};