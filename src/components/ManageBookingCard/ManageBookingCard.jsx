import React, { useState } from "react";
import styles from "./ManageBookingCard.module.css";
import { useNavigate } from "react-router-dom";
import { formatDateTime, getNights,getFreeCancelDeadline,calculateCancelFee,getCancelPolicy  } from "../../utils/dateUtils.js";
import ButtonCancel from "../Button/ButtonCancel.jsx";
import ButtonDetail from "../Button/ButtonDetail.jsx";
import Swal from "sweetalert2";
import { bookingService } from "../../services/bookingService.js";
const ManageBookingCard = ({ booking, onViewDetails, onReBook,onCancelSuccess  }) => {
    const { card, cardBody, cardGroup, cardName, cardInfo, status, btn, hotelInfo, dotBtn, menu, deleteBtn } = styles;
    const navigate = useNavigate();
    const getBookContent = (status) => {
        switch (status) {
            case "pending":
                return "Booking confirm";
            case "confirmed":
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
    console.log(booking.room.hotel.id);
    const handleCancelBooking=async(bookingId)=>{
        try {
            const confirm =await Swal.fire({
                title:"Xác nhận hủy phòng?",
                text:"Bạn có chắc chắn muốn hủy đặt phòng này không ?",
                icon:"warning",
                showCancelButton:true,
                confirmButtonText:"Hủy phòng",
                cancelButtonText:"Không",
            });
            if(!confirm.isConfirmed) return;
            const result=await bookingService.cancelBooking(booking.id);
            await Swal.fire("Thành công",result.message,"success");
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
            case "confirmed":
                return "#62B4F5";
            case "cancelled":
                return "#dc3545";
            default:
                return "#6c757d";
        }
    };
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
                        {(booking.status === "pending" || booking.status === "confirmed" || booking.status === "cancelled") && (
                            <div>
                                <div>
                                    <span className={status} style={{ color: getStatusColor(booking.status) }}>{getBookContent(booking.status)}
                                    </span>
                                </div>
                                <div className="d-flex" style={{ gap: "10px" }}>
                                    {booking?.status === "pending" ? (
                                        (() => {
                                        const now = new Date();
                                        const checkInDate = new Date(booking?.check_out);
                                        const isExpired = checkInDate < now; 

                                        return (
                                            <ButtonDetail
                                            text={isExpired ? "Hết hạn" : "Tiếp Tục"}
                                            color={isExpired ? "gray" : "green"}
                                            onClick={!isExpired ? handleSeeDetailClick : undefined} // ✅ Vô hiệu hóa click
                                            disabled={isExpired} // ✅ Thêm prop disabled
                                            />
                                        );
                                        })()
                                    ) : booking?.status === "confirmed" ? (
                                        <>
                                        <ButtonCancel onClick={() => handleCancelBooking(booking.id)} />
                                        <div className={styles.card}>
                                            {cancelPolicy.hasFreeCancel ? (
                                            <>
                                                <div className={styles.cancelFree}>
                                                Miễn phí huỷ đến{" "}
                                                <strong>{formatDateTime(cancelPolicy.freeCancelDeadline)}</strong>
                                                </div>
                                                <div className={styles.cancelFee}>
                                                Sau thời điểm đó:{" "}
                                                <strong>{cancelPolicy.cancelFee.toLocaleString("vi-VN")} VND</strong>
                                                </div>
                                            </>
                                            ) : (
                                            <div className={styles.cancelFee}>
                                                <span>{cancelPolicy.message}</span>
                                                <br />
                                                <strong>
                                                Phí huỷ: {cancelPolicy.cancelFee.toLocaleString("vi-VN")} VND
                                                </strong>
                                            </div>
                                            )}
                                        </div>
                                        </>
                                    ) : booking?.status === "cancelled" ? (
                                        (() => {
                                        const now = new Date();
                                        const checkInDate = new Date(booking?.check_out);
                                        const isExpired = checkInDate < now; 

                                        return (
                                            <ButtonDetail
                                            text={isExpired ? "Hết hạn" : "ĐẶT LẠI"}
                                            color={isExpired ? "gray" : "blue"}
                                            onClick={!isExpired ? handleRebookClick  : undefined} // ✅ Vô hiệu hóa click
                                            disabled={isExpired} // ✅ Thêm prop disabled
                                            />
                                        );
                                        })()
                                    ) : null}
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
