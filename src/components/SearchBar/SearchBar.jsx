import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css'
function SearchBar() {
    const [filters, setFilters] = useState({
        destination: "",
        roomType: "",
        checkIn: "",
        checkOut: "",
        guests: "",
        searchTerm: "",
        sort: "price_asc"
    });
    const [showDropdown, setShowDropdown] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(null);
    const navigate = useNavigate();

    // ✅ Fix search input
    const handleSearchInput = (e) => {
        let value = e.target.value;
        if (value.length > 30) {
            value = value.slice(0, 30);
            toast.warning("Giới hạn tối đa 30 ký tự")
        }
        setFilters((prev) => ({
            ...prev,
            searchTerm: value,
        }));

    };

    const handleOptionSelect = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
        setShowDropdown(null);
    };

    const handleDateSelect = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(date);

        if (selectedDate <= today) {
            toast.error("❌ Không thể chọn ngày trong quá khứ");
            return;
        }

        if (showDatePicker === 'checkIn') {
            if (filters.checkOut && selectedDate >= new Date(filters.checkOut)) {
                toast.error("❌ Ngày nhận phòng phải trước ngày trả phòng");
                return;
            }
            setFilters(prev => ({ ...prev, checkIn: date }));
            if (!filters.checkOut) setShowDatePicker('checkOut');
            else setShowDatePicker(null);
        } else if (showDatePicker === 'checkOut') {
            if (filters.checkIn && selectedDate <= new Date(filters.checkIn)) {
                toast.error("❌ Ngày trả phòng phải sau ngày nhận phòng");
                return;
            }
            setFilters(prev => ({ ...prev, checkOut: date }));
            setShowDatePicker(null);
        }
    };

    // ✅ Fix handleSearch: chỉ gửi giá trị hợp lệ
    const handleSearch = () => {
        // Kiểm tra ngày
        if (filters.checkIn && filters.checkOut) {
            if (new Date(filters.checkOut) <= new Date(filters.checkIn)) {
                toast.error("❌ Ngày trả phòng phải sau ngày nhận phòng");
                return;
            }
        }

        const searchParams = new URLSearchParams();

        // Chỉ thêm params nếu có giá trị
        if (filters.searchTerm) searchParams.append('searchTerm', filters.searchTerm);
        if (filters.destination) searchParams.append('destination', filters.destination);
        if (filters.roomType) searchParams.append('roomType', filters.roomType);
        if (filters.checkIn) searchParams.append('checkIn', filters.checkIn);
        if (filters.checkOut) searchParams.append('checkOut', filters.checkOut);


        // Chuyển hướng
        navigate(`/HotelList?${searchParams.toString()}`);
    };


    // Tạo lịch cho 2 tháng
    // Tạo lịch cho 2 tháng với nút hủy
    const generateCalendar = (startMonthOffset = 0) => {
        const today = new Date();
        const months = [];

        for (let i = 0; i < 2; i++) {
            const month = new Date(today.getFullYear(), today.getMonth() + startMonthOffset + i, 1);
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
                const selectedDate = new Date(dateStr);
                selectedDate.setHours(0, 0, 0, 0);

                const isSelected = dateStr === filters.checkIn || dateStr === filters.checkOut;
                const isToday = selectedDate.getTime() === today.getTime();
                const isPast = selectedDate < today;
                const isInRange = filters.checkIn && filters.checkOut &&
                    selectedDate > new Date(filters.checkIn) &&
                    selectedDate < new Date(filters.checkOut);

                days.push(
                    <div
                        key={dateStr}
                        className={`calendar-day ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''} ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}`}
                        onClick={() => {
                            if (!isPast) handleDateSelect(dateStr);
                        }}
                        style={{
                            padding: '8px',
                            cursor: isPast ? 'not-allowed' : 'pointer',
                            borderRadius: '4px',
                            backgroundColor: isSelected ? '#007bff' : isInRange ? '#e3f2fd' : isToday ? '#f0f0f0' : isPast ? '#f5f5f5' : 'transparent',
                            color: isSelected ? 'white' : isToday ? '#007bff' : isPast ? '#ccc' : 'black',
                            border: isToday ? '1px solid #007bff' : 'none',
                            position: 'relative',
                            fontWeight: isToday ? 'bold' : 'normal',
                            opacity: isPast ? 0.6 : 1
                        }}
                    >
                        {day}
                        {isSelected && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    background: '#ff4444',
                                    color: 'white',
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    fontSize: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (dateStr === filters.checkIn) {
                                        setFilters(prev => ({ ...prev, checkIn: "" }));
                                        toast.info("Đã hủy ngày nhận phòng");
                                    } else if (dateStr === filters.checkOut) {
                                        setFilters(prev => ({ ...prev, checkOut: "" }));
                                        toast.info("Đã hủy ngày trả phòng");
                                    }
                                }}
                                title="Hủy chọn ngày này"
                            >
                                ✕
                            </div>
                        )}
                    </div>
                );
            }

            months.push(
                <div key={i} style={{ marginRight: '20px' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '10px',
                        padding: '0 10px'
                    }}>
                        <h4 style={{ textAlign: 'center', margin: 0, fontSize: '16px', fontWeight: '600' }}>
                            {monthName}
                        </h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                            <div key={day} style={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                color: '#666',
                                padding: '5px'
                            }}>
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

    // Thêm state cho monthOffset
    const [monthOffset, setMonthOffset] = useState(0);

    // Thêm hàm chuyển tháng
    const handleMonthChange = (direction) => {
        if (direction === 'prev' && monthOffset > 0) {
            setMonthOffset(prev => prev - 1);
        } else if (direction === 'next') {
            setMonthOffset(prev => prev + 1);
        }
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
        minWidth: '180px',
        marginRight: '10px'

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

    

    const dropdownItemStyle = {
        padding: '8px',
        cursor: 'pointer',
        borderBottom: '1px solid #eee',
        fontFamily: "'Outfit', sans-serif"
    };

    return (
        <div className="container container-1200" style={{ fontFamily: "'Outfit', sans-serif", zIndex: '1' }}>
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
                            <div
                                style={{
                                    ...dropdownItemStyle,
                                }}
                                onClick={() => handleOptionSelect('destination', "")}
                            >
                                Chọn điểm đến
                            </div>
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
                    <span className="title">Thể loại</span>
                    <div
                        style={dropdownStyle}
                        onClick={() => setShowDropdown(showDropdown === 'roomType' ? null : 'roomType')}
                    >
                        {filters.roomType || "Chọn thể loại"}
                    </div>

                    {showDropdown === 'roomType' && (
                        <div style={dropdownMenuStyle}>
                            <div
                                style={{
                                    ...dropdownItemStyle,
                                }}
                                onClick={() => handleOptionSelect('roomType', "")}
                            >
                                Chọn thể loại
                            </div>
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
                    <div className="search-bar-date-picker">
                        {/* Header với thông tin và nút hủy */}
                        <div className="search-bar-date-header">
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, color: '#333' }}>
                                    {showDatePicker === 'checkIn' ? 'Chọn ngày nhận phòng' : 'Chọn ngày trả phòng'}
                                </h3>
                                <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
                                    {filters.checkIn && (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ fontSize: '12px', color: '#666' }}>Nhận:</span>
                                            <span style={{
                                                marginLeft: '5px',
                                                backgroundColor: '#e3f2fd',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                {new Date(filters.checkIn).toLocaleDateString('vi-VN')}
                                                <button
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ff4444',
                                                        cursor: 'pointer',
                                                        marginLeft: '8px',
                                                        fontSize: '14px',
                                                        padding: '2px'
                                                    }}
                                                    onClick={() => {
                                                        setFilters(prev => ({ ...prev, checkIn: "" }));
                                                        toast.info("Đã hủy ngày nhận phòng");
                                                    }}
                                                    title="Hủy ngày nhận phòng"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        </div>
                                    )}
                                    {filters.checkOut && (
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ fontSize: '12px', color: '#666' }}>Trả:</span>
                                            <span style={{
                                                marginLeft: '5px',
                                                backgroundColor: '#ffeaea',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                {new Date(filters.checkOut).toLocaleDateString('vi-VN')}
                                                <button
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ff4444',
                                                        cursor: 'pointer',
                                                        marginLeft: '8px',
                                                        fontSize: '14px',
                                                        padding: '2px'
                                                    }}
                                                    onClick={() => {
                                                        setFilters(prev => ({ ...prev, checkOut: "" }));
                                                        toast.info("Đã hủy ngày trả phòng");
                                                    }}
                                                    title="Hủy ngày trả phòng"
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="search-bar-date-close-btn" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button
                                    onClick={() => setShowDatePicker(null)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: '#f8f9fa',
                                        color: '#333',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: '500'
                                    }}
                                >
                                    ✕ Đóng
                                </button>
                            </div>
                        </div>

                        {/* Nút chuyển tháng */}
                        <div className="search-bar-month-nav">
                            <button
                                onClick={() => handleMonthChange('prev')}
                                disabled={monthOffset === 0}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: monthOffset === 0 ? '#f5f5f5' : '#007bff',
                                    color: monthOffset === 0 ? '#999' : 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: monthOffset === 0 ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                            >
                                <span>‹</span> Tháng trước
                            </button>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '14px',
                                color: '#666'
                            }}>
                                <button
                                    onClick={() => setMonthOffset(0)}
                                    style={{
                                        padding: '6px 12px',
                                        backgroundColor: monthOffset === 0 ? '#007bff' : '#f8f9fa',
                                        color: monthOffset === 0 ? 'white' : '#333',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: '500'
                                    }}
                                >
                                    Quay lại hiện tại
                                </button>
                            </div>

                            <button
                                onClick={() => handleMonthChange('next')}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                            >
                                Tháng sau <span>›</span>
                            </button>
                        </div>

                        {/* Lịch */}
                        <div className="search-bar-calendar-grid">
                            {generateCalendar(monthOffset)}
                        </div>

                        {/* Hướng dẫn */}
                        <div className="search-bar-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#007bff',
                                        borderRadius: '4px',
                                        marginRight: '8px'
                                    }}></div>
                                    <span>Ngày đã chọn</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#e3f2fd',
                                        borderRadius: '4px',
                                        marginRight: '8px'
                                    }}></div>
                                    <span>Khoảng thời gian</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#f0f0f0',
                                        border: '1px solid #007bff',
                                        borderRadius: '4px',
                                        marginRight: '8px'
                                    }}></div>
                                    <span>Hôm nay</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: '4px',
                                        marginRight: '8px',
                                        opacity: 0.6
                                    }}></div>
                                    <span>Ngày đã qua</span>
                                </div>
                            </div>
                        </div>

                        {/* Nút hành động */}
                        <div style={{
                            marginTop: '20px',
                            textAlign: 'center',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '15px'
                        }}>
                            <button
                                onClick={() => {
                                    setFilters(prev => ({
                                        ...prev,
                                        checkIn: "",
                                        checkOut: ""
                                    }));
                                    setMonthOffset(0);
                                    toast.info("Đã hủy tất cả ngày đã chọn");
                                }}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#ff4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    minWidth: '120px'
                                }}
                            >
                                Hủy tất cả
                            </button>
                            <button
                                onClick={() => setShowDatePicker(null)}
                                style={{
                                    padding: '10px 30px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    minWidth: '120px'
                                }}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                )}



                {/* Search Button */}
                <div className="search-button">
                    <input
                        className="w-50 p-1 "
                        type="text"
                        placeholder="Search"
                        maxLength={13}
                        value={filters.searchTerm}
                        onChange={handleSearchInput}

                    />

                    <button
                        className="theme-btn w-50"
                        style={{ marginLeft: '20px', height: '50px', marginTop: '10px' }}
                        onClick={handleSearch}
                    >
                        <span data-hover="Tìm kiếm" style={{ fontSize: '15px' }}>Tìm kiếm</span>
                        <i className="far fa-search"></i>
                    </button>
                </div>

            </div>
        </div>
    )
}

export default SearchBar