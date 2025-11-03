import React, { useState } from "react";
import styles from "./ManageBookingCard.module.css";
import { useNavigate } from "react-router-dom";

const ManageBookingCard = ({ booking, onDelete, onViewDetails, onReBook }) => {
    const { card, cardBody, rebookBtn, cardGroup, cardName, cardInfo, status, btn, hotelInfo, dotBtn, menu, deleteBtn } = styles;
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const getButtonContent = (status) => {
        if (status === "Đã qua") {
            return "Đặt lại chỗ nghỉ";
        }
        return "Xem chi tiết";  
    };

    const handleDotClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleDelete = () => {
        onDelete && onDelete(booking.id);
        setShowMenu(false);
    };

    const handleClickOutside = () => {
        setShowMenu(false);
    };

    const handleButtonClick = () => {
        if (booking.status === "Đã qua") {
            // Gọi hàm từ props hoặc dùng navigate
            if (onReBook) {
                onReBook(booking);
            } else {
                navigate(`/book/${booking.hotelId}`, { 
                    state: { rebookData: booking } 
                });
            }
        } else {
            // Gọi hàm từ props hoặc dùng navigate
            if (onViewDetails) {
                onViewDetails(booking);
            } else {
                navigate(`/booking/${booking.id}`);
            }
        }
    };

    return (
        <div className={card} onClick={handleClickOutside}>
            <div className={hotelInfo}>
                <div className={cardBody}>
                    <img src={booking.image} alt={booking.name} />
                    <div className={cardGroup}>
                        <span className={cardName}>{booking.name}</span>
                        <span className={cardInfo}>{booking.date}</span>
                        <span className={cardInfo}>{booking.price}</span>
                        <span className={status}> {booking.status}</span>
                    </div>
                </div>
                
                {(booking.status === "Đã qua" || booking.status === "Đã hủy") && (
                    <div className={styles.menuWrapper}>
                        <i 
                            className={`fa fa-ellipsis-v cursor-pointer ${dotBtn}`}
                            onClick={handleDotClick}
                        ></i>
                        
                        {showMenu && (
                            <div className={menu}>
                                <button 
                                    className={deleteBtn}
                                    onClick={handleDelete}
                                >
                                    <i className="fa fa-trash"></i>
                                    Xóa
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
            <button className={btn} onClick={handleButtonClick}>
                <div className={rebookBtn}>
                    <div style={{width:'25px'}}>
                        <img src="/assets/images/logos/info.png"/>
                    </div>
                    {getButtonContent(booking.status)}
                </div>
                <div>&gt;</div>
            </button>
        </div>
    );
};

export default ManageBookingCard;