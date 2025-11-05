import React, { useEffect, useState, useContext } from "react";
import styles from "./ManageBooking.module.css";
import ManageBookingCard from "../../components/ManageBookingCard/ManageBookingCard.jsx";
import EmptyState from "../../components/EmptyState/EmptyState.jsx";
import { bookingService } from "../../services/bookingService";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BookingCardSkeleton } from "../../components/LoadingSkeleton/LoadingSkeleton.jsx";

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
                return booking.status === "Paid" ;
            case "past":
                return booking.status === "Past";
            case "cancelled":
                return booking.status === "Cancelled";
            default:
                return true;
        }
    });
    
    const fetchAllBookings = async () => {
        // if (!user) {
        //     setError("Vui lòng đăng nhập để xem booking");
        //     return;
        // }

        setLoading(true);
        setError(null);

        try {
            // Chỉ gọi API 1 lần để lấy tất cả bookings
            const response = await bookingService.getMyBookings();

            if (response.success) {
                setAllBookings(response.data);
            } else {
                setError(response.message || "Có lỗi xảy ra");
                // Fallback dùng mock data
                setAllBookings(getMockBookings().all);
            }
        } catch (error) {
            console.error("Lỗi khi fetch bookings:", error);
            //setError("Không thể tải danh sách booking");
            // Fallback dùng mock data
            setAllBookings(getMockBookings().all);
        } finally {
            setLoading(false);
        }
    };

    // Mock data fallback - cấu trúc lại để có tất cả bookings
    const getMockBookings = () => {
        const allBookings = [
            {
                id: 280,
                city: "Đà Nẵng",
                name: "Sea Hotel",
                checkIn: "03 tháng 5, 2025",
                checkOut: "03 tháng 5, 2025",
                price: "650000",
                status: "Paid",
                image: "/assets/images/banner/banner3.png",
                province: "hotel-123adsgwqdjhgksajg"
            },
            {
                id: 284,
                city: "Đà Nẵng",
                name: "Sea Hotel Premium",
                checkIn: "03 tháng 5, 2025",
                checkOut: "03 tháng 5, 2025", price: "850000",
                status: "Past",
                image: "/assets/images/banner/banner.jpg",
                province: "hotel-124"
            },
            {
                id: 282,
                city: "Đà Nẵng",
                name: "Sea Hotel Deluxe",
                checkIn: "03 tháng 5, 2025",
                checkOut: "03 tháng 5, 2025", price: "750000",
                status: "Cancelled",
                image: "/assets/images/banner/banner.jpg",
                province: "hotel-125"
            },
            {
                id: 2,
                city: "Đà Nẵng",
                name: "Sea Hotel Old",
                checkIn: "03 tháng 5, 2025",
                checkOut: "03 tháng 5, 2025", price: "550000",
                status: "Cancelled",
                image: "/assets/images/banner/banner.jpg",
                province: "hotel-123"
            },
            {
                id: 1,
                city: "Huế",
                name: "Yên Homestay",
                checkIn: "03 tháng 5, 2025",
                checkOut: "03 tháng 5, 2025", price: "39600000",
                status: "Paid",
                image: "/assets/images/banner/banner-2.png",
                province: "hotel-456"
            }
        ];

        return { all: allBookings };
    };
    // Hàm xử lý xem chi tiết
    const handleViewDetails = (booking) => {
        console.log("Xem chi tiết booking:", booking);
        navigate(`/booking/${booking.id}`);
    };

    // Hàm xử lý đặt lại
    const handleReBook = (booking) => {
        console.log("Đặt lại:", booking);
        alert(`Đặt lại: ${booking.name}`);
    };

    useEffect(() => {
        fetchAllBookings();
    }, [user]); // Chỉ gọi lại khi user thay đổi

    return (
        <div className="page-wrapper">
            <div className={container}>
                <div className={banner}>
                    <img src="/assets/images/banner/banner-2.png" alt="Banner" />
                </div>

                <div className={tabs}>
                    {["active", "past", "cancelled"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${button} ${activeTab === tab ? activeClass : ""}`}
                        >
                            {tab === "active" && "Paid"}
                            {tab === "past" && "Past"}
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
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageBooking;