import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../../../../services/bookingService';
import { AuthContext } from '../../../../../contexts/AuthContext';
import '../../../../../config/echo';
import { toast } from 'react-toastify';
import LoaderButton from '../../../../../components/Loading/LoaderButton';
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
  FaConciergeBell,
  FaInfoCircle
} from 'react-icons/fa';
import './AvailableRooms.css';

const AvailableRooms = ({ availableRooms, onRoomSelect, searchParams }) => {
  const [selectedRooms, setSelectedRooms] = useState({});
  const [loading, setLoading] = useState({});
  const [roomQuantities, setRoomQuantities] = useState({});
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const nights = useMemo(() => searchParams?.nights || 0, [searchParams?.nights]);
  const userId = useMemo(() => user?.id, [user?.id]);
  const roomsToDisplay = useMemo(() => {
    return Array.isArray(availableRooms) ? availableRooms : [];
  }, [availableRooms]);

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
    const qty = parseInt(quantity);
    
    if (qty > 0) {
      if (selectedRoomType && selectedRoomType !== roomId) {
        toast.info('📌 Mỗi đặt phòng chỉ được chọn một loại phòng. Vui lòng hủy chọn loại phòng hiện tại trước khi chọn loại khác.');
        return;
      }
      
      setSelectedRooms(prev => ({
        [roomId]: qty
      }));
      setSelectedRoomType(roomId);
      
      if (!selectedRoomType) {
        toast.info('💡 Mẹo: Mỗi booking chỉ được chọn một loại phòng. Nếu muốn đổi loại phòng, hãy hủy chọn loại hiện tại.');
      }
    } else {
      setSelectedRooms(prev => {
        const newRooms = { ...prev };
        delete newRooms[roomId];
        return newRooms;
      });
      setSelectedRoomType(null);
    }
  }, [selectedRoomType]);

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

        setSelectedRooms({});
        setSelectedRoomType(null);
        
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

  const handleCancelSelection = useCallback((roomId) => {
    setSelectedRooms(prev => {
      const newRooms = { ...prev };
      delete newRooms[roomId];
      return newRooms;
    });
    setSelectedRoomType(null);
    toast.info('Đã hủy chọn phòng. Bạn có thể chọn loại phòng khác.');
  }, []);

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
    
    const isSelected = selectedRoomType === room.id;
    const isOtherSelected = selectedRoomType && selectedRoomType !== room.id;

    return (
      <div key={room.id} className="room-card">
        {isSelected && (
          <div className="selected-room-badge">
            <FaInfoCircle />
            <span>Bạn đang chọn loại phòng này. Mỗi booking chỉ được chọn một loại phòng.</span>
            <button 
              className="cancel-selection-btn"
              onClick={() => handleCancelSelection(room.id)}
            >
              Hủy chọn
            </button>
          </div>
        )}
        
        {isOtherSelected && (
          <div className="other-selected-notice">
            <FaInfoCircle />
            <span>Bạn đang chọn một loại phòng khác. Hủy chọn loại hiện tại để chọn loại này.</span>
          </div>
        )}

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
              disabled={isOutOfStock}
            >
              <option value="0">Chọn</option>
              {[...Array(maxSelectable)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} phòng
                </option>
              ))}
            </select>
            {isLowStock && !isOutOfStock && (
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
              isOutOfStock
            }
            title={isOutOfStock ? "Phòng này đã hết" : quantity === 0 ? "Vui lòng chọn số lượng phòng" : ""}
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
  }, [selectedRooms, nights, roomQuantities, loading, selectedRoomType, handleQuantityChange, handleSelectRoom, handleCancelSelection, getAmenities, formatPrice]);

  const inlineStyles = `
    .selected-room-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      animation: fadeIn 0.3s ease;
    }
    
    .selected-room-badge svg {
      font-size: 16px;
    }
    
    .cancel-selection-btn {
      margin-left: auto;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .cancel-selection-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    
    .other-selected-notice {
      background: #f8f9fa;
      border: 1px solid #e8e8e8;
      padding: 8px 12px;
      border-radius: 6px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #7f8c8d;
    }
    
    .other-selected-notice svg {
      color: #3498db;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

  const selectedCount = useMemo(() => {
    return Object.values(selectedRooms).reduce((sum, qty) => sum + qty, 0);
  }, [selectedRooms]);

  return (
    <div className="available-rooms-container">
      <style>{inlineStyles}</style>
      
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
              <span>Đã chọn {selectedCount} phòng ({selectedRoomType ? '1 loại phòng' : ''})</span>
            </div>
          </div>
        )}
      </div>

      {selectedRoomType && (
        <div className="single-room-notice">
          <FaInfoCircle />
          <span><strong>Lưu ý:</strong> Mỗi đặt phòng chỉ được chọn một loại phòng. Nếu muốn đổi loại phòng, vui lòng hủy chọn loại hiện tại.</span>
        </div>
      )}

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

      {roomsToDisplay.length > 0 && (
        <div className="rooms-footer-tips">
          <div className="tip-card">
            <div className="tip-icon">💡</div>
            <div className="tip-content">
              <strong>Mẹo nhỏ:</strong> Mỗi booking chỉ chọn một loại phòng. Nếu cần nhiều loại, hãy tạo nhiều booking riêng!
            </div>
          </div>
        </div>
      )}

      <style>{`
        .single-room-notice {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: white;
          padding: 12px 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(245, 87, 108, 0.2);
        }
        
        .single-room-notice svg {
          font-size: 18px;
          flex-shrink: 0;
        }
        
        .single-room-notice strong {
          font-weight: 700;
        }
        
        .book-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .book-button:disabled:hover {
          transform: none;
          box-shadow: none;
        }
        
        .quantity-select:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

export default React.memo(AvailableRooms);

