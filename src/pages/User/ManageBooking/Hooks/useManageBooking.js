import { useState, useEffect } from "react";
import { bookingService } from "../../../../services/bookingService";
import { filterBookingsByTab, calculateBookingStats } from "../Helpers/bookingHelpers";

export const useManageBooking = (user) => {

    const [activeTab, setActiveTab] = useState("active");
    const [loading, setLoading] = useState(false);
    const [allBookings, setAllBookings] = useState([]);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        active: 0,
        past: 0,
        cancelled: 0
    });

    const filteredBookings = filterBookingsByTab(allBookings, activeTab);

    const fetchAllBookings = async () => {

        if (!user) {
            setError("Vui lòng đăng nhập để xem booking");
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const response = await bookingService.getUserBookings();

            if (response.status === 200) {
                setAllBookings(response.data);
            } else {
                setError(response.message || "Có lỗi xảy ra");
            }

        } catch (error) {

            console.error("Lỗi khi fetch bookings:", error);
            setError("Không thể tải danh sách booking. Vui lòng thử lại.");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, [user]);

    useEffect(() => {
        setStats(calculateBookingStats(allBookings));
    }, [allBookings]);

    return {
        activeTab,
        setActiveTab,
        loading,
        allBookings,
        error,
        stats,
        fetchAllBookings,
        filteredBookings
    };
};