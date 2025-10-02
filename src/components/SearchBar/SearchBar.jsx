import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function SearchBar() {
    const [filters, setFilters] = useState({
        destination: "",
        roomType: "",
        checkIn: "",
        checkOut: "",
        guests: ""
    });
    const [showDropdown, setShowDropdown] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(null); // 'checkIn' hoặc 'checkOut'
    const navigate=useNavigate();
    const handleOptionSelect = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setShowDropdown(null);
    };

    const handleDateSelect = (date) => {
        if (showDatePicker === 'checkIn') {
            setFilters(prev => ({ ...prev, checkIn: date }));
            // Tự động chuyển sang chọn checkOut nếu chưa có
            if (!filters.checkOut) {
                setShowDatePicker('checkOut');
            } else {
                setShowDatePicker(null);
            }
        } else if (showDatePicker === 'checkOut') {
            setFilters(prev => ({ ...prev, checkOut: date }));
            setShowDatePicker(null);
        }
    };

    const handleSearch = async () => {
    // Kiểm tra điều kiện check-out phải sau check-in
    if (filters.checkIn && filters.checkOut) {
        const checkInDate = new Date(filters.checkIn);
        const checkOutDate = new Date(filters.checkOut);

        if (checkOutDate <= checkInDate) {
            alert('❌ LỖI: Ngày trả phòng phải sau ngày nhận phòng');
            return; // Thêm return để dừng hàm
        }
    }

    // Tạo search params cho URL
    const searchParams = new URLSearchParams({
        destination: filters.destination || '',
        roomType: filters.roomType || '',
        checkIn: filters.checkIn || '',
        checkOut: filters.checkOut || '',
        guests: filters.guests || ''
    });

    // Chuyển hướng đến HotelList với query parameters
    navigate(`/HotelList?${searchParams.toString()}`);
};

    // Tạo lịch cho 2 tháng
    const generateCalendar = () => {
        const today = new Date();
        const months = [];

        for (let i = 0; i < 2; i++) {
            const month = new Date(today.getFullYear(), today.getMonth() + i, 1);
            const monthName = month.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
            const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
            const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();

            const days = [];

            // Ô trống đầu tháng
            for (let j = 0; j < firstDay; j++) {
                days.push(<div key={`empty-${j}`} className="calendar-empty"></div>);
            }

            // Các ngày trong tháng
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${month.getFullYear()}-${(month.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const isSelected = dateStr === filters.checkIn || dateStr === filters.checkOut;
                const isInRange = filters.checkIn && filters.checkOut &&
                    new Date(dateStr) > new Date(filters.checkIn) &&
                    new Date(dateStr) < new Date(filters.checkOut);

                days.push(
                    <div
                        key={dateStr}
                        className={`calendar-day ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''}`}
                        onClick={() => handleDateSelect(dateStr)}
                        style={{
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            backgroundColor: isSelected ? '#007bff' : isInRange ? '#e3f2fd' : 'transparent',
                            color: isSelected ? 'white' : 'black'
                        }}
                    >
                        {day}
                    </div>
                );
            }

            months.push(
                <div key={i} style={{ marginRight: '20px' }}>
                    <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>{monthName}</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                            <div key={day} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                                {day}
                            </div>
                        ))}
                        {days}
                    </div>
                </div>
            );
        }

        return months;
    };

    const destinations = ["Hà Nội", "Đà Nẵng", "Hồ Chí Minh", "Nha Trang", "Huế", "Hải Phòng", "Phú Quốc", "Đà Lạt"];
    const roomTypes = [
        "Cổ điển", "Hiện đại",
        "Yên tĩnh", "Sôi động",
        "Thơ mộng",
        "Tình yêu"
    ];

    const dropdownStyle = {
        padding: '4px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: 'white',
        cursor: 'pointer',
        minWidth: '180px'
    };

    const dropdownMenuStyle = {
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '15px',
        zIndex: 1000,
        width: '220px',
        maxHeight: '200px',
        overflowY: 'auto',

    };

    const datePickerStyle = {
        position: 'absolute',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        zIndex: 1000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: "'Outfit', sans-serif"
    };

    const dropdownItemStyle = {
        padding: '8px',
        cursor: 'pointer',
        borderBottom: '1px solid #eee',
        fontFamily: "'Outfit', sans-serif"
    };

    return (
        <div className="container container-1400" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <div
                className="search-filter-inner"
                data-aos="zoom-out-down"
                data-aos-duration="1500"
                data-aos-offset="50"

            >
                {/* Destination Dropdown */}
                <div className="filter-item clearfix" style={{ position: 'relative' }}>
                    <div className="icon"><i className="fal fa-map-marker-alt"></i></div>
                    <span className="title" >Điểm đến</span>
                    <div
                        style={dropdownStyle}
                        onClick={() => setShowDropdown(showDropdown === 'destination' ? null : 'destination')}
                    >
                        {filters.destination || "Chọn điểm đến"}
                    </div>
                    {showDropdown === 'destination' && (
                        <div style={dropdownMenuStyle}>
                            {destinations.map(dest => (
                                <div
                                    key={dest}
                                    style={dropdownItemStyle}
                                    onClick={() => handleOptionSelect('destination', dest)}
                                >
                                    {dest}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Room Type Dropdown */}
                <div className="filter-item clearfix" style={{ position: 'relative' }}>
                    <div className="icon"><i className="fal fa-bed"></i></div>
                    <span className="title">Loại phòng</span>
                    <div
                        style={dropdownStyle}
                        onClick={() => setShowDropdown(showDropdown === 'roomType' ? null : 'roomType')}
                    >
                        {filters.roomType || "Chọn loại phòng"}
                    </div>
                    {showDropdown === 'roomType' && (
                        <div style={dropdownMenuStyle}>
                            {roomTypes.map(room => (
                                <div
                                    key={room}
                                    style={dropdownItemStyle}
                                    onClick={() => handleOptionSelect('roomType', room)}
                                >
                                    {room}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Check-in Date Picker */}
                <div className="filter-item clearfix" style={{ position: 'relative' }}>
                    <div className="icon"><i className="fal fa-calendar-plus"></i></div>
                    <span className="title">Nhận phòng</span>
                    <div
                        style={dropdownStyle}
                        onClick={() => {
                            setShowDropdown(null);
                            setShowDatePicker('checkIn');
                        }}
                    >
                        {filters.checkIn ? new Date(filters.checkIn).toLocaleDateString('vi-VN') : "Chọn ngày"}
                    </div>
                </div>

                {/* Check-out Date Picker */}
                <div className="filter-item clearfix" style={{ position: 'relative' }}>
                    <div className="icon"><i className="fal fa-calendar-minus"></i></div>
                    <span className="title">Trả phòng</span>
                    <div
                        style={dropdownStyle}
                        onClick={() => {
                            setShowDropdown(null);
                            setShowDatePicker('checkOut');
                        }}
                    >
                        {filters.checkOut ? new Date(filters.checkOut).toLocaleDateString('vi-VN') : "Chọn ngày"}
                    </div>
                </div>

                {/* Date Picker Popup */}
                {showDatePicker && (
                    <div style={datePickerStyle}>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            {generateCalendar()}
                        </div>
                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                            <button
                                onClick={() => setShowDatePicker(null)}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                )}



                {/* Search Button */}
                <div className="search-button">
                    <button
                        className="theme-btn"
                        onClick={handleSearch}

                    >
                        <span data-hover="Tìm kiếm">Tìm kiếm</span>
                        <i className="far fa-search"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchBar