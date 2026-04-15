import React, { useState, useEffect } from "react";
import styles from "./ManageBookingCard.module.css";
import { useNavigate } from "react-router-dom";
import {
  formatDateTime,
  getCancelPolicy,
} from "../../../../../utils/dateUtils.js";
import ButtonCancel from "../../../../../components/Button/ButtonCancel.jsx";
import ButtonDetail from "../../../../../components/Button/ButtonDetail.jsx";
import Swal from "sweetalert2";
import { bookingService } from "../../../../../services/bookingService.js";
const ManageBookingCard = ({
  booking,
  onViewDetails,
  onReBook,
  onCancelSuccess,
}) => {
  const navigate = useNavigate();

  const handleSeeDetailClick = () => {
    if (onViewDetails) {
      onViewDetails(booking);
    } else {
      navigate(`/booking/${booking.id}`);
    }
  };

  const handleRebookClick = () => {
    if (onReBook) {
      onReBook(booking);
    } else {
      navigate(`/hotel/${booking.room.hotel.id}`);
    }
  };
  const handleCancelBooking = async (bookingId) => {
    try {
      const confirm = await Swal.fire({
        title: "Xác nhận hủy phòng?",
        text: "Bạn có chắc chắn muốn hủy đặt phòng này không ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Hủy phòng",
        cancelButtonText: "Không",
      });
      if (!confirm.isConfirmed) return;
      const result = await bookingService.cancelBooking(bookingId);
      await Swal.fire("Thành công", result.message, "success");
      if (typeof onCancelSuccess === "function") {
        onCancelSuccess();
      }
    } catch (error) {
      console.error("Lỗi khi hủy phòng:", error);
      Swal.fire("❌ Lỗi", error.message || "Không thể hủy phòng", "error");
    }
  };
  console.log(booking.id);

  const cancelPolicy = getCancelPolicy(booking);
  return (
    <div className={styles.card}>
      <div className={styles.hotelInfo}>
        <div className={styles.cardBody}>
          <div className={styles.cardGroup}>
            <div className={styles.cardName}>{booking?.room?.hotel?.name}</div>
            <div className={styles.location}>
              📍 {booking?.room?.hotel?.province}
            </div>

            <div className={styles.dateGrid}>
              <div className={styles.dateItem}>
                <span className={styles.dateLabel}>Check-in</span>
                <span className={styles.dateValue}>
                  {formatDateTime(booking?.check_in)}
                </span>
              </div>
              <div className={styles.dateItem}>
                <span className={styles.dateLabel}>Check-out</span>
                <span className={styles.dateValue}>
                  {formatDateTime(booking?.check_out)}
                </span>
              </div>
            </div>

            <div className={styles.totalSection}>
              <span className={styles.totalLabel}>Tổng thanh toán</span>
              <span className={styles.totalValue}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(booking.total_price)}
              </span>
            </div>

            <div className={styles.actionArea}>
              {(() => {
                const now = new Date();
                const checkInDate = new Date(booking?.check_in);
                const checkOutDate = new Date(booking?.check_out);
                const isExpired = checkInDate < now;
                const isExpiredCheckOut = checkOutDate < now;

                switch (booking?.status) {
                  case "pending":
                    return (
                      <div className="d-flex flex-column gap-3 w-100">
                        <div className="d-flex gap-2">
                          <ButtonDetail
                            text="Thanh Toán"
                            color="#10b981"
                            onClick={handleSeeDetailClick}
                          />
                          <ButtonCancel
                            text="Hủy"
                            color="#ef4444"
                            onClick={() => handleCancelBooking(booking?.id)}
                          />
                        </div>
                        <PendingTimer
                          createdAt={booking.created_at}
                          onExpire={() => onCancelSuccess && onCancelSuccess()}
                          bookingId={booking.id}
                        />
                      </div>
                    );

                  case "completed":
                    return (
                      <div className="d-flex flex-column gap-2">
                        <ButtonCancel
                          text={isExpiredCheckOut ? "Hoàn Thành" : "Hủy Phòng"}
                          color={isExpiredCheckOut ? "#10b981" : "#ef4444"}
                          onClick={
                            !isExpiredCheckOut
                              ? () => handleCancelBooking(booking?.id)
                              : undefined
                          }
                          disabled={isExpiredCheckOut}
                        />
                        <div className={styles.policyBox}>
                          <span className={styles.policyTitle}>
                            Chính sách hủy phòng
                          </span>
                          {cancelPolicy.hasFreeCancel ? (
                            <p className={styles.policyText}>
                              Miễn phí huỷ đến{" "}
                              <strong>
                                {formatDateTime(
                                  cancelPolicy.freeCancelDeadline,
                                )}
                              </strong>
                              . Sau thời điểm đó phí huỷ là{" "}
                              {cancelPolicy.cancelFee.toLocaleString("vi-VN")}{" "}
                              VND.
                            </p>
                          ) : (
                            <p className={styles.policyText}>
                              {cancelPolicy.message}
                            </p>
                          )}
                        </div>
                      </div>
                    );

                  case "cancelled":
                    return (
                      <ButtonDetail
                        text={isExpired ? "Hết hạn" : "ĐẶT LẠI"}
                        color={isExpired ? "#94a3b8" : "#3b82f6"}
                        onClick={!isExpired ? handleRebookClick : undefined}
                        disabled={isExpired}
                      />
                    );

                  default:
                    return null;
                }
              })()}
            </div>
          </div>
        </div>

        <div className={styles.menuWrapper}>
          <img
            src={booking?.room?.hotel?.images?.[1]?.url || "/default.jpg"}
            alt={booking?.name || "hotel"}
          />
        </div>
      </div>
    </div>
  );
};

export default ManageBookingCard;

const PendingTimer = ({ createdAt, onExpire, bookingId }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const start = new Date(createdAt);
      const now = new Date();
      const limit = 10 * 60 * 1000; // 10 minutes
      const diff = start.getTime() + limit - now.getTime();

      if (diff <= 0) {
        setTimeLeft("00:00");
        setIsExpired(true);
        return false;
      }

      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
      return true;
    };

    const hasTime = calculateTimeLeft();
    if (!hasTime) {
      // Nếu đã hết hạn ngay từ đầu, chỉ hiển thị trạng thái, không trigger refresh để tránh loop API
      return;
    }

    const timer = setInterval(() => {
      const stillHasTime = calculateTimeLeft();
      if (!stillHasTime) {
        clearInterval(timer);
        onExpire && onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt]); // Giảm bớt dependency để tránh re-run không cần thiết

  if (isExpired)
    return (
      <span style={{ color: "red", fontSize: "13px" }}>
        ⏰ Giao dịch đã hết hạn
      </span>
    );

  return (
    <div
      style={{
        fontSize: "13px",
        color: "#d35400",
        background: "#fff3e0",
        padding: "4px 8px",
        borderRadius: "4px",
        border: "1px solid #ffe0b2",
        display: "inline-block",
      }}
    >
      ⏰ Vui lòng thanh toán trong: <strong>{timeLeft}</strong>
    </div>
  );
};
