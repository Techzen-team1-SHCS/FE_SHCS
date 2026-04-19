import { useState, useEffect, useCallback } from "react";
import { notificationService } from "../../../../services/notificationService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [pendingHotels, setPendingHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [rejectReason, setRejectReason] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const [notificationsData, hotelsData] = await Promise.all([
        notificationService.getAllNotifications(),
        notificationService.getPendingHotels()
      ]);

      setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
      setPendingHotels(hotelsData || []);
    } catch (error) {
      console.error("Fetch data error:", error);
      setNotifications([]);
      setPendingHotels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  const approveHotel = async (hotelId) => {
    try {
      setApproving(hotelId);
      await notificationService.approveHotel(hotelId);
      setPendingHotels(prev => prev.filter(h => h.id !== hotelId));

      const notificationsData = await notificationService.getNotifications();
      setNotifications(notificationsData || []);
    } catch (error) {
      console.error("Approve hotel error:", error);
      alert("Lỗi duyệt khách sạn: " + (error.response?.data?.message || error.message));
    } finally {
      setApproving(null);
    }
  };

  const rejectHotel = async (hotelId) => {
    try {
      setApproving(hotelId);
      const reason = rejectReason[hotelId] || "Admin không chấp nhận";
      await notificationService.rejectHotel(hotelId, reason);
      setPendingHotels(prev => prev.filter(h => h.id !== hotelId));
      setShowRejectModal(null);

      const notificationsData = await notificationService.getNotifications();
      setNotifications(notificationsData || []);
    } catch (error) {
      console.error("Reject hotel error:", error);
      alert("Lỗi từ chối khách sạn: " + (error.response?.data?.message || error.message));
    } finally {
      setApproving(null);
    }
  };

  return {
    notifications,
    pendingHotels,
    loading,
    approving,
    rejectReason,
    setRejectReason,
    showRejectModal,
    setShowRejectModal,
    fetchAllData,
    markAsRead,
    markAllAsRead,
    approveHotel,
    rejectHotel
  };
};
