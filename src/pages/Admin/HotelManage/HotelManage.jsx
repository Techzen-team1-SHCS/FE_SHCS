import React, { useEffect, useState } from 'react';
import styles from './HotelManage.module.css';
import { hotelService } from '../../../services/hotelService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const HotelManage = () => {
    const {
        container,
        header,
        title,
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
    const [isEditMode, setIsEditMode] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        province: '',
        price: '',
        hotel_class: '',
        description: '',
        text: '',
        amenities: '',
        name_nearby_place: ''
    });

    // Fetch hotels
    const fetchHotels = async () => {
        try {
            const response = await hotelService.getAllHotels();
            setHotelsData(response || []);
        } catch (error) {
            console.error('Fetch hotels error:', error);
            toast.error('Không thể tải danh sách khách sạn');
            setHotelsData([]);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    // Handle View
    const handleView = async (hotelId) => {
        try {
            setIsLoading(true);
            const hotel = await hotelService.getHotelById(hotelId);

            if (!hotel) {
                toast.error("Không lấy được thông tin khách sạn");
                return;
            }
            
            setSelectedHotel(hotel);
            setIsSidebarOpen(true);
            setIsEditMode(false); // Đảm bảo không ở chế độ edit khi view
        } catch (error) {
            console.error("Hotel detail error:", error);
            toast.error(error.response?.data?.message || "Lỗi tải thông tin khách sạn!");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Edit
    const handleEdit = (hotelId) => {
        handleView(hotelId); // Mở sidebar trước
        // Sau khi mở sidebar, kích hoạt edit mode
        setTimeout(() => {
            startEditMode();
        }, 100);
    };

    // Bắt đầu chế độ chỉnh sửa
    const startEditMode = () => {
        if (!selectedHotel) return;
        
        // Chuyển amenities từ array sang string
        const amenitiesString = Array.isArray(selectedHotel.amenities) 
            ? selectedHotel.amenities.join(', ') 
            : selectedHotel.amenities || '';
        
        setEditForm({
            name: selectedHotel.name || '',
            province: selectedHotel.province || '',
            price: selectedHotel.price || '',
            hotel_class: selectedHotel.hotel_class ? (selectedHotel.hotel_class / 10).toString() : '', // Chia 10 để hiển thị 1-5
            description: selectedHotel.description || '',
            text: selectedHotel.text || '',
            amenities: amenitiesString,
            name_nearby_place: selectedHotel.name_nearby_place || ''
        });
        
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

            // Prepare data
            const updateData = {
                name: editForm.name,
                province: editForm.province,
                price: Number(editForm.price),
                hotel_class: Math.round(Number(editForm.hotel_class) * 10), // Nhân 10 để lưu theo thang 100
                description: editForm.description,
                text: editForm.text,
                name_nearby_place: editForm.name_nearby_place,
                amenities: editForm.amenities 
                    ? editForm.amenities.split(',').map(item => item.trim()).filter(item => item)
                    : []
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
            
            // Update state
            setHotelsData(prev => prev.map(hotel => 
                hotel.id === selectedHotel.id 
                    ? { ...hotel, ...updateData }
                    : hotel
            ));
            
            // Update selected hotel
            setSelectedHotel(prev => ({
                ...prev,
                ...updateData
            }));
            
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

    const getStatusBadge = (hotel) => {
        if (!hotel?.rooms) return statusAvailable;
        
        const totalRooms = hotel.rooms.reduce((total, room) => total + (room.quantity || 0), 0) || 0;
        const occupiedRooms = hotel.rooms.reduce((total, room) => total + (room.occupied || 0), 0) || 0;
        
        if (occupiedRooms === 0) return statusAvailable;
        if (occupiedRooms === totalRooms) return statusOccupied;
        return statusAvailable;
    };

    const getStatusText = (hotel) => {
        if (!hotel?.rooms) return "Trống";
        
        const totalRooms = hotel.rooms.reduce((total, room) => total + (room.quantity || 0), 0) || 0;
        const occupiedRooms = hotel.rooms.reduce((total, room) => total + (room.occupied || 0), 0) || 0;
        
        if (occupiedRooms === 0) return "Trống";
        if (occupiedRooms === totalRooms) return "Hết phòng";
        return "Còn phòng";
    };

    const renderStars = (rating) => {
        const stars = [];
        const starRating = rating / 10;
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span key={i} style={{ color: i <= starRating ? '#ffc107' : '#e4e5e9' }}>
                    ★
                </span>
            );
        }
        return stars;
    };

    const getRoomStats = (hotel) => {
        if (!hotel?.rooms) return { totalRooms: 0, occupiedRooms: 0, availableRooms: 0 };
        
        const totalRooms = hotel.rooms.reduce((total, room) => total + (room.quantity || 0), 0) || 0;
        const occupiedRooms = hotel.rooms.reduce((total, room) => total + (room.occupied || 0), 0) || 0;
        const availableRooms = totalRooms - occupiedRooms;
        
        return { totalRooms, occupiedRooms, availableRooms };
    };

    return (
        <div className={container}>
            <div className={header}>
                <h1 className={title}>Quản lý khách sạn</h1>
            </div>
            
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
                                                    src={hotel?.images?.[0]?.url || '/default-hotel.jpg'} 
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
                                                <div className={statValue}>
                                                    {getRoomStats(hotel).totalRooms}
                                                </div>
                                                <div className={statLabel}>Tổng phòng</div>
                                            </div>
                                            <div className={statItem}>
                                                <div className={statValue}>
                                                    {formatCurrency(hotel?.price)}
                                                </div>
                                                <div className={statLabel}>Giá từ</div>
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
                                                {hotel?.hotel_class ? (hotel.hotel_class / 10) : 0}/5
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
                                        <label className={formLabel}>Hạng sao (1-5)</label>
                                        <input
                                            type="number"
                                            name="hotel_class"
                                            value={editForm.hotel_class}
                                            onChange={handleInputChange}
                                            className={formControl}
                                            placeholder="1-5"
                                            min="1"
                                            max="5"
                                            step="0.5"
                                        />
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
                                        <label className={formLabel}>Tiện nghi (phân cách bằng dấu phẩy)</label>
                                        <textarea
                                            name="amenities"
                                            value={editForm.amenities}
                                            onChange={handleInputChange}
                                            className={formTextarea}
                                            placeholder="Ví dụ: Wifi, Hồ bơi, Gym, ..."
                                            rows="3"
                                        />
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
                                            src={selectedHotel?.images?.[0]?.url || '/default-hotel.jpg'} 
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
                                                    ({selectedHotel.hotel_class ? (selectedHotel.hotel_class / 10) : 0}/5)
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
                                    {selectedHotel.amenities && selectedHotel.amenities.length > 0 && (
                                        <div className={detailSection}>
                                            <h3 className={detailTitle}>Tiện nghi</h3>
                                            <div className={amenitiesList}>
                                                {Array.isArray(selectedHotel.amenities) 
                                                    ? selectedHotel.amenities.map((amenity, index) => (
                                                        <div key={index} className={amenityItem}>
                                                            {amenity}
                                                        </div>
                                                    ))
                                                    : <div className={textContent}>{selectedHotel.amenities}</div>
                                                }
                                            </div>
                                        </div>
                                    )}

                                    {/* Thống kê phòng */}
                                    <div className={detailSection}>
                                        <h3 className={detailTitle}>Thống kê phòng</h3>
                                        <div className={detailGrid}>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Tổng số phòng</div>
                                                <div className={detailValue}>{getRoomStats(selectedHotel).totalRooms}</div>
                                            </div>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Phòng trống</div>
                                                <div className={detailValue}>{getRoomStats(selectedHotel).availableRooms}</div>
                                            </div>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Phòng đã đặt</div>
                                                <div className={detailValue}>{getRoomStats(selectedHotel).occupiedRooms}</div>
                                            </div>
                                            <div className={detailItem}>
                                                <div className={detailLabel}>Trạng thái</div>
                                                <div className={detailValue}>
                                                    <span className={`${statusBadge} ${getStatusBadge(selectedHotel)}`}>
                                                        {getStatusText(selectedHotel)}
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