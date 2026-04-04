import { useEffect, useMemo, useState } from "react";
import styles from "./ManageBookingCard.module.css";
import { useNavigate } from "react-router-dom";
import { formatDateTime,getCancelPolicy } from "../../../../../utils/dateUtils.js";
import ButtonCancel from "../../../../../components/Button/ButtonCancel.jsx";
import ButtonDetail from "../../../../../components/Button/ButtonDetail.jsx";
import Swal from "sweetalert2";
import { bookingService } from "../../../../../services/bookingService.js";
const ManageBookingCard = ({ booking, onViewDetails, onReBook, onCancelSuccess }) => {
    const { card, cardBody, cardGroup, cardName, cardInfo, status, hotelInfo } = styles;
    const navigate = useNavigate();
    const [nowMs, setNowMs] = useState(Date.now());

    useEffect(() => {
        if (booking?.status !== "pending") return;

        const timer = setInterval(() => {
            setNowMs(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, [booking?.status]);

    const remainingSeconds = useMemo(() => {
        if (booking?.status !== "pending" || !booking?.created_at) return null;
        const createdAtMs = new Date(booking.created_at).getTime();
        const expiresAtMs = createdAtMs + 15 * 60 * 1000;
        return Math.max(0, Math.floor((expiresAtMs - nowMs) / 1000));
    }, [booking?.status, booking?.created_at, nowMs]);

    const countdownText = useMemo(() => {
        if (remainingSeconds === null) return "";
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        return `Còn ${minutes} phút ${seconds.toString().padStart(2, "0")} giây sẽ tự hủy`;
    }, [remainingSeconds]);
    const getBookContent = (status) => {
        switch (status) {
            case "pending":
                return "Booking confirm";
            case "completed":
                return "Completed booking";
            case "cancelled":
                return "Cancelled";
            default:
                return "Xem chi tiết";
        }
    };
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
    }
    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "#41BC63";
            case "completed":
                return "#62B4F5";
            case "cancelled":
                return "#dc3545";
            default:
                return "#6c757d";
        }
    };
    console.log(booking.id);
    const cancelPolicy = getCancelPolicy(booking);
    return (
        <div className={card} >
            <div className={hotelInfo}>
                <div className={cardBody}>
                    <div className={cardGroup}>
                        <span className={cardName}>{booking?.room?.hotel?.name}</span>
                        <span className={cardInfo}>{booking?.room?.hotel?.province}</span>
                        <div className="d-flex" style={{ color: 'black' }}>
                            <span className={cardInfo}>Check-in:</span>{formatDateTime(booking?.check_in)}
                        </div>
                        <div className="d-flex" style={{ color: 'black' }}>
                            <span className={cardInfo}>Check-out:</span>{formatDateTime(booking?.check_out)}
                        </div>
                        <div className="d-flex" style={{ color: '#024288', fontSize: "17px" }}>
                            <span className={cardInfo}>Total:
                            </span>{new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(booking.total_price)}
                        </div>
                        {(booking.status === "pending" || booking.status === "completed" || booking.status === "cancelled") && (
                            <div>
                                <div>
                                    <span className={status} style={{ color: getStatusColor(booking.status) }}>{getBookContent(booking.status)}
                                    </span>
                                </div>
                                {booking?.status === "pending" && (
                                    <div style={{ color: remainingSeconds === 0 ? "#dc3545" : "#ff8c00", fontSize: "13px", marginBottom: "8px" }}>
                                        {remainingSeconds === 0 ? "Booking đã quá hạn, hệ thống sẽ tự hủy." : countdownText}
                                    </div>
                                )}
                                <div className="d-flex" style={{ gap: "10px" }}>
                                    {(() => {
                                        const now = new Date();
                                        const checkInDate = new Date(booking?.check_in);
                                        const checkOutDate = new Date(booking?.check_out);
                                        const isExpired = checkInDate < now;
                                        const isExpiredCheckOut = checkOutDate < now; // 🎯 SỬA: tính theo checkout

                                        switch (booking?.status) {
                                            case "pending":
                                                return (
                                                    <>
                                                        <ButtonDetail
                                                            text="Tiếp Tục"
                                                            color="green"
                                                            onClick={handleSeeDetailClick}
                                                        />
                                                        <ButtonCancel
                                                            text="Hủy Phòng"
                                                            color="red"
                                                            onClick={() => handleCancelBooking(booking?.id)}
                                                        />
                                                    </>
                                                );

                                            case "completed":
                                                return (
                                                    <>
                                                        <ButtonCancel
                                                            text={isExpiredCheckOut ? "Hoàn Thành" : "Hủy Phòng"}
                                                            color={isExpiredCheckOut ? "green" : "red"}
                                                            onClick={!isExpiredCheckOut ? () => handleCancelBooking(booking?.id) : undefined}
                                                            disabled={isExpiredCheckOut}
                                                        />
                                                        <div className={styles.card}>
                                                            {cancelPolicy.hasFreeCancel ? (
                                                                <>
                                                                    <div className={styles.cancelFree}>
                                                                        Miễn phí huỷ đến <strong>{formatDateTime(cancelPolicy.freeCancelDeadline)}</strong>
                                                                    </div>
                                                                    <div className={styles.cancelFee}>
                                                                        Sau thời điểm đó: <strong>{cancelPolicy.cancelFee.toLocaleString("vi-VN")} VND</strong>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <div className={styles.cancelFee}>
                                                                    <span>{cancelPolicy.message}</span>
                                                                    <br />
                                                                    <strong>Phí huỷ: {cancelPolicy.cancelFee.toLocaleString("vi-VN")} VND</strong>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                );


                                            case "cancelled":
                                                return (
                                                    <ButtonDetail
                                                        text={isExpired ? "Hết hạn" : "ĐẶT LẠI"}
                                                        color={isExpired ? "gray" : "blue"}
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
                        )}
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
