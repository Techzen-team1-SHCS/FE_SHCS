import HotelCardRecommendation from "../HotelCardRecommendation/HotelCardRecommendation";
import { FaStar } from "react-icons/fa";
import { getAIColor } from "../../Helpers/getAIColor";

const RecommendationGrid = ({ hotels }) => {

  return (
    <div className="ai-recommendations-grid">

      {hotels.map((hotel, index) => (

        <div
          key={hotel.id}
          className="ai-hotel-card-wrapper"
          style={{ "--ai-accent": getAIColor(index) }}
        >

          <div className="ai-recommendation-badge">
            <FaStar />
            #{index + 1} AI Pick
          </div>

          <HotelCardRecommendation
            image={hotel.images?.[0]?.url || "default-hotel.jpg"}
            title={hotel.name}
            location={hotel.province}
            description={hotel.description}
            price={hotel.price}
            rating={(hotel.hotel_class / 10).toFixed(1)}
            detailsUrl={`/hotel/${hotel.id}`}
            amenities={(() => {
              const data = hotel.amenities;
              if (!data) return [];
              if (Array.isArray(data)) return data;
              if (typeof data !== 'string') return [];
              try {
                if (data.trim().startsWith('[') && data.trim().endsWith(']')) {
                  return JSON.parse(data);
                }
                return data.split(',').map(item => item.trim()).filter(Boolean);
              } catch (e) {
                console.error("Error parsing amenities:", e);
                return [];
              }
            })()}
          />

        </div>

      ))}

    </div>
  );
};

export default RecommendationGrid;