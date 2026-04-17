import { useEffect, useState } from "react";
import styles from "./HotelBookingInfo.module.css";

const HotelBookingInfo = ({ hotelData, onTotalPriceChange }) => {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [nights, setNights] = useState(0);
    const [showDatePicker, setShowDatePicker] = useState(null);
    const [tempDate, setTempDate] = useState("");

    // Tính tổng tiền
    const totalPrice = hotelData?.price ? nights * hotelData.price : 0;
    useEffect(() => {
        if (onTotalPriceChange) {
            onTotalPriceChange(totalPrice);
        }
    }, [totalPrice, onTotalPriceChange]);

    // Khởi tạo ngày mặc định
    useEffect(() => {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        setCheckIn(today.toISOString().split("T")[0]);
        setCheckOut(tomorrow.toISOString().split("T")[0]);
    }, []);

    // Validate dates và tính số đêm
    useEffect(() => {
        if (checkIn && checkOut) {
            const from = new Date(checkIn);
            const to = new Date(checkOut);
            if (to > from) {
                const diff = to.getTime() - from.getTime();
                setNights(Math.ceil(diff / (1000 * 3600 * 24)));
            } else {
                setNights(0);
            }
        } else {
            setNights(0);
        }
    }, [checkIn, checkOut]);



    // Lấy ngày tối thiểu cho check-out
    const getMinCheckOutDate = () => {
        if (!checkIn) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString().split("T")[0];
        }
        const min = new Date(checkIn);
        min.setDate(min.getDate() + 1);
        return min.toISOString().split("T")[0];
    };

    // Format date để hiển thị
    const formatDisplayDate = (dateString) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString("en-US", { month: "short" })
        };
    };

    // Mở date picker
    const openDatePicker = (type) => {
        setShowDatePicker(type);
        setTempDate(type === 'checkIn' ? checkIn : checkOut);
    };

    // Chọn ngày
    const handleDateSelect = (date) => {
        if (showDatePicker === 'checkIn') {
            setCheckIn(date);
            if (new Date(date) >= new Date(checkOut)) {
                const newCheckOut = new Date(date);
                newCheckOut.setDate(newCheckOut.getDate() + 1);
                setCheckOut(newCheckOut.toISOString().split("T")[0]);
            }
        } else if (showDatePicker === 'checkOut') {
            setCheckOut(date);
        }
        setShowDatePicker(null);
    };

    // Render date picker modal
    const renderDatePickerModal = () => {
        if (!showDatePicker) return null;

        const minDate = showDatePicker === 'checkIn'
            ? new Date().toISOString().split("T")[0]
            : getMinCheckOutDate();

        const title = showDatePicker === 'checkIn' ? 'SELECT CHECK-IN DATE' : 'SELECT CHECK-OUT DATE';

        return (
            <div className={styles.datePickerOverlay} onClick={() => setShowDatePicker(null)}>
                <div className={styles.datePickerModal} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.datePickerHeader}>
                        <h3>{title}</h3>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setShowDatePicker(null)}
                        >
                            ×
                        </button>
                    </div>

                    <div className={styles.datePickerInputContainer}>
                        <input
                            type="date"
                            value={tempDate}
                            onChange={(e) => setTempDate(e.target.value)}
                            min={minDate}
                            className={styles.datePickerInput}
                            autoFocus
                        />
                    </div>

                    <div className={styles.selectedDateInfo}>
                        Selected: <strong>{new Date(tempDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</strong>
                    </div>

                    <div className={styles.datePickerActions}>
                        <button
                            className={styles.cancelBtn}
                            onClick={() => setShowDatePicker(null)}
                        >
                            CANCEL
                        </button>
                        <button
                            className={styles.confirmBtn}
                            onClick={() => handleDateSelect(tempDate)}
                        >
                            CONFIRM
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.bookingBox}>
                {/* CHECK-IN & CHECK-OUT */}
                <div className={styles.dateSection}>
                    <div className={styles.bookingItem}>
                        <h4>CHECK-IN</h4>
                        <div
                            className={`${styles.valueBox} ${styles.dateBox}`}
                            onClick={() => openDatePicker('checkIn')}
                        >
                            <div className={styles.dateDisplay}>
                                <span className={styles.dateDay}>{formatDisplayDate(checkIn).day}</span>
                                <span className={styles.dateMonth}>{formatDisplayDate(checkIn).month}</span>
                            </div>
                            <div className={styles.calendarIndicator}>▼</div>
                        </div>
                    </div>

                    <div className={styles.bookingItem}>
                        <h4>CHECK-OUT</h4>
                        <div
                            className={`${styles.valueBox} ${styles.dateBox}`}
                            onClick={() => openDatePicker('checkOut')}
                        >
                            <div className={styles.dateDisplay}>
                                <span className={styles.dateDay}>{formatDisplayDate(checkOut).day}</span>
                                <span className={styles.dateMonth}>{formatDisplayDate(checkOut).month}</span>
                            </div>
                            <div className={styles.calendarIndicator}>▼</div>
                        </div>
                    </div>
                </div>

                {/* GUESTS & NIGHTS */}
                <div className={styles.dateSection}>
                    <div className={styles.bookingItem}>
                        <h4>GUESTS</h4>
                        <div className={`${styles.valueBox} ${styles.numberBox}`}>
                            <button onClick={() => setGuests((g) => Math.max(1, g - 1))}>−</button>
                            <span className={styles.numberDisplay}>{guests}</span>
                            <button onClick={() => setGuests((g) => g + 1)}>+</button>
                        </div>
                    </div>

                    <div className={styles.bookingItem}>
                        <h4>NIGHTS</h4>
                        <div className={`${styles.valueBox} ${styles.numberBox}`}>
                            <span className={styles.numberDisplay}>{nights}</span>
                        </div>
                    </div>
                </div>

                {/* TOTAL PRICE & BOOK BUTTON */}
                <div className={styles.priceSection}>
                    <div className={styles.totalPrice}>
                        <span className={styles.priceAmount}>
                            {totalPrice.toLocaleString('vn-VN')}đ/TOTAL
                        </span>
                    </div>
                </div>

                {/* Date Picker Modal */}
                {renderDatePickerModal()}
            </div>

        </div>
    );
};

export default HotelBookingInfo;