
import { useContext, useEffect, useState } from 'react';
import HotelCardRecommendation from '../../components/HotelCardRecommendation/HotelCardRecommendation'
import { AuthContext } from '../../contexts/AuthContext';
import TopHotelSlider from "../../components/TopHotelSlider/TopHotelSlider"
import { hotelService } from '../../services/hotelService';
import './style.css';
const HotelsRecommend = () => {
  const [hotelsRecommendPage, setHotelsRecommendPage] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [source, setSource] = useState("");
  useEffect(() => {
  let isMounted = true;

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await hotelService.getRecommendedHotels();
      if (isMounted) {
        setHotelsRecommendPage(data || []);
        setSource(localStorage.getItem("token") ? "AI/History" : "Top Hotels");
      }
    } catch (error) {
      console.error(error);
      if (isMounted) {
        setHotelsRecommendPage([]);
        setSource("Top Hotels");
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchHotels();
  return () => { isMounted = false };
}, []);

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
        <div className="container_fluid">
          <div className="content_recommend">
            {/* dữ liệu mẫu */}
            {hotelsRecommendPage.map((hotel) => (
             <HotelCardRecommendation key={hotel.id}
                image={hotel.images?.[0]?.url || hotel.images}
                title={hotel.name}
                location={hotel.province}
                description={hotel.description}
                price={hotel.price}
                rating={(hotel.hotel_class / 10).toFixed(1)}
                detailsUrl={`/hotel/${hotel.id}`}
                amenities={hotel.amenities?JSON.parse(hotel.amenities): []}
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
