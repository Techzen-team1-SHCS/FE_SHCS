
import { useContext, useEffect, useState } from 'react';
import HotelCardRecommendation from '../../components/HotelCardRecommendation/HotelCardRecommendation'
import { AuthContext } from '../../contexts/AuthContext';
import TopHotelSlider from "../../components/TopHotelSlider/TopHotelSlider"
const HotelsRecommend = () => {
  const [hotelsRecommendPage, setHotelsRecommendPage] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const hotels = [
    {
      id: 1,
      name: "Luxury Resort & Spa",
      province: "Đà Nẵng, Việt Nam",
      price: "2,500,000 ",
      rating: 4.8,
      description: "ccsadsdsdadsadsadadsaad",
      images: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      amenities: ["Wifi", "Hồ bơi", "Spa", "Nhà hàng"]
    },
    {
      id: 2,
      name: "Seaside Paradise Hotel",
      province: "Nha Trang, Việt Nam",
      price: "1,800,000 ",
      rating: 4.6,
      description: "ccsadsdsdadsadsadadsaad",
      images: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
      amenities: ["Wifi", "Biển riêng", "GYM", "Bar"]
    },
    {
      id: 3,
      name: "Mountain View Retreat",
      province: "Đà Lạt, Việt Nam",
      price: "1,200,000 ",
      rating: 4.9,
      description: "ccsadsdsdadsadsadadsaad",
      images: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=400",
      amenities: ["Wifi", "Lò sưởi", "View núi", "Xe đưa đón"]
    },
    {
      id: 4,
      name: "City Center Business Hotel",
      province: "Hồ Chí Minh, Việt Nam",
      price: "1,500,000 ",
      rating: 4.5,
      description: "ccsadsdsdadsadsadadsaad",
      images: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400",
      amenities: ["Wifi", "GYM", "Hội nghị", "Buffet sáng"]
    },
    {
      id: 5,
      name: "Heritage Boutique Hotel",
      province: "Hội An, Việt Nam",
      price: "1,600,000 ",
      rating: 4.7,
      description: "ccsadsdsdadsadsadadsaad",
      images: "https://images.unsplash.com/photo-1559291001-693fb9166cba?w=400",
      amenities: ["Wifi", "Xe đạp", "Spa", "Ẩm thực địa phương"]
    }
  ];
  useEffect(() => {
          const fetchHotelsRecommendPage = async () => {
              if (user) {
                  //setLoading(true);
                  const data = await hotelService.getRecommendedHotels();
                  setHotelsRecommendPage(data || []);
                  //setLoading(false);
              }
          };
  
          fetchHotelsRecommendPage();
      }, [user]);
  return (
    <div className="page-wrapper">
      <section
        className="page-banner-area pt-50 pb-35 rel z-1 bgs-cover"
        style={{ backgroundImage: "url(assets/images/banner/banner.jpg)" }}
      >
        <div className="container">
          <div className="banner-inner text-white mb-50 ">
            <h2 className="page-title mb-10 " style={{ zIndex: '10' }}>Hotel Recommned by AI</h2>
          </div>
        </div>
      </section>
      <section className="tour-list-page py-50 rel z-1">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between" style={{ gap: '10px' }}>
            {/* dữ liệu mẫu */}
            {hotels.map((hotel) => (
              <HotelCardRecommendation key={hotel.id}
                image={hotel.images?.[0]?.url || hotel.images}
                title={hotel.name}
                location={hotel.province}
                price={`${hotel.price_formatted || hotel.price} VNĐ`}
                rating={(hotel.rating / 1).toFixed(1)}
                detailsUrl={`/hotel/${hotel.id}`}
                description={hotel.description}
                amenities={hotel.amenities}
              />
            ))}
          </div>
          <TopHotelSlider/>
        </div>
      </section>
    </div>
  )
}

export default HotelsRecommend
