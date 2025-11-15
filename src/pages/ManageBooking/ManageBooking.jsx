import React, { useEffect, useState, useContext } from "react";
import styles from "./ManageBooking.module.css";
import ManageBookingCard from "../../components/ManageBookingCard/ManageBookingCard.jsx";
import EmptyState from "../../components/EmptyState/EmptyState.jsx";
import { bookingService } from "../../services/bookingService";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BookingCardSkeleton } from "../../components/LoadingSkeleton/LoadingSkeleton.jsx";
import Loader from "../../components/Loading/Loader.jsx";

const { container, banner, tabs, button, active: activeClass, content, error: errorClass } = styles;

const ManageBooking = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("active");
    const [loading, setLoading] = useState(false);
    const [allBookings, setAllBookings] = useState([]);
    const [error, setError] = useState(null);

    // Filter bookings theo tab
    const filteredBookings = allBookings.filter(booking => {
        switch (activeTab) {
            case "active":
                return booking.status === "pending" ;
            case "past":
                return booking.status === "completed" ;
            case "cancelled":
                return booking.status === "cancelled";
            default:
                return true;
        }
    });
    
    const fetchAllBookings = async () => {
        if (!user) {
            setError("Vui lòng đăng nhập để xem booking");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Chỉ gọi API 1 lần để lấy tất cả bookings
            const response = await bookingService.getUserBookings();

            if (response.status==200) {
                setAllBookings(response.data);
            } else {
                setError(response.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Lỗi khi fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };
    // Hàm xử lý xem chi tiết
    const handleViewDetails = (booking) => {
        navigate(`/booking/${booking.id}`);
    };

    // Hàm xử lý đặt lại
    const handleReBook = (booking) => {
        navigate(`/hotel/${booking.room.hotel.id}`)
    };

    useEffect(() => {
        fetchAllBookings();
    }, [user]); // Chỉ gọi lại khi user thay đổi
    if(loading){
        return <Loader></Loader>
    }
    return (
        <div className="page-wrapper" key={filteredBookings.id}>
            <div className={container}>
                <div className={banner}>
                    <img
                    src={filteredBookings?.[0]?.room?.hotel?.images?.[1]?.url}
                    alt="hotel"
                    />
                </div>

                <div className={tabs}>
                    {["active", "past", "cancelled"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${button} ${activeTab === tab ? activeClass : ""}`}
                        >
                            {tab === "active" && "Pending"}
                            {tab === "past" && "Completed"}
                            {tab === "cancelled" && "Cancelled"}
                        </button>
                    ))}
                </div>

                <div className={content}>
                    {error && (
                        <div className={errorClass}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <BookingCardSkeleton />
                    ) : filteredBookings.length === 0 ? (
                        <EmptyState />
                    ) : (
                        filteredBookings.map((b) => (
                            <ManageBookingCard
                                key={b.id}
                                booking={b}
                                onViewDetails={handleViewDetails}
                                onReBook={handleReBook}
                                onCancelSuccess={fetchAllBookings}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageBooking;