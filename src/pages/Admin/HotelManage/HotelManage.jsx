import React, { useEffect, useState } from 'react';
import styles from './HotelManage.module.css';
import { hotelService } from '../../../services/hotelService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import PartLoading from '../../../components/Loading/PartLoading';

const HotelManage = () => {
    const {
        container,
        tableContainer,
        table,
        tableHeader,
        th,
        tableBody,
        tr,
        td,
        actionCell,
        actionButton,
        viewButton,
        editButton,
        deleteButton,
        buttonGroup,
        buttonIcon,
        statusBadge,
        statusAvailable,
        statusOccupied,
        hotelImage,
        imageContainer,
        hotelInfo,
        hotelName,
        hotelLocation,
        statsContainer,
        statItem,
        statValue,
        statLabel,
        sidebar,
        sidebarOpen,
        sidebarOverlay,
        sidebarHeader,
        sidebarTitle,
        closeButton,
        sidebarContent,
        image2Container,
        detailSection,
        detailTitle,
        detailGrid,
        detailItem,
        detailLabel,
        detailValue,
        amenitiesList,
        amenityItem,
        textContent,
        timestamp,
        // Thêm các style mới cho form
        formContainer,
        formGroup,
        formLabel,
        formControl,
        formTextarea,
        formActions,
        btnPrimary,
        btnSecondary,
        btnDanger,
        editMode,
        viewMode
    } = styles;

    const [hotelsData, setHotelsData] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        province: '',
        price: '',
        hotel_class: '',
        description: '',
        text: '',
        amenities: [],
        name_nearby_place: ''
    });
    const [newAmenity, setNewAmenity] = useState('');

    // Fetch hotels
    const fetchHotels = async () => {
        try {
            setLoading(true);
            const response = await hotelService.getAllHotels();
            setHotelsData(response || []);
        } catch (error) {
            console.error('Fetch hotels error:', error);
            toast.error('Không thể tải danh sách khách sạn');
            setHotelsData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    // Xử lý hotel_class từ server (có thể là 40 = 4 sao, hoặc 4 = 4 sao)
    const parseHotelClassFromServer = (hotelClass) => {
        if (!hotelClass) return '';
        
        // Nếu giá trị >= 10, chia cho 10 để lấy số sao
        if (hotelClass >= 10) {
            return (hotelClass / 10).toString();
        }
        // Ngược lại, trả về giá trị gốc
        return hotelClass.toString();
    };

    // Format hotel_class để gửi lên server (luôn gửi giá trị 1-5)
    const formatHotelClassForServer = (hotelClass) => {
        const value = parseFloat(hotelClass);
        if (isNaN(value) || value < 1 || value > 5) {
            return 0;
        }
        return value;
    };

    // Handle View
    const handleView = async (hotelId, shouldEdit = false) => {
        try {
            setIsLoading(true);
            const hotel = await hotelService.getHotelById(hotelId);

            if (!hotel) {
                toast.error("Không lấy được thông tin khách sạn");
                return;
            }
            
            setSelectedHotel(hotel);
            setIsSidebarOpen(true);
            
            // Nếu là edit mode, load dữ liệu vào form
            if (shouldEdit) {
                setTimeout(() => {
                    const amenitiesArray = Array.isArray(hotel.amenities) ? hotel.amenities : [];
                    setEditForm({
                        name: hotel.name || '',
                        province: hotel.province || '',
                        price: hotel.price || '',
                        hotel_class: parseHotelClassFromServer(hotel.hotel_class), // Sử dụng hàm parse
                        description: hotel.description || '',
                        text: hotel.text || '',
                        amenities: amenitiesArray,
                        name_nearby_place: hotel.name_nearby_place || ''
                    });
                    setNewAmenity('');
                    setIsEditMode(true);
                }, 100);
            } else {
                setIsEditMode(false);
            }
        } catch (error) {
            console.error("Hotel detail error:", error);
            toast.error(error.response?.data?.message || "Lỗi tải thông tin khách sạn!");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Edit
    const handleEdit = (hotelId) => {
        handleView(hotelId, true);
    };

    // Bắt đầu chế độ chỉnh sửa
    const startEditMode = () => {
        if (!selectedHotel) return;
        
        setEditForm({
            name: selectedHotel.name || '',
            province: selectedHotel.province || '',
            price: selectedHotel.price || '',
            hotel_class: parseHotelClassFromServer(selectedHotel.hotel_class), // Sử dụng hàm parse
            description: selectedHotel.description || '',
            text: selectedHotel.text || '',
            amenities: Array.isArray(selectedHotel.amenities) ? selectedHotel.amenities : [],
            name_nearby_place: selectedHotel.name_nearby_place || ''
        });
        setNewAmenity('');
        setIsEditMode(true);
    };

    // Handle Delete
    const handleDelete = async (hotelId) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc muốn xóa khách sạn này?',
                text: "Hành động này không thể hoàn tác!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy',
            });

            if (!result.isConfirmed) return;
            
            const res = await hotelService.getDeleteHotel(hotelId);

            if (res.status === 200) {
                // Update state
                setHotelsData(prev => prev.filter(h => h.id !== hotelId));

                // Close Sidebar nếu đang xem hotel này
                if (selectedHotel?.id === hotelId) {
                    setSelectedHotel(null);
                    setIsSidebarOpen(false);
                }

                // Show success message
                Swal.fire(
                    'Đã xóa!',
                    res.message,
                    'success'
                );
                fetchHotels();
            }

        } catch (error) {
            console.error("Delete hotel error:", error);
            Swal.fire(
                'Lỗi!',
                error.response?.data?.message || 'Xóa thất bại, thử lại sau',
                'error'
            );
        }
    };

    // Handle Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Thêm tiện nghi mới
    const handleAddAmenity = () => {
        const trimmed = newAmenity.trim();
        if (!trimmed) {
            toast.error("Vui lòng nhập tiện nghi");
            return;
        }
        
        if (editForm.amenities.includes(trimmed)) {
            toast.error("Tiện nghi này đã tồn tại");
            return;
        }
        
        setEditForm(prev => ({
            ...prev,
            amenities: [...prev.amenities, trimmed]
        }));
        setNewAmenity('');
    };

    // Xóa tiện nghi
    const handleRemoveAmenity = (index) => {
        setEditForm(prev => ({
            ...prev,
            amenities: prev.amenities.filter((_, i) => i !== index)
        }));
    };

    // Handle Update
    const handleUpdate = async () => {
        try {
            if (!selectedHotel) return;

            // Validate
            if (!editForm.name.trim()) {
                toast.error("Tên khách sạn không được để trống");
                return;
            }

            if (!editForm.price || editForm.price <= 0) {
                toast.error("Giá phải lớn hơn 0");
                return;
            }

            // Validate và format hotel_class
            const starRating = formatHotelClassForServer(editForm.hotel_class);
            if (starRating === 0) {
                toast.error("Hạng sao phải từ 1 đến 5");
                return;
            }

            // Prepare data - QUAN TRỌNG: Chỉ gửi giá trị sao thực (1-5)
            const updateData = {
                name: editForm.name,
                province: editForm.province,
                price: Number(editForm.price),
                hotel_class: starRating, // Chỉ gửi giá trị 1-5
                description: editForm.description,
                text: editForm.text,
                name_nearby_place: editForm.name_nearby_place,
                amenities: editForm.amenities // Giữ dưới dạng array
            };

            // Show loading
            Swal.fire({
                title: 'Đang cập nhật...',
                text: 'Vui lòng chờ trong giây lát',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Call API
            const response = await hotelService.updateHotel(selectedHotel.id, updateData);
            
            // Cập nhật hiển thị hotel_class cho state (giữ nguyên định dạng server)
            const updatedHotelData = {
                ...selectedHotel,
                ...updateData,
                // Cập nhật để hiển thị đúng trên UI
                hotel_class: starRating * 10 // Hoặc starRating tùy server
            };
            
            // Update state
            setHotelsData(prev => prev.map(hotel => 
                hotel.id === selectedHotel.id 
                    ? updatedHotelData
                    : hotel
            ));
            
            // Update selected hotel
            setSelectedHotel(updatedHotelData);
            
            // Exit edit mode
            setIsEditMode(false);
            
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: response.message || 'Cập nhật khách sạn thành công',
                timer: 2000,
                showConfirmButton: false
            });
            
            // Refresh list
            fetchHotels();
            
        } catch (error) {
            console.error("Update error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: error.response?.data?.message || 'Cập nhật thất bại, vui lòng thử lại',
                confirmButtonText: 'OK'
            });
        }
    };

    const amenities = Array.isArray(selectedHotel?.amenities)
        ? selectedHotel.amenities
        : (() => {
            try {
                return JSON.parse(selectedHotel?.amenities || "[]");
            } catch (e) {
                return [];
            }
        })();

    // Handle Cancel Edit
    const handleCancelEdit = () => {
        setIsEditMode(false);
    };

    // Close Sidebar
    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedHotel(null);
        setIsEditMode(false);
    };

    // Helper functions
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Hiển thị số sao đúng (từ hotel_class của server)
    const renderStars = (hotelClass) => {
        // Tính số sao thực từ hotel_class
        let starRating;
        if (hotelClass >= 10) {
            starRating = hotelClass / 10; // Nếu là 40 thì thành 4
        } else {
            starRating = hotelClass; // Nếu là 4 thì giữ nguyên
        }
        
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= starRating ? '#ffc107' : '#e4e5e9' }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    // Hiển thị số sao dạng text
    const getStarText = (hotelClass) => {
        let starRating;
        if (hotelClass >= 10) {
            starRating = hotelClass / 10;
        } else {
            starRating = hotelClass;
        }
        return starRating ? `${starRating}/5` : '0/5';
    };

    const getStatusBadge = (hotel) => {
        if (!hotel?.rooms) return statusAvailable;
        
        const totalRooms = hotel.rooms.reduce((total, room) => total + (room.quantity || 0), 0) || 0;
        const occupiedRooms = hotel.rooms.reduce((total, room) => total + (room.occupied || 0), 0) || 0;
        
        if (occupiedRooms === 0) return statusAvailable;
        if (30-totalRooms===0) return statusOccupied;
        return statusAvailable;
    };

    const getStatusText = (hotel) => {
        if (!hotel?.rooms) return "Trống";
        
        const totalRooms = hotel.rooms.reduce((total, room) => total + (room.quantity || 0), 0) || 0;
        const occupiedRooms = hotel.rooms.reduce((total, room) => total + (room.occupied || 0), 0) || 0;
        
        if (occupiedRooms === 0) return "Trống";
        if (30-totalRooms===0) return "Hết phòng";
        return "Còn phòng";
    };

    const getRoomStats = (hotel) => {
        if (!hotel?.rooms) return { totalRooms: 0, occupiedRooms: 0, availableRooms: 0 };
        
        const totalRooms = hotel.rooms.reduce((total, room) => total + (room.quantity || 0), 0) || 0;
        const occupiedRooms = hotel.rooms.reduce((total, room) => total + (room.occupied || 0), 0) || 0;
        const availableRooms = totalRooms - occupiedRooms;

        return { totalRooms, occupiedRooms, availableRooms };
    };

    if (loading) {
        return <div className='mt-40'><PartLoading /></div>;
    }

    return (
        <div className={container}>
            <div className={tableContainer}>
                <table className={table}>
                    <thead className={tableHeader}>
                        <tr>
                            <th className={th}>Khách sạn</th>
                            <th className={th}>Địa điểm</th>
                            <th className={th}>Thông tin</th>
                            <th className={th}>Trạng thái</th>
                            <th className={th}>Đánh giá</th>
                            <th className={th}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className={tableBody}>
                        {hotelsData.length > 0 ? (
                            hotelsData.map((hotel) => (
                                <tr key={hotel.id} className={tr}>
                                    <td className={td}>
                                        <div className={hotelInfo}>
                                            <div className={imageContainer}>
                                                <img 
                                                    src={hotel?.firstimage?.url|| '/default-hotel.jpg'} 
                                                    alt={hotel.name}
                                                    className={hotelImage}
                                                    onError={(e) => {
                                                        e.target.src = '/default-hotel.jpg';
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <div className={hotelName}>{hotel?.name}</div>
                                                <div className={hotelLocation}>ID: {hotel.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={td}>
                                        <div className={hotelLocation}>
                                            <strong>{hotel?.province}</strong>
                                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                                {hotel?.description?.substring(0, 50)}...
                                            </div>
                                        </div>
                                    </td>
                                    <td className={td}>
                                        <div className={statsContainer}>
                                            <div className={statItem}>                                               
                                                <div className={statLabel}>Tổng phòng</div>
                                                <div className={statValue}>
                                                    30
                                                </div>
                                            </div>
                                            <div className={statItem}>
                                                <div className={statLabel}>Giá từ</div>
                                                <div className={statValue}>
                                                    {formatCurrency(hotel?.price)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={td}>
                                        <span className={`${statusBadge} ${getStatusBadge(hotel)}`}>
                                            {getStatusText(hotel)}
                                        </span>
                                    </td>
                                    <td className={td}>
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                                                {renderStars(hotel?.hotel_class)}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                {getStarText(hotel?.hotel_class)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className={td}>
                                        <div className={actionCell}>
                                            <div className={buttonGroup}>
                                                <button 
                                                    className={`${actionButton} ${viewButton}`}
                                                    onClick={() => handleView(hotel.id)}
                                                    title="Xem chi tiết"
                                                >
                                                    <span className={buttonIcon}>👁️</span>
                                                </button>
                                                <button 
                                                    className={`${actionButton} ${editButton}`}
                                                    onClick={() => handleEdit(hotel.id)}
                                                    title="Chỉnh sửa"
                                                >
                                                    <span className={buttonIcon}>✏️</span>
                                                </button>
                                                <button 
                                                    className={`${actionButton} ${deleteButton}`}
                                                    onClick={() => handleDelete(hotel.id)}
                                                    title="Xóa"
                                                >
                                                    <span className={buttonIcon}>🗑️</span>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                                    Không có khách sạn nào
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Sidebar chi tiết */}
            {isSidebarOpen && selectedHotel && (
                <>
                    <div 
                        className={sidebarOverlay}
                        onClick={handleCloseSidebar}
                    />
                    <div className={`${sidebar} ${isSidebarOpen ? sidebarOpen : ''} ${isEditMode ? editMode : viewMode}`}>
                        <div className={sidebarHeader}>
                            <h2 className={sidebarTitle}>
                                {isEditMode ? 'Chỉnh sửa khách sạn' : 'Chi tiết khách sạn'}
                            </h2>
                            <button 
                                className={closeButton}
                                onClick={handleCloseSidebar}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className={sidebarContent}>
                            {isEditMode ? (
                                // FORM CHỈNH SỬA
                                <div className={formContainer}>
                                    <div className={formGroup}>
                                        <label className={formLabel}>Tên khách sạn *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editForm.name}
                                            onChange={handleInputChange}
                                            className={formControl}
                                            placeholder="Nhập tên khách sạn"
                                        />
                                    </div>
                                    
                                    <div className={formGroup}>
                                        <label className={formLabel}>Tỉnh/Thành phố</label>
                                        <input
                                            type="text"
                                            name="province"
                                            value={editForm.province}
                                            onChange={handleInputChange}
                                            className={formControl}
                                            placeholder="Nhập tỉnh/thành phố"
                                        />
                                    </div>
                                    
                                    <div className={formGroup}>
                                        <label className={formLabel}>Giá từ (VND) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={editForm.price}
                                            onChange={handleInputChange}
                                            className={formControl}
                                            placeholder="Nhập giá"
                                            min="0"
                                        />
                                    </div>
                                    
                                    <div className={formGroup}>
                                        <label className={formLabel}>Hạng sao (1-5) *</label>
                                        <input
                                            type="number"
                                            name="hotel_class"
                                            value={editForm.hotel_class}
                                            onChange={handleInputChange}
                                            className={formControl}
                                            placeholder="Nhập từ 1 đến 5"
                                            min="1"
                                            max="5"
                                            step="0.5"
                                        />
                                        <small style={{ color: '#666', fontSize: '12px' }}>
                                            Ví dụ: 3.5 = 3.5 sao, 4 = 4 sao
                                        </small>
                                    </div>
                                    
                                    <div className={formGroup}>
                                        <label className={formLabel}>Địa điểm gần</label>
                                        <input
                                            type="text"
                                            name="name_nearby_place"
                                            value={editForm.name_nearby_place}
                                            onChange={handleInputChange}
                                            className={formControl}
                                            placeholder="Nhập địa điểm gần"
                                        />
                                    </div>
                                    
                                    <div className={formGroup}>
                                        <label className={formLabel}>Mô tả ngắn</label>
                                        <textarea
                                            name="description"
                                            value={editForm.description}
                                            onChange={handleInputChange}
                                            className={formTextarea}
                                            placeholder="Nhập mô tả ngắn"
                                            rows="3"
                                        />
                                    </div>
                                    
                                    <div className={formGroup}>
                                        <label className={formLabel}>Mô tả chi tiết</label>
                                        <textarea
                                            name="text"
                                            value={editForm.text}
                                            onChange={handleInputChange}
                                            className={formTextarea}
                                            placeholder="Nhập mô tả chi tiết"
                                            rows="5"
                                        />
                                    </div>
                                    
                                    <div className={formGroup}>
                                        <label className={formLabel}>Tiện nghi</label>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                            <input
                                                type="text"
                                                value={newAmenity}
                                                onChange={(e) => setNewAmenity(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddAmenity();
                                                    }
                                                }}
                                                className={formControl}
                                                placeholder="Nhập tiện nghi rồi nhấn Enter hoặc click Thêm"
                                                style={{ flex: 1 }}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddAmenity}
                                                className={btnPrimary}
                                                style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}
                                            >
                                                Thêm
                                            </button>
                                        </div>
                                        
                                        {/* Danh sách tiện nghi */}
                                        <div style={{ 
                                            display: 'flex', 
                                            flexWrap: 'wrap', 
                                            gap: '8px',
                                            padding: '8px',
                                            backgroundColor: '#f5f5f5',
                                            borderRadius: '4px',
                                            minHeight: '40px'
                                        }}>
                                            {editForm.amenities.length > 0 ? (
                                                editForm.amenities.map((amenity, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            backgroundColor: '#e3f2fd',
                                                            padding: '6px 12px',
                                                            borderRadius: '4px',
                                                            fontSize: '14px'
                                                        }}
                                                    >
                                                        <span>{amenity}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveAmenity(index)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#d32f2f',
                                                                cursor: 'pointer',
                                                                fontSize: '16px',
                                                                padding: '0',
                                                                display: 'flex',
                                                                alignItems: 'center'
                                                            }}
                                                            title="Xóa"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <span style={{ color: '#999', fontSize: '14px' }}>
                                                    Chưa có tiện nghi nào. Thêm tiện nghi ở trên.
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className={formActions}>
                                        <button
                                            onClick={handleCancelEdit}
                                            className={btnSecondary}
                                        >
                                            Hủy
                                        </button>
                                        <button
                                            onClick={handleUpdate}
                                            className={btnPrimary}
                                        >
                                            Lưu thay đổi
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // XEM CHI TIẾT
                                <>
                                    {/* Ảnh chính */}
                                    <div className={image2Container}>
                                        <img 
                                            src={selectedHotel?.firstimage?.url || '/default-hotel.jpg'} 
                                            alt={selectedHotel.name}
                                            className={hotelImage}
                                        />
                                    </div>

                                    {/* Thông tin cơ bản */}
                                    <div className={detailSection}>
                                        <h3 className={detailTitle}>Thông tin chung</h3>
                                        <div className={detailGrid}>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>ID</div>
                                                <div className={detailValue}>{selectedHotel.id}</div>
                                            </div>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Tên khách sạn</div>
                                                <div className={detailValue}>{selectedHotel.name}</div>
                                            </div>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Tỉnh/Thành phố</div>
                                                <div className={detailValue}>{selectedHotel.province}</div>
                                            </div>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Địa điểm gần</div>
                                                <div className={detailValue}>{selectedHotel.name_nearby_place}</div>
                                            </div>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Hạng sao</div>
                                                <div className={detailValue}>
                                                    {renderStars(selectedHotel.hotel_class)} 
                                                    ({getStarText(selectedHotel.hotel_class)})
                                                </div>
                                            </div>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Giá từ</div>
                                                <div className={detailValue}>{formatCurrency(selectedHotel.price)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mô tả ngắn */}
                                    <div className={detailSection}>
                                        <h3 className={detailTitle}>Mô tả ngắn</h3>
                                        <div className={textContent}>
                                            {selectedHotel.description}
                                        </div>
                                    </div>

                                    {/* Mô tả chi tiết */}
                                    <div className={detailSection}>
                                        <h3 className={detailTitle}>Thông tin chi tiết</h3>
                                        <div className={textContent}>
                                            {selectedHotel.text}
                                        </div>
                                    </div>

                                    {/* Tiện nghi */}
                                    {amenities.length > 0 && (
                                        <div className={detailSection}>
                                            <h3 className={detailTitle}>Tiện nghi</h3>

                                            <div className={amenitiesList}>
                                                {amenities.map((amenity, index) => (
                                                    <div key={index} className={amenityItem}>
                                                        {amenity}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Thống kê phòng */}
                                    <div className={detailSection}>
                                        <h3 className={detailTitle}>Thống kê phòng</h3>
                                        <div className={detailGrid}>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Tổng số phòng</div>
                                                <div className={detailValue}>30</div>
                                            </div>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Phòng trống</div>
                                                <div className={detailValue}>{getRoomStats(selectedHotel).totalRooms}</div>
                                            </div>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Phòng đã đặt</div>
                                                <div className={detailValue}>{30 - getRoomStats(selectedHotel).totalRooms}</div>
                                            </div>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Trạng thái</div>
                                                <div className={detailValue}>
                                                    <span className={`${statusBadge} ${getStatusBadge(selectedHotel)}`}>
                                                        {30 - getRoomStats(selectedHotel).totalRooms === 0 ? "Hết phòng" : getStatusText(selectedHotel)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thời gian */}
                                    <div className={detailSection}>
                                        <h3 className={detailTitle}>Thời gian</h3>
                                        <div className={detailGrid}>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Ngày tạo</div>
                                                <div className={timestamp}>
                                                    {formatDate(selectedHotel.created_at)}
                                                </div>
                                            </div>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Cập nhật lần cuối</div>
                                                <div className={timestamp}>
                                                    {formatDate(selectedHotel.updated_at)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nút hành động trong view mode */}
                                    <div className={formActions}>
                                        <button
                                            onClick={() => setIsEditMode(true)}
                                            className={btnPrimary}
                                        >
                                            ✏️ Chỉnh sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(selectedHotel.id)}
                                            className={btnDanger}
                                        >
                                            🗑️ Xóa khách sạn
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default HotelManage;