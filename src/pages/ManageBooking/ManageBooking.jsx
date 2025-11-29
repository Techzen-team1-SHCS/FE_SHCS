import React, { useEffect, useState, useContext } from "react";
import styles from "./ManageBooking.module.css";
import ManageBookingCard from "../../components/ManageBookingCard/ManageBookingCard.jsx";
import EmptyState from "../../components/EmptyState/EmptyState.jsx";
import { bookingService } from "../../services/bookingService";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BookingCardSkeleton } from "../../components/LoadingSkeleton/LoadingSkeleton.jsx";
import Loader from "../../components/Loading/Loader.jsx";

const ManageBooking = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("active");
    const [loading, setLoading] = useState(false);
    const [allBookings, setAllBookings] = useState([]);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        active: 0,
        past: 0,
        cancelled: 0
    });

    // Filter bookings theo tab
    const filteredBookings = allBookings.filter(booking => {
        switch (activeTab) {
            case "active":
                return booking.status === "pending";
            case "past":
                return booking.status === "completed";
            case "cancelled":
                return booking.status === "cancelled";
            default:
                return true;
        }
    });

    // Tính toán stats
    useEffect(() => {
        const activeCount = allBookings.filter(b => b.status === "pending").length;
        const pastCount = allBookings.filter(b => b.status === "completed").length;
        const cancelledCount = allBookings.filter(b => b.status === "cancelled").length;
        
        setStats({
            active: activeCount,
            past: pastCount,
            cancelled: cancelledCount
        });
    }, [allBookings]);
    
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

    const handleViewDetails = (booking) => {
        navigate(`/booking/${booking.id}`);
    };

    const handleReBook = (booking) => {
        navigate(`/hotel/${booking.room.hotel.id}`);
    };

    const getTabLabel = (tab) => {
        switch (tab) {
            case "active": return "Đang chờ";
            case "past": return "Hoàn thành";
            case "cancelled": return "Đã hủy";
            default: return tab;
        }
    };

    const getTabIcon = (tab) => {
        switch (tab) {
            case "active": return "⏳";
            case "past": return "✅";
            case "cancelled": return "❌";
            default: return "📋";
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case "pending":
                return {
                    label: "Đang chờ xác nhận",
                    icon: "⏳",
                    color: "#FFA500",
                    bgColor: "#FFF9E6",
                    borderColor: "#FFD700",
                    badgeStyle: styles.pendingBadge
                };
            case "completed":
                return {
                    label: "Đã hoàn thành",
                    icon: "✅",
                    color: "#10B981",
                    bgColor: "#ECFDF5",
                    borderColor: "#34D399",
                    badgeStyle: styles.completedBadge
                };
            case "cancelled":
                return {
                    label: "Đã hủy",
                    icon: "❌",
                    color: "#EF4444",
                    bgColor: "#FEF2F2",
                    borderColor: "#FCA5A5",
                    badgeStyle: styles.cancelledBadge
                };
            default:
                return {
                    label: "Không xác định",
                    icon: "❓",
                    color: "#6B7280",
                    bgColor: "#F3F4F6",
                    borderColor: "#D1D5DB",
                    badgeStyle: styles.unknownBadge
                };
        }
    };

    useEffect(() => {
        fetchAllBookings();
    }, [user]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className={styles.pageWrapper}>
            {/* Header Section */}
            <div className={styles.heroBanner}>
                <img 
                    src="assets/images/destinations/destination-details4.jpg" 
                    alt="Booking Header" 
                    className={styles.heroImage}
                />
                <div className={styles.heroOverlay}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>Quản lý Đặt phòng</h1>
                        <p className={styles.heroSubtitle}>
                            Theo dõi và quản lý tất cả các đặt phòng của bạn tại một nơi
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Stats Cards */}
                <div className={styles.statsGrid}>
                    <div 
                        className={`${styles.statCard} ${activeTab === "active" ? styles.activeStatCard : ''}`}
                        onClick={() => setActiveTab("active")}
                    >
                        <div className={styles.statCardContent}>
                            <div className={styles.statCardIcon} style={{background: '#FFF9E6', color: '#FFA500'}}>⏳</div>
                            <div className={styles.statCardInfo}>
                                <div className={styles.statCardNumber}>{stats.active}</div>
                                <div className={styles.statCardLabel}>Đang chờ</div>
                            </div>
                            {stats.active > 0 && (
                                <div className={styles.pulseIndicator}></div>
                            )}
                        </div>
                    </div>

                    <div 
                        className={`${styles.statCard} ${activeTab === "past" ? styles.activeStatCard : ''}`}
                        onClick={() => setActiveTab("past")}
                    >
                        <div className={styles.statCardContent}>
                            <div className={styles.statCardIcon} style={{background: '#ECFDF5', color: '#10B981'}}>✅</div>
                            <div className={styles.statCardInfo}>
                                <div className={styles.statCardNumber}>{stats.past}</div>
                                <div className={styles.statCardLabel}>Hoàn thành</div>
                            </div>
                        </div>
                    </div>

                    <div 
                        className={`${styles.statCard} ${activeTab === "cancelled" ? styles.activeStatCard : ''}`}
                        onClick={() => setActiveTab("cancelled")}
                    >
                        <div className={styles.statCardContent}>
                            <div className={styles.statCardIcon} style={{background: '#FEF2F2', color: '#EF4444'}}>❌</div>
                            <div className={styles.statCardInfo}>
                                <div className={styles.statCardNumber}>{stats.cancelled}</div>
                                <div className={styles.statCardLabel}>Đã hủy</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className={styles.tabsContainer}>
                    <div className={styles.tabsNav}>
                        {["active", "past", "cancelled"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`}
                            >
                                <span className={styles.tabIcon}>{getTabIcon(tab)}</span>
                                <span className={styles.tabText}>{getTabLabel(tab)}</span>
                                <span className={styles.tabCount}>
                                    {tab === "active" && stats.active}
                                    {tab === "past" && stats.past}
                                    {tab === "cancelled" && stats.cancelled}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status Header */}
                <div className={styles.statusHeader}>
                    <div className={styles.statusInfo}>
                        {(() => {
                            const config = getStatusConfig(activeTab === "active" ? "pending" : 
                                                         activeTab === "past" ? "completed" : "cancelled");
                            return (
                                <>
                                    <div 
                                        className={styles.statusIndicator}
                                        style={{
                                            backgroundColor: config.bgColor,
                                            borderColor: config.borderColor,
                                            color: config.color
                                        }}
                                    >
                                        <span className={styles.statusIcon}>{config.icon}</span>
                                        <span className={styles.statusLabel}>{config.label}</span>
                                    </div>
                                    <div className={styles.statusDescription}>
                                        {activeTab === "active" && "Các đặt phòng đang chờ xác nhận từ khách sạn"}
                                        {activeTab === "past" && "Các đặt phòng đã được hoàn thành"}
                                        {activeTab === "cancelled" && "Các đặt phòng đã bị hủy"}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>

                {/* Content Area */}
                <div className={styles.contentArea}>
                    {error && (
                        <div className={styles.errorContainer}>
                            <div className={styles.errorIcon}>⚠️</div>
                            <div className={styles.errorText}>{error}</div>
                            <button 
                                className={styles.retryButton}
                                onClick={fetchAllBookings}
                            >
                                Thử lại
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className={styles.skeletonContainer}>
                            {[1, 2, 3].map((item) => (
                                <BookingCardSkeleton key={item} />
                            ))}
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className={styles.emptyStateContainer}>
                            <EmptyState />
                            <div className={styles.emptyStateAction}>
                                <button 
                                    className={styles.exploreButton}
                                    onClick={() => navigate('/HotelList')}
                                >
                                    Khám phá khách sạn
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.bookingsGrid}>
                            {filteredBookings.map((booking) => {
                                const statusConfig = getStatusConfig(booking.status);
                                return (
                                    <div 
                                        key={booking.id} 
                                        className={styles.bookingCardWrapper}
                                        style={{
                                            borderLeft: `4px solid ${statusConfig.borderColor}`,
                                            backgroundColor: statusConfig.bgColor
                                        }}
                                    >
                                        <div className={styles.bookingStatusHeader}>
                                            <div className={`${styles.statusBadge} ${statusConfig.badgeStyle}`}>
                                                <span className={styles.badgeIcon}>{statusConfig.icon}</span>
                                                <span className={styles.badgeText}>{statusConfig.label}</span>
                                            </div>
                                            <div className={styles.bookingDate}>
                                                {new Date(new Date(booking.check_out).setDate(
                                                    new Date(booking.check_out).getDate() + 1
                                                )).toLocaleDateString('vi-VN')}
                                            </div>
                                        </div>
                                        <ManageBookingCard
                                            booking={booking}
                                            onViewDetails={handleViewDetails}
                                            onReBook={handleReBook}
                                            onCancelSuccess={fetchAllBookings}
                                            statusConfig={statusConfig}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                {filteredBookings.length > 0 && (
                    <div className={styles.quickActions}>
                        <h3 className={styles.quickActionsTitle}>Thao tác nhanh</h3>
                        <div className={styles.quickActionsGrid}>
                            <button 
                                className={styles.quickAction}
                                onClick={() => navigate('/hotels')}
                            >
                                <span className={styles.quickActionIcon}>🏨</span>
                                <span className={styles.quickActionText}>Đặt thêm phòng</span>
                            </button>
                            <button 
                                className={styles.quickAction}
                                onClick={() => window.print()}
                            >
                                <span className={styles.quickActionIcon}>🖨️</span>
                                <span className={styles.quickActionText}>In danh sách</span>
                            </button>
                            <button 
                                className={styles.quickAction}
                                onClick={() => navigate('/profile')}
                            >
                                <span className={styles.quickActionIcon}>👤</span>
                                <span className={styles.quickActionText}>Hồ sơ của tôi</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBooking;