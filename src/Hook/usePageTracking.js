import { useEffect } from "react";
import { useBehavior } from "../contexts/BehaviorContext";
import { useLocation } from "react-router-dom";

export const usePageTracking = (pageName) => {
  const { logBehavior } = useBehavior();
  const location = useLocation();

  // Track page view khi mount
  useEffect(() => {
    logBehavior("page_view", { page: pageName });
  }, [pageName]);

  // Track query change (filter / pagination)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = Number(searchParams.get("page")) || 1;
    const filters = searchParams.get("filters")
      ? JSON.parse(searchParams.get("filters"))
      : [];

    if (filters.length > 0) {
      logBehavior("filter_change", { page: pageName, filters });
    }

  
  }, [location.search, pageName]);
};
