import { useState, useEffect } from "react";
import { NOTIFICATION_ITEMS_PER_PAGE } from "../Constants/notifications/notificationConstants";
import { toast } from "react-toastify";
import { notificationService } from "../../../services/notificationService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "../../../config/echo";

export function useNotifications(user) {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = NOTIFICATION_ITEMS_PER_PAGE || 10;
  const queryClient = useQueryClient();

  // ─── 1. Query Data ────────────────────────────────────────────────────────
  const { data = { currentItems: [], totalItems: 0 }, isLoading: loading } = useQuery({
    queryKey: ["notifications", currentPage, activeTab],
    queryFn: async () => {
      const params = { page: currentPage, limit: itemsPerPage };

      if (activeTab === "Unread") {
        params.unread = 1;
      } else if (activeTab !== "All" && activeTab !== "Read") {
        params.priority = activeTab.toLowerCase();
      }

      const res = await notificationService.getNotifications(params);
      
      if (res.data) {
        return { currentItems: res.data, totalItems: res.meta?.total || res.data.length };
      } else {
        return { currentItems: res, totalItems: res.length };
      }
    },
    staleTime: 60 * 1000,
    keepPreviousData: true,
  });

  const { currentItems, totalItems } = data;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Fix page when filter reduces total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // ─── 2. Realtime Echo Updates ──────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id || !window.Echo) return;

    const channel = window.Echo.private(`user.${user.id}`);
    
    channel.listen('NotificationSuccess', () => {
      queryClient.invalidateQueries(["notifications"]);
    });

    return () => {
      if (channel) {
        window.Echo.leave(`user.${user.id}`);
      }
    };
  }, [user?.id, queryClient]);

  // ─── 3. Mutations ─────────────────────────────────────────────────────────
  const markAsReadMut = useMutation({
    mutationFn: (id) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      window.dispatchEvent(new Event('notifications-read'));
    },
    onError: (error) => {
      console.error(error);
      toast.error("Không thể đánh dấu đã đọc");
    }
  });

  const markAllAsReadMut = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      window.dispatchEvent(new Event('notifications-read'));
      toast.success("Đã đánh dấu tất cả là đã đọc");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Lỗi khi đánh dấu tất cả đã đọc");
    }
  });

  const deleteNotificationMut = useMutation({
    mutationFn: (id) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      window.dispatchEvent(new Event('notifications-read'));
      toast.success("Đã xóa thông báo");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Không thể xóa thông báo");
    }
  });

  const clearReadNotificationsMut = useMutation({
    mutationFn: () => notificationService.clearReadNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      window.dispatchEvent(new Event('notifications-read'));
      toast.success("Đã dọn dẹp các thông báo cũ");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Lỗi khi dọn dẹp thông báo");
    }
  });

  return {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    currentItems,
    totalPages,
    loading,
    markAsRead: markAsReadMut.mutateAsync,
    markAllAsRead: markAllAsReadMut.mutateAsync,
    deleteNotification: deleteNotificationMut.mutateAsync,
    clearReadNotifications: clearReadNotificationsMut.mutateAsync
  };
}