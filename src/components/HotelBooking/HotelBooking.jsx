import { useEffect, useState } from "react";
import "./HotelBooking.css";

const HotelBooking = ({ onBook }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(null); // 'checkIn' | 'checkOut' | null
  const [tempDate, setTempDate] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut || nights <= 0) {
      alert("❌ Please select valid dates");
      return;
    }
    alert(`✅ Booking success!\nGuests: ${guests}\nNights: ${nights}`);
  };

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
      // Tự động điều chỉnh check-out nếu cần
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
      <div className="date-picker-overlay" onClick={() => setShowDatePicker(null)}>
        <div className="date-picker-modal" onClick={(e) => e.stopPropagation()}>
          <div className="date-picker-header">
            <h3>{title}</h3>
            <button 
              className="close-btn"
              onClick={() => setShowDatePicker(null)}
            >
              ×
            </button>
          </div>
          
          <div className="date-picker-input-container">
            <input
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              min={minDate}
              className="date-picker-input"
              autoFocus
            />
          </div>

          <div className="selected-date-info">
            Selected: <strong>{new Date(tempDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</strong>
          </div>

          <div className="date-picker-actions">
            <button 
              className="cancel-btn"
              onClick={() => setShowDatePicker(null)}
            >
              CANCEL
            </button>
            <button 
              className="confirm-btn"
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
    <div className="booking-box">
      {/* CHECK-IN & CHECK-OUT */}
      <div className="date-section">
        <div className="booking-item">
          <h4>CHECK-IN</h4>
          <div 
            className="value-box date-box" 
            onClick={() => openDatePicker('checkIn')}
          >
            <div className="date-display">
              <span className="date-day">{formatDisplayDate(checkIn).day}</span>
              <span className="date-month">{formatDisplayDate(checkIn).month}</span>
            </div>
            <div className="calendar-indicator">▼</div>
          </div>
        </div>

        <div className="booking-item">
          <h4>CHECK-OUT</h4>
          <div 
            className="value-box date-box" 
            onClick={() => openDatePicker('checkOut')}
          >
            <div className="date-display">
              <span className="date-day">{formatDisplayDate(checkOut).day}</span>
              <span className="date-month">{formatDisplayDate(checkOut).month}</span>
            </div>
            <div className="calendar-indicator">▼</div>
          </div>
        </div>
      </div>

      {/* GUESTS & NIGHTS */}
      <div className="date-section">
        <div className="booking-item">
          <h4>GUESTS</h4>
          <div className="value-box number-box">
            <button onClick={() => setGuests((g) => Math.max(1, g - 1))}>−</button>
            <span className="number-display">{guests}</span>
            <button onClick={() => setGuests((g) => g + 1)}>+</button>
          </div>
        </div>

        <div className="booking-item ">
          <h4>NIGHTS</h4>
          <div className="value-box number-box">
            <span className="number-display">{nights}</span>
          </div>
        </div>
      </div>

      {/* BOOK BUTTON */}
      <button
        className="book-btn"
        onClick={handleSubmit}
        disabled={!checkIn || !checkOut || nights <= 0}
      >
        BOOK NOW
      </button>

      {/* Date Picker Modal */}
      {renderDatePickerModal()}
    </div>
  );
};

export default HotelBooking;