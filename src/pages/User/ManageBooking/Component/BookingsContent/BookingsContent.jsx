import React from "react";
import styles from "../../ManageBooking.module.css";
import { BookingCardSkeleton } from "../../../../../components/LoadingSkeleton/LoadingSkeleton";
import EmptyState from "../EmptyState/EmptyState";
import ManageBookingCard from "../ManageBookingCard/ManageBookingCard";
const BookingsContent = ({
  error,
  loading,
  filteredBookings,
  fetchAllBookings,
  navigate,
  getStatusConfig,
  handleViewDetails,
  handleReBook
}) => {

  if (error) {
    return (
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
    );
  }

  if (loading) {
    return (
      <div className={styles.skeletonContainer}>
        {[1, 2, 3].map((item) => (
          <BookingCardSkeleton key={item} />
        ))}
      </div>
    );
  }

  if (filteredBookings.length === 0) {
    return (
      <div className={styles.emptyStateContainer}>
        <EmptyState />

        <div className={styles.emptyStateAction}>
          <button
            className={styles.exploreButton}
            onClick={() => navigate("/HotelList")}
          >
            Khám phá khách sạn
          </button>
        </div>
      </div>
    );
  }

  return (
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
                <span className={styles.badgeIcon}>
                  {statusConfig.icon}
                </span>

                <span className={styles.badgeText}>
                  {statusConfig.label}
                </span>
              </div>

              <div className={styles.bookingDate}>
                {new Date(
                  new Date(booking.check_out).setDate(
                    new Date(booking.check_out).getDate() + 1
                  )
                ).toLocaleDateString("vi-VN")}
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
  );
};

export default React.memo(BookingsContent);