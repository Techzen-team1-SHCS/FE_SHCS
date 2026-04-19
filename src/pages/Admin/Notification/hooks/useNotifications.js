import { useEffect, useState } from "react";
import { notificationService } from "../../../../services/notificationService";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [pendingHotels, setPendingHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [notificationsData, hotelsData] = await Promise.all([
        notificationService.getAllNotifications(),
        notificationService.getPendingHotels(),
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
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  const approveHotel = async (hotelId) => {
    try {
      setApproving(hotelId);
      await notificationService.approveHotel(hotelId);

      setPendingHotels((prev) =>
        prev.filter((h) => h.id !== hotelId)
      );

      const notificationsData = await notificationService.getNotifications();
      setNotifications(notificationsData || []);
    } catch (error) {
      console.error("Approve hotel error:", error);
    } finally {
      setApproving(null);
    }
  };

  const rejectHotel = async (hotelId, reason) => {
    try {
      setApproving(hotelId);

      await notificationService.rejectHotel(hotelId, reason);

      setPendingHotels((prev) =>
        prev.filter((h) => h.id !== hotelId)
      );

      const notificationsData = await notificationService.getNotifications();
      setNotifications(notificationsData || []);
    } catch (error) {
      console.error("Reject hotel error:", error);
    } finally {
      setApproving(null);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    notifications,
    pendingHotels,
    loading,
    approving,
    fetchAllData,
    markAsRead,
    markAllAsRead,
    approveHotel,
    rejectHotel,
  };
};