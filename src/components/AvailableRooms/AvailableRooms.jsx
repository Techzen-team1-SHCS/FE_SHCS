import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { AuthContext } from '../../contexts/AuthContext';
import '../../config/echo';
import { toast } from 'react-toastify';
import LoaderButton from '../Loading/LoaderButton';
import { 
  FaCheck, 
  FaUsers, 
  FaHotel, 
  FaMoneyBillWave,
  FaShoppingCart,
  FaCalendarAlt,
  FaArrowRight,
  FaExclamationTriangle,
  FaStar,
  FaWifi,
  FaCar,
  FaSwimmingPool,
  FaUtensils,
  FaParking,
  FaConciergeBell
} from 'react-icons/fa';
import './AvailableRooms.css'; // Tạo file CSS riêng


const AvailableRooms = ({ availableRooms, onRoomSelect, searchParams }) => {
  const [selectedRooms, setSelectedRooms] = useState({});
  const [loading, setLoading] = useState({});
  const [roomQuantities, setRoomQuantities] = useState({});
  const [lockedRoomId, setLockedRoomId] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Tối ưu hóa với useMemo
  const nights = useMemo(() => searchParams?.nights || 0, [searchParams?.nights]);
  const userId = useMemo(() => user?.id, [user?.id]);
  const roomsToDisplay = useMemo(() => {
    return Array.isArray(availableRooms) ? availableRooms : [];
  }, [availableRooms]);

  // Amenities icons mapping
  const amenityIcons = {
    'WiFi': <FaWifi />,
    'Parking': <FaParking />,
    'Swimming pool': <FaSwimmingPool />,
    'Restaurant': <FaUtensils />,
    'Room service': <FaConciergeBell />,
    '24h front desk': <FaConciergeBell />,
    'Spa': <FaStar />,
    'Fitness center': <FaStar />,
    'Sea view': <FaStar />,
    'Balcony': <FaStar />,
  };

  // WebSocket connection
  useEffect(() => {
    if (!window.Echo) {
      console.error('❌ Echo không tồn tại');
      return;
    }

    const channel = window.Echo.channel('room-updates');
    
    channel.listen('RoomQuantityUpdated', (e) => {
      setRoomQuantities(prev => ({
        ...prev,
        [e.roomId]: e.availableQuantity
      }));
    });

    return () => {
      window.Echo.leaveChannel('room-updates');
    };
  }, []);

  const handleQuantityChange = useCallback((roomId, quantity) => {
    const qty=parseInt(quantity);
    setSelectedRooms(prev => ({
      ...prev,
      [roomId]: parseInt(quantity)
    }));
    if (qty > 0) {
      setLockedRoomId(roomId);   // 🔥 Khóa phòng khác
    } else {
      setLockedRoomId(null);     // 🔥 Mở khóa khi trả về 0
    }
  }, []);

  const handleSelectRoom = useCallback(async (room) => {
    const quantity = selectedRooms[room.id] || 0;
    
    if (quantity === 0) {
      toast.warn('Vui lòng chọn số lượng phòng');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, [room.id]: true }));

      if (!userId) {
        toast.warn('Vui lòng đăng nhập để đặt phòng');
        navigate('/login');
        return;
      }

      const bookingData = {
        user_id: userId,
        room_id: room.id,
        check_in: searchParams.checkIn,
        check_out: searchParams.checkOut,
        quantity: quantity
      };

      const result = await bookingService.createBooking(bookingData);

      if (result.success) {
        toast.success('🎉 Đặt phòng thành công!');
        
        setRoomQuantities(prev => ({
          ...prev,
          [room.id]: result.available_quantity
        }));

        navigate(`/booking/${result.data.id}`);
        
      } else {
        throw new Error(result.message || 'Đặt phòng thất bại');
      }

    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Đặt phòng thất bại');
    } finally {
      setLoading(prev => ({ ...prev, [room.id]: false }));
    }
  }, [selectedRooms, userId, searchParams, navigate]);

  const getAmenities = useCallback((amenities) => {
    if (!amenities) return [];
    
    try {
      if (typeof amenities === 'string') {
        return JSON.parse(amenities);
      }
      if (Array.isArray(amenities)) {
        return amenities;
      }
      return [];
    } catch (error) {
      console.error('Error parsing amenities:', error);
      return [];
    }
  }, []);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  }, []);

  const getAmenityIcon = (amenity) => {
    const foundKey = Object.keys(amenityIcons).find(key => 
      amenity.toLowerCase().includes(key.toLowerCase())
    );
    return foundKey ? amenityIcons[foundKey] : <FaCheck />;
  };

  const renderRoomCard = useCallback((room) => {
    const amenities = getAmenities(room.amenities);
    const quantity = selectedRooms[room.id] || 0;
    const totalPrice = room.price * nights * quantity;
    const availableQuantity = roomQuantities[room.id] || room.quantity;
    const maxSelectable = Math.min(availableQuantity, 5);
    const isLowStock = availableQuantity < 3 && availableQuantity > 0;
    const isOutOfStock = availableQuantity === 0;

    return (
      <div key={room.id} className="room-card">
        <div className="room-card-header">
          <div className="room-type-info">
            <h4 className="room-title">{room.room_type}</h4>
            <div className="room-meta">
              <span className="room-meta-item">
                <FaUsers className="meta-icon" />
                {room.max_guest} người
              </span>
              <span className="room-meta-item">
                <FaHotel className="meta-icon" />
                Còn <span className={`stock-count ${isLowStock ? 'low' : ''} ${isOutOfStock ? 'out' : ''}`}>
                  {availableQuantity}
                </span> phòng
              </span>
            </div>
          </div>
          <div className="room-price-section">
            <div className="room-price">
              <div className="price-per-night">
                {formatPrice(room.price * nights)}
                <span className="price-label">/{nights} đêm</span>
              </div>
              {quantity > 0 && (
                <div className="selected-price">
                  <FaMoneyBillWave className="total-icon" />
                  <span className="total-amount">{formatPrice(totalPrice)}</span>
                  <div className="price-breakdown">
                    ({quantity} phòng × {nights} đêm)
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {amenities.length > 0 && (
          <div className="room-amenities">
            <div className="amenities-title">Tiện nghi:</div>
            <div className="amenities-list">
              {amenities.slice(0, 4).map((amenity, index) => (
                <div key={index} className="amenity-item">
                  {getAmenityIcon(amenity)}
                  <span>{amenity}</span>
                </div>
              ))}
              {amenities.length > 4 && (
                <div className="amenity-more">
                  +{amenities.length - 4} khác
                </div>
              )}
            </div>
          </div>
        )}

        <div className="room-card-footer">
          <div className="quantity-selector">
            <label className="quantity-label">Số lượng:</label>
            <select
              value={quantity}
              onChange={(e) => handleQuantityChange(room.id, e.target.value)}
              className="quantity-select"
              disabled={
                isOutOfStock ||
                (lockedRoomId !== null && lockedRoomId !== room.id)  // 🔥 phòng khác bị khóa
              }
            >
              <option value="0">Chọn</option>
              {[...Array(maxSelectable)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} phòng
                </option>
              ))}
            </select>
            {isLowStock && (
              <div className="stock-warning">
                <FaExclamationTriangle />
                Chỉ còn {availableQuantity} phòng
              </div>
            )}
            {isOutOfStock && (
              <div className="stock-warning out">
                <FaExclamationTriangle />
                Đã hết phòng
              </div>
            )}
          </div>

          <button
            className={`book-button ${quantity > 0 ? 'active' : ''}`}
            onClick={() => handleSelectRoom(room)}
            disabled={
              !quantity ||
              loading[room.id] ||
              isOutOfStock ||
              (lockedRoomId !== null && lockedRoomId !== room.id) // 🔥 khóa phòng khác
            }
          >
            {loading[room.id] ? (
              <LoaderButton />
            ) : isOutOfStock ? (
              <>
                <FaExclamationTriangle />
                Hết phòng
              </>
            ) : (
              <>
                <FaShoppingCart />
                {quantity > 0 ? `Đặt ${quantity} phòng` : 'Chọn phòng'}
                <FaArrowRight className="button-arrow" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }, [selectedRooms, nights, roomQuantities, loading, handleQuantityChange, handleSelectRoom, getAmenities, formatPrice]);

  // Render summary
  const selectedCount = useMemo(() => {
    return Object.values(selectedRooms).reduce((sum, qty) => sum + qty, 0);
  }, [selectedRooms]);

  return (
    <div className="available-rooms-container">
      {/* Header Section */}
      <div className="rooms-header">
        <div className="header-left">
          <h2 className="section-title-available">
            <FaHotel className="title-icon" />
            Phòng Có Sẵn
          </h2>
          <div className="booking-info">
            <div className="info-item">
              <FaCalendarAlt className="info-icon" />
              <span>{nights} đêm</span>
            </div>
            <div className="info-item">
              <FaHotel className="info-icon" />
              <span>{roomsToDisplay.length} loại phòng</span>
            </div>
          </div>
        </div>
        
        {selectedCount > 0 && (
          <div className="selected-summary">
            <div className="summary-badge">
              <FaShoppingCart />
              <span>Đã chọn {selectedCount} phòng</span>
            </div>
          </div>
        )}
      </div>

      {/* Rooms List */}
      {roomsToDisplay.length === 0 ? (
        <div className="no-rooms-state">
          <div className="no-rooms-icon">🏨</div>
          <h3>Không có phòng trống</h3>
          <p>Không tìm thấy phòng trống cho khoảng thời gian bạn chọn.</p>
          <button 
            className="change-dates-button"
            onClick={() => navigate('/search')}
          >
            <FaCalendarAlt />
            Thay đổi ngày
          </button>
        </div>
      ) : (
        <div className="rooms-grid">
          {roomsToDisplay.map(renderRoomCard)}
        </div>
      )}

      {/* Footer Tips */}
      {roomsToDisplay.length > 0 && (
        <div className="rooms-footer-tips">
          <div className="tip-card">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <strong>Mẹo nhỏ:</strong> Đặt sớm để được giá tốt nhất và đảm bảo phòng ưng ý!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AvailableRooms);