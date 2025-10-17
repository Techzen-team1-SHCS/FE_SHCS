import { useEffect, useState } from 'react'
import styles from './HotelBooking.module.css'

const HotelBooking = ({ onBook }) => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [adult18Minus, setAdult18Minus] = useState(1);
    const [adult18Plus, setAdult18Plus] = useState(1);
    const [nights, setNights] = useState(0);
    const priceUnder18 = 28.5;
    const priceOver18 = 50.4;
    const [total, setTotal] = useState(0);

    // Validate dates và tính số đêm
    useEffect(() => {
        if (fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);

            if (to > from) {
                const timeDiff = to.getTime() - from.getTime();
                const nightsCount = Math.ceil(timeDiff / (1000 * 3600 * 24));
                setNights(nightsCount);
            } else {
                setNights(0);
                // Nếu toDate nhỏ hơn fromDate, reset toDate
                if (to < from) {
                    setToDate("");
                }
            }
        } else {
            setNights(0);
        }
    }, [fromDate, toDate]);

    // Tính tổng tiền khi thay đổi số lượng hoặc số đêm
    useEffect(() => {
        if (nights > 0) {
            const newTotal = (adult18Minus * priceUnder18 + adult18Plus * priceOver18) * nights;
            setTotal(newTotal);
        } else {
            setTotal(0);
        }
    }, [adult18Minus, adult18Plus, nights]);

    const handleFromDateChange = (e) => {
        const newFromDate = e.target.value;
        setFromDate(newFromDate);
        
        // Nếu toDate đã được chọn và nhỏ hơn fromDate mới, reset toDate
        if (toDate && newFromDate && newFromDate > toDate) {
            setToDate("");
        }
    };

    const handleToDateChange = (e) => {
        const newToDate = e.target.value;
        
        // Chỉ set toDate nếu nó lớn hơn fromDate
        if (!fromDate || newToDate > fromDate) {
            setToDate(newToDate);
        } else {
            // Nếu toDate nhỏ hơn fromDate, hiển thị cảnh báo
            alert("❌ To Date must be after From Date");
            setToDate("");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (nights <= 0) {
            alert("❌ Please select valid dates (To Date must be after From Date)");
            return;
        }

        const bookingData = {
            fromDate,
            toDate,
            adult18Minus,
            adult18Plus,
            nights,
            total,
        };

        if (onBook) onBook(bookingData);
        alert("✅ Booking success!\n" + JSON.stringify(bookingData, null, 2));

        // Reset form
        setFromDate("");
        setToDate("");
        setAdult18Minus(1);
        setAdult18Plus(1);
        setNights(0);
    };

    // Lấy ngày mai để set min date cho toDate
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    // Tính min date cho toDate (phải là ngày sau fromDate)
    const getMinToDate = () => {
        if (!fromDate) return getTomorrowDate();
        
        const minDate = new Date(fromDate);
        minDate.setDate(minDate.getDate() + 1);
        return minDate.toISOString().split('T')[0];
    };

    return (
        <div>
            <div
                className="widget widget-booking"
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-offset="50"
            >
                <h5 className="widget-title">Tour Booking</h5>
                <form onSubmit={handleSubmit}>
                    <div className="date mb-25">
                        <b>From Date</b>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={handleFromDateChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    <div className="date mb-25">
                        <b>To Date</b>
                        <input
                            type="date"
                            value={toDate}
                            onChange={handleToDateChange}
                            min={getMinToDate()} // Luôn là ngày sau fromDate
                            required
                        />
                    </div>

                    {nights > 0 && (
                        <div className="nights-info mb-15">
                            <small className="text-muted">
                                📅 {nights} night{nights > 1 ? 's' : ''}
                            </small>
                        </div>
                    )}

                   
                    <hr className="mb-25" />
                    <h6>Tickets:</h6>
                    <ul className="tickets clearfix">
                        <li>
                            Adult (18- years) <span className="price">${priceUnder18}/night</span>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={adult18Minus}
                                onChange={(e) => setAdult18Minus(Number(e.target.value))}
                                className={styles.numberInput}
                            />
                        </li>
                        <li>
                            Adult (18+ years) <span className="price">${priceOver18}/night</span>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={adult18Plus}
                                onChange={(e) => setAdult18Plus(Number(e.target.value))}
                                className={styles.numberInput}
                            />
                        </li>
                    </ul>

                    <hr />
                    <h6>
                        Total: <span className="price">${total.toFixed(2)}</span>
                        {nights > 0 && (
                            <small className="d-block text-muted">
                                (${(total / nights).toFixed(2)} per night)
                            </small>
                        )}
                    </h6>

                    <button
                        type="submit"
                        className="theme-btn style-two w-100 mt-15 mb-5"
                        disabled={nights <= 0}
                    >
                        <span data-hover="Book Now">Book Now</span>
                        <i className="fal fa-arrow-right"></i>
                    </button>

                    <div className="text-center">
                        <a href="/contact">Need some help?</a>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default HotelBooking