import { useEffect, useState } from "react";
import "./HotelBooking.css";
import { useNavigate } from "react-router-dom";
const HotelBooking = ({ onBook, hotelId }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [tempDate, setTempDate] = useState("");
  const navigate = useNavigate();

  // Khởi tạo ngày mặc định
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setCheckIn(formatDate(today));
    setCheckOut(formatDate(tomorrow));
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
    const today = new Date().toISOString().split("T")[0];
    
    if (new Date(checkIn) < new Date(today)) {
      alert("❌ Check-in date cannot be in the past");
      return;
    }
    
    if (!checkIn || !checkOut || nights <= 0) {
      alert("❌ Please select valid dates");
      return;
    }
    
    const bookingData = {
      checkIn,
      checkOut,
      guests,
      nights
    };

    console.log('Booking data:', bookingData);

    if (onBook) {
      onBook(bookingData);
    } else {
      navigate(`/booking/${hotelId}`);
    }
  };

  // Format date để hiển thị
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString("en-US", { month: "short" }),
      year: date.getFullYear()
    };
  };

  // Mở date picker
  const openDatePicker = (type) => {
    setShowDatePicker(type);
    setTempDate(type === 'checkIn' ? checkIn : checkOut);
  };

  // Chọn ngày
  const handleDateSelect = (date) => {
    const today = new Date().toISOString().split("T")[0];

    if (showDatePicker === 'checkIn') {
      if (date < today) {
        alert("❌ Check-in cannot be in the past");
        setTempDate(today);
        return;
      }
      setCheckIn(date);

      if (new Date(date) >= new Date(checkOut)) {
        const newCheckOut = new Date(date);
        newCheckOut.setDate(newCheckOut.getDate() + 1);
        setCheckOut(newCheckOut.toISOString().split("T")[0]);
      }
    } else if (showDatePicker === 'checkOut') {
      if (new Date(date) <= new Date(checkIn)) {
        alert("❌ Check-out must be after check-in");
        const minCheckOut = new Date(checkIn);
        minCheckOut.setDate(minCheckOut.getDate() + 1);
        setTempDate(minCheckOut.toISOString().split("T")[0]);
        return;
      }
      setCheckOut(date);
    }

    setShowDatePicker(null);
  };

  // Render date picker modal
  const renderDatePickerModal = () => {
    if (!showDatePicker) return null;
    const title = showDatePicker === 'checkIn' ? 'Select Check-in Date' : 'Select Check-out Date';

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
              min={showDatePicker === 'checkIn' ? new Date().toISOString().split("T")[0] : ''}
              className="date-picker-input"
              autoFocus
            />
          </div>

          <div className="selected-date-info">
            <div className="selected-date-label">Selected Date:</div>
            <div className="selected-date">
              {new Date(tempDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="date-picker-actions">
            <button 
              className="cancel-btn"
              onClick={() => setShowDatePicker(null)}
            >
              Cancel
            </button>
            <button 
              className="confirm-btn"
              onClick={() => handleDateSelect(tempDate)}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="hotel-booking-container">
      <div className="booking-card">
        <div className="booking-form">
          {/* DATE SELECTION */}
          <div className="date-selection">
            <div className="date-field" onClick={() => openDatePicker('checkIn')}>
              <div className="date-label">CHECK-IN</div>
              <div className="date-value">
                <div className="date-display">
                  <span className="date-day">{formatDisplayDate(checkIn).day}</span>
                  <div className="date-month-year">
                    <span className="date-month">{formatDisplayDate(checkIn).month}</span>
                    <span className="date-year">{formatDisplayDate(checkIn).year}</span>
                  </div>
                </div>
                <div className="calendar-icon">📅</div>
              </div>
            </div>

            <div className="nights-display">
              <span className="nights-count">{nights}</span>
              <span className="nights-label">night{nights !== 1 ? 's' : ''}</span>
            </div>

            <div className="date-field" onClick={() => openDatePicker('checkOut')}>
              <div className="date-label">CHECK-OUT</div>
              <div className="date-value">
                <div className="date-display">
                  <span className="date-day">{formatDisplayDate(checkOut).day}</span>
                  <div className="date-month-year">
                    <span className="date-month">{formatDisplayDate(checkOut).month}</span>
                    <span className="date-year">{formatDisplayDate(checkOut).year}</span>
                  </div>
                </div>
                <div className="calendar-icon">📅</div>
              </div>
            </div>
          </div>

          {/* GUESTS SELECTION */}
          <div className="guests-selection">
            <div className="guests-label">GUESTS</div>
            <div className="guests-controls">
              <button 
                className="guest-btn minus" 
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
              >
                −
              </button>
              <div className="guest-count">
                <span className="count">{guests}</span>
                <span className="guest-label">guest{guests !== 1 ? 's' : ''}</span>
              </div>
              <button 
                className="guest-btn plus" 
                onClick={() => setGuests((g) => g + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* TOTAL PRICE */}
          

          {/* BOOK BUTTON */}
          <button
            className="book-now-btn"
            onClick={handleSubmit}
            disabled={nights <= 0}
          >
            <span className="btn-text">Book Now</span>
            <span className="btn-arrow">→</span>
          </button>

          <div className="security-info">
            <span className="secure-icon">🔒</span>
            <span>Your booking is secure and encrypted</span>
          </div>
        </div>
      </div>

      {/* Date Picker Modal */}
      {renderDatePickerModal()}
    </div>
  );
};

export default HotelBooking;