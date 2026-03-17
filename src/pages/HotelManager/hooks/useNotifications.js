import { useState, useEffect } from "react";
import { NOTIFICATION_ITEMS_PER_PAGE } from "../Constants/notifications/notificationConstants";

export function useNotifications(initialData) {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState(initialData);

  const itemsPerPage = NOTIFICATION_ITEMS_PER_PAGE;

  // ===== FILTER =====
  const filtered =
    activeTab === "All"
      ? notifications
      : activeTab === "Read"
      ? notifications.filter((n) => !n.unread)
      : notifications.filter((n) => n.unread);

  // ===== PAGINATION =====
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentItems = filtered.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // fix page khi filter làm giảm page
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filtered.length]);

  // ===== MARK AS READ =====
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
  };

  return {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
    markAsRead
  };
}