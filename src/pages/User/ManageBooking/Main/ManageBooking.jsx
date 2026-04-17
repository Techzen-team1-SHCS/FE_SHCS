import {useContext } from "react";
import styles from "../ManageBooking.module.css";
import { AuthContext } from "../../../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Loader from "../../../../components/Loading/Loader.jsx";
import QuickActions from "../Component/QuickActions/QuickActions.jsx";
import { getStatusConfig } from "../Helpers/bookingHelpers.js";
import BookingStats from "../Component/BookingStats/BookingStats.jsx";
import BookingTabs from "../Component/BookingTabs/BookingTabs.jsx";
import BookingHeader from "../Component/BookingHeader/BookingHeader.jsx";
import BookingList from "../Component/BookingList/BookingList.jsx";
import { useManageBooking } from "../Hooks/useManageBooking";
import BookingsContent from "../Component/BookingsContent/BookingsContent.jsx";
const ManageBooking = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const {
        activeTab,
        setActiveTab,
        loading,
        error,
        stats,
        filteredBookings,
        fetchAllBookings,
    } = useManageBooking(user);

    const handleViewDetails = (booking) => {
        navigate(`/booking/${booking.id}`);
    };

    const handleReBook = (booking) => {
        navigate(`/hotel/${booking.room.hotel.id}`);
    };


    if (loading) {
        return <Loader />;
    }

    return (
        <div className={styles.pageWrapper}>
            {/* Header Section */}
            <BookingHeader />

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Stats Cards */}
                <BookingStats stats={stats} activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* Tabs Navigation */}
                <BookingTabs activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />

                {/* Status Header */}
                <BookingList activeTab={activeTab} getStatusConfig={getStatusConfig} />

                {/* Content Area */}
                <div className={styles.contentArea}>
                    <BookingsContent
                        error={error}
                        loading={loading}
                        filteredBookings={filteredBookings}
                        fetchAllBookings={fetchAllBookings}
                        navigate={navigate}
                        getStatusConfig={getStatusConfig}
                        handleViewDetails={handleViewDetails}
                        handleReBook={handleReBook}
                    />
                </div>

                {/* Quick Actions */}
                {filteredBookings.length > 0 && (
                    <QuickActions navigate={navigate} />
                )}
            </div>
        </div>
    );
};

export default ManageBooking;