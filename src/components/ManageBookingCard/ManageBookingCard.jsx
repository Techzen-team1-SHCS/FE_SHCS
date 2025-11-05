import React, { useState } from "react";
import styles from "./ManageBookingCard.module.css";
import { useNavigate } from "react-router-dom";

const ManageBookingCard = ({ booking, onViewDetails, onReBook }) => {
    const { card, cardBody, cardGroup, cardName, cardInfo, status, btn, hotelInfo, dotBtn, menu, deleteBtn } = styles;
    const navigate = useNavigate();
    const getBookContent = (status) => {
        switch (status) {
            case "Paid":
                return "Booking confirm";
            case "Past":
                return "Completed booking";
            case "Cancelled":
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
            navigate(`/book/${booking.id}`, {
                state: { rebookData: booking }
            });
        }
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case "Paid":
                return "#41BC63";
            case "Past":
                return "#62B4F5";
            case "Cancelled":
                return "#dc3545";
            default:
                return "#6c757d";
        }
    };
    return (
        <div className={card} >
            <div className={hotelInfo}>
                <div className={cardBody}>
                    <div className={cardGroup}>
                        <span className={cardName}>{booking.name}</span>
                        <span className={cardInfo}>{booking.province}</span>
                        <div className="d-flex" style={{ color: 'black' }}>
                            <span className={cardInfo}>Check-in:</span>{booking.checkIn}
                        </div>
                        <div className="d-flex" style={{ color: 'black' }}>
                            <span className={cardInfo}>Check-out:</span>{booking.checkOut}
                        </div>
                        <div className="d-flex" style={{ color: '#024288', fontSize: "17px" }}>
                            <span className={cardInfo}>Total:
                            </span>{new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND'
                            }).format(booking.price)}
                        </div>
                        {(booking.status === "Paid" || booking.status === "Past" || booking.status === "Cancelled") && (
                            <div>
                                <div>
                                    <span className={status} style={{ color: getStatusColor(booking.status) }}>{getBookContent(booking.status)}
                                    </span>
                                </div>
                                <div className="d-flex" style={{gap:'10px'}}>
                                    <button className={btn} onClick={handleSeeDetailClick}>See detail</button>
                                    {(booking.status === "Past" || booking.status === "Cancelled") && (
                                        <button className={btn} onClick={handleRebookClick}>Rebook</button>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.menuWrapper}>
                    <img src={booking.image} alt={booking.name} />
                </div>

            </div>


        </div>
    );
};

export default ManageBookingCard;
