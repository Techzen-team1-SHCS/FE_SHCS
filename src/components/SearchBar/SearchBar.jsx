import  { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function SearchBar() {
     const [filters, setFilters] = useState({
        destination: "",
        roomType: "",
        checkIn: "",
        checkOut: "",
        guests: "",
        searchTerm: "",
        sort:"price_asc"
    });
    const [showDropdown, setShowDropdown] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(null);
    const navigate = useNavigate();

    // ✅ Fix search input
    const handleSearchInput = (e) => {
    let value = e.target.value;
     if(value.length>30){
        value=value.slice(0,30);
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
        today.setHours(0,0,0,0);
        const selectedDate = new Date(date);

        if (selectedDate <= today) {
            toast.error("❌ Không thể chọn ngày trong quá khứ");
            return;
        }

        if (showDatePicker === 'checkIn') {
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
                    <span className="title">Thể loại</span>
                    <div
                        style={dropdownStyle}
                        onClick={() => setShowDropdown(showDropdown === 'roomType' ? null : 'roomType')}
                    >
                        {filters.roomType || "Chọn thể loại"}
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
                    <input
                        className="w-50 p-1"
                        type="text"
                        placeholder="Search"
                        maxLength={13}
                        value={filters.searchTerm}
                        onChange={handleSearchInput}
                    />

                    <button
                        className="theme-btn w-50"
                        style={{ marginLeft: '20px' }}
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