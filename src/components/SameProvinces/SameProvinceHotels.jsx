// components/SameProvinceHotels.jsx
import React, { useState, useEffect } from 'react';
import { hotelService } from '../../services/hotelService';
import './style.css';
import { useNavigate } from 'react-router-dom';
import PartLoading from '../Loading/PartLoading';
const SameProvinceHotels = ({ currentHotelId }) => {
  const [sameProvinceHotels, setSameProvinceHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate=useNavigate();
  useEffect(() => {
    const fetchSameProvinceHotels = async () => {
      try {
        setLoading(true);
        const data = await hotelService.getSameProvince(currentHotelId)
        setSameProvinceHotels(data)
      } catch (err) {
        setError('Không thể tải danh sách khách sạn cùng tỉnh');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentHotelId) {
      fetchSameProvinceHotels();
    }
  }, [currentHotelId]);

  if (loading) return <div><PartLoading /></div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="same-province-hotels">
      <h2>Khách sạn cùng tỉnh</h2>
      <div className="hotels-grid">
        {sameProvinceHotels.map(hotel => (
          <div key={hotel.id} className="hotel-card" onClick={()=>navigate(`/hotel/${hotel.id}`)} style={{cursor:'pointer'}}>
            {/* Ảnh chính */}
            <img 
              src={hotel.images?.[0]?.url || '/default-hotel.jpg'} 
              alt={hotel.name}
            />
            
            <div className='content'>
                <span>{hotel.name}</span>
                <p>{hotel.province}</p>
                <div className="ratting">
                    {[...Array(Math.floor(hotel.hotel_class/10))].map((_, i) => (
                        <i key={i} className="fas fa-star" style={{ color: "#FFD700" }}></i>
                    ))}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SameProvinceHotels;