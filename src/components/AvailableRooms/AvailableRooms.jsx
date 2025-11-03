import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import { AuthContext } from '../../contexts/AuthContext';
import '../../config/echo';
import { toast } from 'react-toastify';
const AvailableRooms = ({ availableRooms, onRoomSelect, searchParams }) => {
  const [selectedRooms, setSelectedRooms] = useState({});
 const [loading, setLoading] = useState({});
  const [roomQuantities, setRoomQuantities] = useState({});
  const {user}=useContext(AuthContext)
  const navigate = useNavigate();
  console.log(user.id);
  // Handle room quantity change
  useEffect(() => {
    console.log('🔄 Đang kết nối đến channel room-updates...');
    
    // Kiểm tra xem Echo có tồn tại không
    if (!window.Echo) {
      console.error('❌ Echo không tồn tại');
      return;
    }

    // Kết nối đến channel
    const channel = window.Echo.channel('room-updates');
    
    // Lắng nghe event - SỬA TÊN EVENT
    channel.listen('RoomQuantityUpdated', (e) => {
      console.log('📡 Nhận realtime update:', e);
      setRoomQuantities(prev => ({
        ...prev,
        [e.roomId]: e.availableQuantity
      }));
    });

    console.log('✅ Đã kết nối đến channel room-updates');

    return () => {
      console.log('🔴 Rời khỏi channel room-updates');
      window.Echo.leaveChannel('room-updates');
    };
  }, []);

  const handleQuantityChange = (roomId, quantity) => {
    setSelectedRooms(prev => ({
      ...prev,
      [roomId]: parseInt(quantity)
    }));
  };

  // Sử dụng bookingService để tạo booking
  const handleSelectRoom = async (room) => {
    const quantity = selectedRooms[room.id] || 0;
    
    if (quantity === 0) {
      alert('Vui lòng chọn số lượng phòng');
      return;
    }

    try {
      setLoading(prev => ({ ...prev, [room.id]: true }));

      // Lấy user info
      const userId = user?.id;

      if (!userId) {
        toast.warn('Vui lòng đăng nhập để đặt phòng');
        navigate('/login');
        return;
      }

      // Tạo booking data
      const bookingData = {
        user_id: userId,
        room_id: room.id,
        check_in: searchParams.checkIn,    // ✅ Dùng check_in
        check_out: searchParams.checkOut,
        quantity: quantity
      };

      console.log('📤 Gửi booking data:', bookingData);

      // GỌI QUA BOOKING SERVICE
      const result = await bookingService.createBooking(bookingData);

      if (result.success) {
        toast.success('🎉 Đặt phòng thành công!');
         
        // Cập nhật realtime quantity
        setRoomQuantities(prev => ({
          ...prev,
          [room.id]: result.available_quantity
        }));

        // Điều hướng đến trang xác nhận
        navigate(`/booking/${result.data.id}`);
        
      } else {
        throw new Error(result.message || 'Đặt phòng thất bại');
      }

    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(prev => ({ ...prev, [room.id]: false }));
    }
  };

  // Safe parse amenities
  const getAmenities = (amenities) => {
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
  };

  return (
    <div className="available-rooms-container">
      <h3>Phòng Có Sẵn ({searchParams?.nights || 0} đêm)</h3>
      
      {availableRooms.length === 0 ? (
        <div className="no-rooms">Không có phòng trống</div>
      ) : (
        <table className="rooms-table">
          <thead>
            <tr>
              <th>Loại phòng</th>
              <th>Số khách</th>
              <th>Số phòng còn</th>
              <th>Giá ({searchParams?.nights || 0} đêm)</th>
              <th>Chọn số lượng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {availableRooms.map(room => {
              const amenities = getAmenities(room.amenities);
              const quantity = selectedRooms[room.id] || 0;
              const nights = searchParams?.nights || 0;
              
              // Tính giá: room.price × số đêm × số lượng đã chọn
              const totalPrice = room.price * nights * quantity;
              
              return (
                <tr key={room.id} className="room-row">
                  <td>
                    <strong>{room.room_type}</strong>
                    {amenities.length > 0 && (
                      <div className="amenities">
                        {amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="amenity">✓ {amenity}</span>
                        ))}
                        {amenities.length > 3 && (
                          <span className="amenity-more">+{amenities.length - 3} khác</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td>{room.max_guest} người</td>
                  <td>{room.quantity} phòng</td>
                  <td className="price">
                    {quantity > 0 ? (
                      <div>
                        <div className="total-amount">
                          {new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND' 
                          }).format(totalPrice)}
                        </div>
                        <div className="price-breakdown">
                          ({new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND' 
                          }).format(room.price)} × {nights} đêm × {quantity} phòng)
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="base-price">
                          {new Intl.NumberFormat('vi-VN', { 
                            style: 'currency', 
                            currency: 'VND' 
                          }).format(room.price * nights)}
                        </div>
                        <div className="price-note">(1 phòng)</div>
                      </div>
                    )}
                  </td>
                  <td>
                    <select
                      value={quantity}
                      onChange={(e) => handleQuantityChange(room.id, e.target.value)}
                      className="quantity-select"
                    >
                      <option value="0">0</option>
                      {[...Array(Math.min(room.quantity, 5))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className={`select-btn ${quantity > 0 ? 'active' : ''}`}
                      onClick={() => handleSelectRoom(room)}
                      disabled={!quantity || quantity === 0}
                    >
                      Chọn
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <style jsx>{`
        .available-rooms-container {
          margin: 20px 0;
        }

        .available-rooms-container h3 {
          margin-bottom: 15px;
          color: #333;
        }

        .rooms-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .rooms-table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 1px solid #dee2e6;
        }

        .rooms-table td {
          padding: 12px;
          border-bottom: 1px solid #dee2e6;
        }

        .room-row:hover {
          background: #f8f9fa;
        }

        .amenities {
          margin-top: 5px;
        }

        .amenity {
          display: inline-block;
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          margin-right: 5px;
          margin-bottom: 3px;
        }

        .amenity-more {
          display: inline-block;
          background: #007bff;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          margin-right: 5px;
          margin-bottom: 3px;
        }

        .price {
          font-weight: bold;
          color: #e74c3c;
        }

        .total-amount {
          font-size: 16px;
          color: #e74c3c;
        }

        .price-breakdown {
          font-size: 12px;
          color: #666;
          margin-top: 4px;
        }

        .base-price {
          color: #e74c3c;
        }

        .price-note {
          font-size: 12px;
          color: #666;
          margin-top: 2px;
        }

        .quantity-select {
          padding: 6px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 80px;
        }

        .select-btn {
          padding: 8px 16px;
          background: #6c757d;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .select-btn.active {
          background: #28a745;
        }

        .select-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .select-btn.active:hover {
          background: #218838;
        }

        .no-rooms {
          text-align: center;
          padding: 40px;
          color: #666;
          font-size: 16px;
          background: #f8f9fa;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default AvailableRooms;