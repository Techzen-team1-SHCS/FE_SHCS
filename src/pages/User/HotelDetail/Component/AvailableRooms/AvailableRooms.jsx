import {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../../../../../services/bookingService";
import { AuthContext } from "../../../../../contexts/AuthContext";
import "../../../../../config/echo";
import { toast } from "react-toastify";
import LoaderButton from "../../../../../components/Loading/LoaderButton";
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
  FaSwimmingPool,
  FaUtensils,
  FaParking,
  FaConciergeBell,
  FaInfoCircle,
  FaDoorOpen,
  FaDoorClosed,
} from "react-icons/fa";
import "./AvailableRooms.css";

// Static helpers & data
const amenityIcons = {
  WiFi: <FaWifi />,
  Parking: <FaParking />,
  "Swimming pool": <FaSwimmingPool />,
  Restaurant: <FaUtensils />,
  "Room service": <FaConciergeBell />,
  "24h front desk": <FaConciergeBell />,
  Spa: <FaStar />,
  "Fitness center": <FaStar />,
  "Sea view": <FaStar />,
  Balcony: <FaStar />,
};

const getAmenityIcon = (amenity) => {
  const foundKey = Object.keys(amenityIcons).find((key) =>
    amenity?.toLowerCase().includes(key.toLowerCase()),
  );
  return foundKey ? amenityIcons[foundKey] : <FaCheck />;
};

const parseRobustAmenities = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data !== "string") return [];
  try {
    if (data.trim().startsWith("[") && data.trim().endsWith("]"))
      return JSON.parse(data);
    return data
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  } catch (e) {
    return [];
  }
};

const AvailableRooms = ({ availableRooms, searchParams }) => {
  const [selectedRoomNumbers, setSelectedRoomNumbers] = useState([]); // Array of room numbers: {room_id, number}
  const [loading, setLoading] = useState({});
  const [roomQuantities, setRoomQuantities] = useState({});
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const nights = useMemo(
    () => searchParams?.nights || 0,
    [searchParams?.nights],
  );
  const userId = useMemo(() => user?.id, [user?.id]);
  const roomsToDisplay = useMemo(
    () => (Array.isArray(availableRooms) ? availableRooms : []),
    [availableRooms],
  );

  useEffect(() => {
    if (!window.Echo) return;
    const channel = window.Echo.channel("room-updates");
    channel.listen("RoomQuantityUpdated", (e) => {
      setRoomQuantities((prev) => ({
        ...prev,
        [e.roomId]: e.availableQuantity,
      }));
    });
    return () => window.Echo.leaveChannel("room-updates");
  }, []);

  const handleRoomNumberToggle = useCallback((room, rn) => {
    const roomId = room.id;
    const roomNumber = typeof rn === 'string' ? rn : rn.room_number;
    const status = (rn.status || 'available').toLowerCase();
    
    // Only allow selecting if available/active
    if (!['available', 'active', 'ready'].includes(status)) {
      return toast.warn('Phòng này hiện không sẵn sàng.');
    }

    if (selectedRoomType && selectedRoomType !== roomId) {
      toast.info('📌 Mỗi đặt phòng chỉ được chọn một loại phòng. Vui lòng hoàn tất hoặc hủy chọn loại hiện tại trước khi chọn loại khác.');
      return;
    }

    setSelectedRoomNumbers(prev => {
      const isAlreadySelected = prev.some(item => item.room_id === roomId && item.number === roomNumber);
      let newSelection;
      if (isAlreadySelected) {
        newSelection = prev.filter(item => !(item.room_id === roomId && item.number === roomNumber));
      } else {
        newSelection = [...prev, { room_id: roomId, number: roomNumber }];
      }

      if (newSelection.length > 0) {
        setSelectedRoomType(roomId);
      } else {
        setSelectedRoomType(null);
      }

      return newSelection;
    });
  }, [selectedRoomType]);

  const handleSelectRoom = useCallback(async (room) => {
    const currentSelected = selectedRoomNumbers.filter(item => item.room_id === room.id);
    const selectedQty = currentSelected.length;
    
    if (selectedQty === 0) return toast.warn('Vui lòng chọn ít nhất một số hiệu phòng');
    
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
        quantity: selectedQty,
        selected_room_numbers: currentSelected.map(i => i.number).join(', ')
      });

      if (result.success) {
        toast.success('🎉 Đặt phòng thành công!');
        setRoomQuantities(prev => ({ ...prev, [room.id]: result.available_quantity }));
        setSelectedRoomNumbers([]);
        setSelectedRoomType(null);
        navigate(`/booking/${result.data.id}`);
      } else {
        throw new Error(result.message || 'Đặt phòng thất bại');
      }
    } catch (error) {
      toast.error(error.message || "Số lượng phòng không đủ hoặc có lỗi xảy ra");
    } finally {
      setLoading((prev) => ({ ...prev, [room.id]: false }));
    }
  }, [selectedRoomNumbers, userId, searchParams, navigate]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const renderRoomCard = (room) => {
    const amenities = parseRobustAmenities(room.amenities);
    const availableQuantity = roomQuantities[room.id] || (room.available_quantity !== undefined ? room.available_quantity : room.quantity);
    const currentSelectedRooms = selectedRoomNumbers.filter(item => item.room_id === room.id);
    const selectedQty = currentSelectedRooms.length;
    const roomNums = room.room_numbers || room.roomNumbers || [];
    const isSelected = selectedRoomType === room.id;
    const isOtherSelected = selectedRoomType && selectedRoomType !== room.id;

    return (
      <div key={room.id} className="room-card">
        {isSelected && (
          <div className="selected-room-badge">
            <FaInfoCircle />
            <span>Đã chọn <strong>{selectedQty}</strong> phòng: {currentSelectedRooms.map(i => i.number).join(', ')}</span>
            <button className="cancel-selection-btn" onClick={() => { setSelectedRoomNumbers([]); setSelectedRoomType(null); }}>Hủy chọn</button>
          </div>
        )}
        {isOtherSelected && (
          <div className="other-selected-notice">
            <FaInfoCircle />
            <span>Vui lòng hoàn tất hoặc hủy chọn phòng loại <strong>{roomsToDisplay.find(r => r.id === selectedRoomType)?.room_type}</strong> để chọn loại này.</span>
          </div>
        )}

        <div className="room-card-header">
          <div className="room-type-info">
            <h4 className="room-title">{room.room_type}</h4>
            <div className="room-meta">
              <span className="room-meta-item"><FaUsers className="meta-icon" />{room.max_guest} người</span>
              <span className="room-meta-item">
                <FaHotel className="meta-icon" />
                Còn{" "}
                <span className={`stock-count ${availableQuantity - selectedQty < 3 ? "low" : ""}`}>
                  {availableQuantity - selectedQty}
                </span>{" "}
                phòng
              </span>
            </div>
          </div>
          <div className="room-price-section">
            <div className="price-per-night">
              {formatPrice(room.price * nights)}
              <span className="price-label">/{nights} đêm</span>
            </div>
            {selectedQty > 0 && (
              <div className="selected-price">
                <span className="total-amount">
                  {formatPrice(room.price * nights * selectedQty)}
                </span>
                <div className="price-breakdown">
                  ({selectedQty} phòng × {nights} đêm)
                </div>
              </div>
            )}
          </div>
        </div>

        {roomNums && roomNums.length > 0 && (
          <div className="room-numbers-container">
            <div className="room-numbers-title">
              <FaDoorOpen className="title-icon-small" /> Chọn số hiệu phòng:
            </div>
            <div className="room-numbers-list">
              {roomNums.map((rn, idx) => {
                const number = rn.room_number || rn;
                const status = (rn.status || 'available').toLowerCase();
                const isReady = ['available', 'active', 'ready'].includes(status);
                const isSelectedByMe = selectedRoomNumbers.some(item => item.room_id === room.id && item.number === number);
                
                return (
                  <div 
                    key={idx} 
                    className={`room-number-card ${isReady ? 'available' : 'unavailable'} ${isSelectedByMe ? 'selected' : ''}`}
                    onClick={() => handleRoomNumberToggle(room, rn)}
                    title={isReady ? (isSelectedByMe ? 'Hủy chọn' : 'Chọn phòng này') : 'Phòng không sẵn sàng'}
                  >
                    <span className="room-num-icon">{isSelectedByMe ? <FaCheck /> : (isReady ? <FaDoorOpen /> : <FaDoorClosed />)}</span>
                    <span className="room-num-text">{number}</span>
                    <span className="status-dot"></span>
                  </div>
                );
              })}
            </div>
            <div className="room-availability-hint">
              {availableQuantity > 0 ? (
                <span>📍 Nhấp trực tiếp vào số hiệu phòng để chọn. Đã chọn <strong>{selectedQty}</strong> phòng.</span>
              ) : (
                <span className="out-of-stock">Hiện tại không còn phòng trống cho đợt này.</span>
              )}
            </div>
          </div>
        )}

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
                <div className="amenity-more">+{amenities.length - 4} khác</div>
              )}
            </div>
          </div>
        )}

        <div className="room-card-footer">
          <div className="selection-info">
            {selectedQty > 0 ? (
              <span className="selection-count">Tổng: <strong>{selectedQty}</strong> phòng đã chọn</span>
            ) : (
              <span className="selection-prompt">Hãy nhấp vào số hiệu phòng ở trên để chọn</span>
            )}
          </div>
          <button
            className={`book-button ${selectedQty > 0 ? "active" : ""}`}
            onClick={() => handleSelectRoom(room)}
            disabled={!selectedQty || loading[room.id] || availableQuantity === 0}
          >
            {loading[room.id] ? (
              <LoaderButton />
            ) : availableQuantity === 0 ? (
              <><FaExclamationTriangle /> Hết phòng</>
            ) : (
              <>
                <FaShoppingCart />{" "}
                {selectedQty > 0 ? `Đặt ${selectedQty} phòng` : "Chọn phòng"}{" "}
                <FaArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const selectedCount = useMemo(() => selectedRoomNumbers.length, [selectedRoomNumbers]);

  return (
    <div className="available-rooms-container">
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
              <span>Đã chọn {selectedCount} phòng ({roomsToDisplay.find(r => r.id === selectedRoomType)?.room_type})</span>
            </div>
          </div>
        )}
      </div>

      {selectedRoomType && (
        <div className="single-room-notice">
          <FaInfoCircle />
          <span>
            <strong>Lưu ý:</strong> Mỗi đặt phòng chỉ chọn được 1 loại phòng.
          </span>
        </div>
      )}

      {roomsToDisplay.length === 0 ? (
        <div className="no-rooms-state">
          <div className="no-rooms-icon">🏨</div>
          <h3>Không có phòng trống</h3>
          <button className="change-dates-button" onClick={() => navigate("/")}>
            <FaCalendarAlt /> Quay lại trang chủ
          </button>
        </div>
      ) : (
        <div className="rooms-grid">{roomsToDisplay.map(renderRoomCard)}</div>
      )}
    </div>
  );
};

export default memo(AvailableRooms);
