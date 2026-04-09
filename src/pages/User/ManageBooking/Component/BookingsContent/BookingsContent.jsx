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
    <div className={styles.bookingsContainer}>
      <div className={styles.gridHeader}>
        <h3>Danh sách đặt phòng của bạn</h3>
        <p>Theo dõi và quản lý các giao dịch đặt phòng gần đây</p>
      </div>
      
      <div className={styles.bookingsGrid}>
        {filteredBookings.map((booking) => {
          const statusConfig = getStatusConfig(booking.status);

          return (
            <div
              key={booking.id}
              className={`${styles.bookingCardWrapper} ${styles.fadeIn}`}
              style={{
                '--accent-color': statusConfig.borderColor,
                '--bg-soft': statusConfig.bgColor
              }}
            >
              <div className={styles.cardHeaderArea}>
                <div className={`${styles.statusBadge} ${statusConfig.badgeStyle}`}>
                  <span className={styles.badgeIcon}>{statusConfig.icon}</span>
                  <span className={styles.badgeText}>{statusConfig.label}</span>
                </div>
                
                <div className={styles.bookingRef}>
                  REF: <span>#{booking.payment_code || booking.id}</span>
                </div>
              </div>

              <div className={styles.cardMainContent}>
                <ManageBookingCard
                  booking={booking}
                  onViewDetails={handleViewDetails}
                  onReBook={handleReBook}
                  onCancelSuccess={fetchAllBookings}
                  statusConfig={statusConfig}
                />
              </div>

              <div className={styles.cardFooterArea}>
                <div className={styles.dateInfo}>
                  <span className={styles.label}>Ngày trả phòng:</span>
                  <span className={styles.value}>
                    {new Date(booking.check_out).toLocaleDateString("vi-VN", {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(BookingsContent);