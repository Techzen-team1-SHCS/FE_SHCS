import { useState, useEffect, useCallback } from "react";
import { NOTIFICATION_ITEMS_PER_PAGE } from "../Constants/notifications/notificationConstants";
import { toast } from "react-toastify";
import { notificationService } from "../../../services/notificationService";
import "../../../config/echo";

export function useNotifications(user) {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = NOTIFICATION_ITEMS_PER_PAGE || 10;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      if (activeTab === "Unread") {
        params.unread = 1;
      } else if (activeTab !== "All" && activeTab !== "Read") {
        // Just in case we support filtering by priority matching tab names
        params.priority = activeTab.toLowerCase();
      }

      const res = await notificationService.getNotifications(params);
      
      // Handle the data structure (Laravel pagination response)
      if (res.data) {
        setNotifications(res.data);
        setTotalItems(res.meta?.total || res.data.length);
      } else {
        // Fallback
        setNotifications(res);
        setTotalItems(res.length);
      }
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải thông báo");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, activeTab]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Realtime
  useEffect(() => {
    if (!user?.id || !window.Echo) return;

    const channel = window.Echo.private(`user.${user.id}`);
    
    channel.listen('NotificationSuccess', (data) => {
      // Refresh list to keep pagination correct, or just prepend if on first page
      if (currentPage === 1 && activeTab === 'All') {
        setNotifications(prev => [data, ...prev].slice(0, itemsPerPage));
        setTotalItems(prev => prev + 1);
      } else if (currentPage === 1 && activeTab === 'Unread') {
        setNotifications(prev => [data, ...prev].slice(0, itemsPerPage));
        setTotalItems(prev => prev + 1);
      }
    });

    return () => {
      if (channel) {
        window.Echo.leave(`user.${user.id}`);
      }
    };
  }, [user?.id, currentPage, activeTab, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Fix page when filter reduces total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const markAsRead = async (id) => {
    const item = notifications.find(n => n.id === id);
    if (!item || item.is_read) return;

    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      window.dispatchEvent(new Event('notifications-read'));
    } catch (error) {
      console.error(error);
      toast.error("Không thể đánh dấu đã đọc");
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
      window.dispatchEvent(new Event('notifications-read'));
      toast.success("Đã đánh dấu tất cả là đã đọc");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi đánh dấu tất cả đã đọc");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      fetchNotifications();
      window.dispatchEvent(new Event('notifications-read'));
      toast.success("Đã xóa thông báo");
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa thông báo");
    }
  };

  const clearReadNotifications = async () => {
    try {
      await notificationService.clearReadNotifications();
      fetchNotifications();
      window.dispatchEvent(new Event('notifications-read'));
      toast.success("Đã dọn dẹp các thông báo cũ");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi dọn dẹp thông báo");
    }
  };

  return {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    currentItems: notifications,
    totalPages,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications
  };
}