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
  const [heldRoomNumbers, setHeldRoomNumbers] = useState({});
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

  const refreshRoomStatus = useCallback(async () => {
    try {
      const statuses = await Promise.all(
        roomsToDisplay.map(async (room) => {
          const data = await bookingService.getRealtimeRoomStatus(room.id);
          return {
            roomId: room.id,
            availableQuantity: data.available_quantity,
            heldRoomNumbers: data.held_room_numbers || [],
          };
        }),
      );

      setRoomQuantities((prev) => {
        const next = { ...prev };
        statuses.forEach((status) => {
          next[status.roomId] = status.availableQuantity;
        });
        return next;
      });
      setHeldRoomNumbers((prev) => {
        const next = { ...prev };
        statuses.forEach((status) => {
          next[status.roomId] = status.heldRoomNumbers;
        });
        return next;
      });
    } catch (error) {
      console.warn("Không thể tải trạng thái phòng realtime", error);
    }
  }, [roomsToDisplay]);

  useEffect(() => {
    if (roomsToDisplay.length > 0) {
      refreshRoomStatus();
    }
  }, [roomsToDisplay, refreshRoomStatus]);

  useEffect(() => {
    if (!window.Echo) return;

    const channel = window.Echo.channel("bookings");
    channel.listen(".booking.cancelled", () => {
      refreshRoomStatus();
    });

    return () => window.Echo.leaveChannel("bookings");
  }, [refreshRoomStatus]);

  const handleRoomNumberToggle = useCallback(async (room, rn) => {
    const roomId = room.id;
    const roomNumber = typeof rn === 'string' ? rn : rn.room_number;
    const status = (rn.status || 'available').toLowerCase();
    const isHeld = (heldRoomNumbers[roomId] || []).includes(roomNumber);

    if (!['available', 'active', 'ready'].includes(status) || isHeld) {
      return toast.warn('Phòng này hiện không sẵn sàng hoặc đang được giữ.');
    }

    if (selectedRoomType && selectedRoomType !== roomId) {
      toast.info('📌 Mỗi đặt phòng chỉ được chọn một loại phòng. Vui lòng hoàn tất hoặc hủy chọn loại hiện tại trước khi chọn loại khác.');
      return;
    }

    const isAlreadySelected = selectedRoomNumbers.some(item => item.room_id === roomId && item.number === roomNumber);

    if (isAlreadySelected) {
      setSelectedRoomNumbers(prev => prev.filter(item => !(item.room_id === roomId && item.number === roomNumber)));
      await bookingService.releaseRoomNumber(roomId, roomNumber).catch(() => {});
      setHeldRoomNumbers(prev => ({
        ...prev,
        [roomId]: (prev[roomId] || []).filter(n => n !== roomNumber),
      }));
      return;
    }

    try {
      await bookingService.holdRoomNumber(roomId, roomNumber);
      setSelectedRoomNumbers(prev => [...prev, { room_id: roomId, number: roomNumber }]);
      setSelectedRoomType(roomId);
      setHeldRoomNumbers(prev => ({
        ...prev,
        [roomId]: [...new Set([...(prev[roomId] || []), roomNumber])],
      }));
      toast.success(`Đã giữ phòng ${roomNumber}`);
    } catch (error) {
      toast.error(error.message || 'Không thể giữ phòng này');
      await refreshRoomStatus();
    }
  }, [heldRoomNumbers, refreshRoomStatus, selectedRoomNumbers, selectedRoomType]);

  const handleClearRoomSelection = useCallback(async (roomId) => {
    const roomSelections = selectedRoomNumbers.filter(item => item.room_id === roomId);

    if (roomSelections.length > 0) {
      await Promise.all(
        roomSelections.map(({ number }) =>
          bookingService.releaseRoomNumber(roomId, number).catch(() => {}),
        ),
      );
    }

    setSelectedRoomNumbers(prev => prev.filter(item => item.room_id !== roomId));
    setSelectedRoomType(null);
    setHeldRoomNumbers(prev => ({
      ...prev,
      [roomId]: (prev[roomId] || []).filter(
        (number) => !roomSelections.some((item) => item.number === number),
      ),
    }));

    await refreshRoomStatus();
  }, [refreshRoomStatus, selectedRoomNumbers]);

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
        setHeldRoomNumbers(prev => ({
          ...prev,
          [room.id]: (prev[room.id] || []).filter(() => false),
        }));
        navigate(`/booking/${result.data.id}`);
      } else {
        throw new Error(result.message || 'Đặt phòng thất bại');
      }
    } catch (error) {
      toast.error(error.message || "Số lượng phòng không đủ hoặc có lỗi xảy ra");
    } finally {
      setLoading((prev) => ({ ...prev, [room.id]: false }));
      refreshRoomStatus();
    }
  }, [refreshRoomStatus, selectedRoomNumbers, userId, searchParams, navigate]);

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
    const heldNumbers = heldRoomNumbers[room.id] || [];
    const isSelected = selectedRoomType === room.id;
    const isOtherSelected = selectedRoomType && selectedRoomType !== room.id;

    return (
      <div key={room.id} className="room-card">
        {isSelected && (
          <div className="selected-room-badge">
            <FaInfoCircle />
            <span>Đã chọn <strong>{selectedQty}</strong> phòng: {currentSelectedRooms.map(i => i.number).join(', ')}</span>
            <button className="cancel-selection-btn" onClick={() => handleClearRoomSelection(room.id)}>Hủy chọn</button>
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
                const isHeld = heldNumbers.includes(number);
                const isSelectedByMe = selectedRoomNumbers.some(item => item.room_id === room.id && item.number === number);
                const isDisabled = !isReady || isHeld;
                
                return (
                  <div 
                    key={idx} 
                    className={`room-number-card ${isReady ? 'available' : 'unavailable'} ${isHeld ? 'held' : ''} ${isSelectedByMe ? 'selected' : ''}`}
                    onClick={() => !isDisabled && handleRoomNumberToggle(room, rn)}
                    title={isHeld ? 'Phòng đang được giữ tạm thời bởi người khác' : (isReady ? (isSelectedByMe ? 'Hủy chọn' : 'Chọn phòng này') : 'Phòng không sẵn sàng')}
                  >
                    <span className="room-num-icon">{isSelectedByMe ? <FaCheck /> : (isHeld ? <FaExclamationTriangle /> : (isReady ? <FaDoorOpen /> : <FaDoorClosed />))}</span>
                    <span className="room-num-text">{number}</span>
                    <span className="status-dot"></span>
                    {isHeld && <span className="held-badge">Đang giữ</span>}
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
            {heldNumbers.length > 0 && (
              <div className="room-hold-hint">
                <FaExclamationTriangle />
                <span>Có {heldNumbers.length} phòng đang được giữ tạm thời bởi người khác.</span>
              </div>
            )}
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
