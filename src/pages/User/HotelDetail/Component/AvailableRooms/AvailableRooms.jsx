import { useContext, useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../../../../services/bookingService';
import { AuthContext } from '../../../../../contexts/AuthContext';
import '../../../../../config/echo';
import { toast } from 'react-toastify';
import LoaderButton from '../../../../../components/Loading/LoaderButton';
import { 
  FaCheck, FaUsers, FaHotel, FaMoneyBillWave, FaShoppingCart,
  FaCalendarAlt, FaArrowRight, FaExclamationTriangle, FaStar,
  FaWifi, FaSwimmingPool, FaUtensils, FaParking, FaConciergeBell, FaInfoCircle
} from 'react-icons/fa';
import './AvailableRooms.css';

// Static helpers & data
const amenityIcons = {
  'WiFi': <FaWifi />, 'Parking': <FaParking />, 'Swimming pool': <FaSwimmingPool />,
  'Restaurant': <FaUtensils />, 'Room service': <FaConciergeBell />,
  '24h front desk': <FaConciergeBell />, 'Spa': <FaStar />, 
  'Fitness center': <FaStar />, 'Sea view': <FaStar />, 'Balcony': <FaStar />,
};

const getAmenityIcon = (amenity) => {
  const foundKey = Object.keys(amenityIcons).find(key => 
    amenity?.toLowerCase().includes(key.toLowerCase())
  );
  return foundKey ? amenityIcons[foundKey] : <FaCheck />;
};

const parseRobustAmenities = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data !== 'string') return [];
  try {
    if (data.trim().startsWith('[') && data.trim().endsWith(']')) return JSON.parse(data);
    return data.split(',').map(item => item.trim()).filter(Boolean);
  } catch (e) {
    return [];
  }
};

const AvailableRooms = ({ availableRooms, searchParams }) => {
  const [selectedRooms, setSelectedRooms] = useState({});
  const [loading, setLoading] = useState({});
  const [roomQuantities, setRoomQuantities] = useState({});
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const nights = useMemo(() => searchParams?.nights || 0, [searchParams?.nights]);
  const userId = useMemo(() => user?.id, [user?.id]);
  const roomsToDisplay = useMemo(() => Array.isArray(availableRooms) ? availableRooms : [], [availableRooms]);

  useEffect(() => {
    if (!window.Echo) return;
    const channel = window.Echo.channel('room-updates');
    channel.listen('RoomQuantityUpdated', (e) => {
      setRoomQuantities(prev => ({ ...prev, [e.roomId]: e.availableQuantity }));
    });
    return () => window.Echo.leaveChannel('room-updates');
  }, []);

  const handleQuantityChange = useCallback((roomId, quantity) => {
    const qty = parseInt(quantity);
    if (qty > 0) {
      if (selectedRoomType && selectedRoomType !== roomId) {
        toast.info('📌 Mỗi đặt phòng chỉ được chọn một loại phòng. Vui lòng hủy chọn loại phòng hiện tại trước khi chọn loại khác.');
        return;
      }
      setSelectedRooms({ [roomId]: qty });
      setSelectedRoomType(roomId);
    } else {
      setSelectedRooms({});
      setSelectedRoomType(null);
    }
  }, [selectedRoomType]);

  const handleSelectRoom = useCallback(async (room) => {
    const quantity = selectedRooms[room.id] || 0;
    if (quantity === 0) return toast.warn('Vui lòng chọn số lượng phòng');
    if (!userId) {
      toast.warn('Vui lòng đăng nhập để đặt phòng');
      return navigate('/login');
    }

    try {
      setLoading(prev => ({ ...prev, [room.id]: true }));
      const result = await bookingService.createBooking({
        user_id: userId,
        room_id: room.id,
        check_in: searchParams.checkIn,
        check_out: searchParams.checkOut,
        quantity
      });

      if (result.success) {
        toast.success('🎉 Đặt phòng thành công!');
        setRoomQuantities(prev => ({ ...prev, [room.id]: result.available_quantity }));
        setSelectedRooms({});
        setSelectedRoomType(null);
        navigate(`/booking/${result.data.id}`);
      } else {
        throw new Error(result.message || 'Đặt phòng thất bại');
      }
    } catch (error) {
      toast.error(error.message || 'Số lượng phòng không đủ hoặc có lỗi xảy ra');
    } finally {
      setLoading(prev => ({ ...prev, [room.id]: false }));
    }
  }, [selectedRooms, userId, searchParams, navigate]);

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const renderRoomCard = (room) => {
    const amenities = parseRobustAmenities(room.amenities);
    const quantity = selectedRooms[room.id] || 0;
    const availableQuantity = roomQuantities[room.id] || room.quantity;
    const isSelected = selectedRoomType === room.id;
    const isOtherSelected = selectedRoomType && selectedRoomType !== room.id;

    return (
      <div key={room.id} className="room-card">
        {isSelected && (
          <div className="selected-room-badge">
            <FaInfoCircle />
            <span>Bạn đang chọn loại phòng này.</span>
            <button className="cancel-selection-btn" onClick={() => { setSelectedRooms({}); setSelectedRoomType(null); }}>Hủy chọn</button>
          </div>
        )}
        {isOtherSelected && <div className="other-selected-notice"><FaInfoCircle /><span>Hủy chọn loại hiện tại để chọn loại này.</span></div>}

        <div className="room-card-header">
          <div className="room-type-info">
            <h4 className="room-title">{room.room_type}</h4>
            <div className="room-meta">
              <span className="room-meta-item"><FaUsers className="meta-icon" />{room.max_guest} người</span>
              <span className="room-meta-item"><FaHotel className="meta-icon" />Còn <span className={`stock-count ${availableQuantity < 3 ? 'low' : ''}`}>{availableQuantity}</span> phòng</span>
            </div>
          </div>
          <div className="room-price-section">
            <div className="price-per-night">{formatPrice(room.price * nights)}<span className="price-label">/{nights} đêm</span></div>
            {quantity > 0 && <div className="selected-price"><span className="total-amount">{formatPrice(room.price * nights * quantity)}</span><div className="price-breakdown">({quantity} phòng × {nights} đêm)</div></div>}
          </div>
        </div>

        {/* Room Numbers Display */}
        {room.room_numbers && room.room_numbers.length > 0 && (
          <div className="room-numbers-container">
            <div className="room-numbers-title">Số hiệu phòng sẵn có:</div>
            <div className="room-numbers-list">
              {room.room_numbers.map((rn, idx) => (
                <span key={idx} className={`room-number-tag ${rn.status === 'available' || rn.status === 'active' ? 'active' : 'inactive'}`}>
                  {rn.room_number || rn}
                </span>
              ))}
            </div>
          </div>
        )}

        {amenities.length > 0 && (
          <div className="room-amenities">
            <div className="amenities-title">Tiện nghi:</div>
            <div className="amenities-list">
              {amenities.slice(0, 4).map((amenity, index) => (
                <div key={index} className="amenity-item">{getAmenityIcon(amenity)}<span>{amenity}</span></div>
              ))}
              {amenities.length > 4 && <div className="amenity-more">+{amenities.length - 4} khác</div>}
            </div>
          </div>
        )}

        <div className="room-card-footer">
          <div className="quantity-selector">
            <label className="quantity-label">Số lượng:</label>
            <select value={quantity} onChange={(e) => handleQuantityChange(room.id, e.target.value)} className="quantity-select" disabled={availableQuantity === 0}>
              <option value="0">Chọn</option>
              {[...Array(Math.min(availableQuantity, 5))].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1} phòng</option>)}
            </select>
          </div>
          <button className={`book-button ${quantity > 0 ? 'active' : ''}`} onClick={() => handleSelectRoom(room)} disabled={!quantity || loading[room.id] || availableQuantity === 0}>
            {loading[room.id] ? <LoaderButton /> : availableQuantity === 0 ? <><FaExclamationTriangle /> Hết phòng</> : <><FaShoppingCart /> {quantity > 0 ? `Đặt ${quantity} phòng` : 'Chọn phòng'} <FaArrowRight /></>}
          </button>
        </div>
      </div>
    );
  };

  const selectedCount = useMemo(() => Object.values(selectedRooms).reduce((sum, qty) => sum + qty, 0), [selectedRooms]);

  return (
    <div className="available-rooms-container">
      <div className="rooms-header">
        <div className="header-left">
          <h2 className="section-title-available"><FaHotel className="title-icon" />Phòng Có Sẵn</h2>
          <div className="booking-info">
            <div className="info-item"><FaCalendarAlt className="info-icon" /><span>{nights} đêm</span></div>
            <div className="info-item"><FaHotel className="info-icon" /><span>{roomsToDisplay.length} loại phòng</span></div>
          </div>
        </div>
        {selectedCount > 0 && <div className="selected-summary"><div className="summary-badge"><FaShoppingCart /><span>Đã chọn {selectedCount} phòng</span></div></div>}
      </div>

      {selectedRoomType && (
        <div className="single-room-notice">
          <FaInfoCircle />
          <span><strong>Lưu ý:</strong> Mỗi đặt phòng chỉ chọn được 1 loại phòng.</span>
        </div>
      )}

      {roomsToDisplay.length === 0 ? (
        <div className="no-rooms-state">
          <div className="no-rooms-icon">🏨</div>
          <h3>Không có phòng trống</h3>
          <button className="change-dates-button" onClick={() => navigate('/')}><FaCalendarAlt /> Quay lại trang chủ</button>
        </div>
      ) : (
        <div className="rooms-grid">{roomsToDisplay.map(renderRoomCard)}</div>
      )}
    </div>
  );
};

export default memo(AvailableRooms);

