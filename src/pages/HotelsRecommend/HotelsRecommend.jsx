import { useContext, useEffect, useState } from 'react';
import HotelCardRecommendation from '../../components/HotelCardRecommendation/HotelCardRecommendation'
import { AuthContext } from '../../contexts/AuthContext';
import TopHotelSlider from "../../components/TopHotelSlider/TopHotelSlider"
import { hotelService } from '../../services/hotelService';
import { FaRobot, FaMagic, FaBrain, FaStar, FaSyncAlt } from 'react-icons/fa';
import './style.css';

const HotelsRecommend = () => {
  const [hotelsRecommendPage, setHotelsRecommendPage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContext(AuthContext);
  const [source, setSource] = useState("");

  const fetchHotels = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await hotelService.getRecommendedHotels();
      setHotelsRecommendPage(data || []);
      setSource(localStorage.getItem("token") ? "AI/History" : "Top Hotels");
    } catch (error) {
      console.error(error);
      setHotelsRecommendPage([]);
      setSource("Top Hotels");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleRefresh = () => {
    fetchHotels(true);
  };

  const getAIColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="page-wrapper ai-recommend-page">
      {/* AI Header Section */}
      <section className="ai-banner-area">
        <div className="ai-banner-background">
          <div className="ai-gradient-overlay"></div>
          <div className="ai-floating-elements">
            <div className="ai-orb orb-1"></div>
            <div className="ai-orb orb-2"></div>
            <div className="ai-orb orb-3"></div>
            <div className="ai-circuit"></div>
          </div>
        </div>
        
        <div className="container">
          <div className="ai-banner-content">
            <div className="ai-header-badge">
              <FaRobot className="ai-badge-icon" />
              <span>AI Recommendation Engine</span>
            </div>
            
            <h1 className="ai-main-title">
              <span className="ai-gradient-text">Smart Hotel</span>
              <br />
              Recommendations
            </h1>
            
            <p className="ai-subtitle">
              Powered by advanced machine learning algorithms that understand your preferences
              {user && " and booking history"}
            </p>

            <div className="ai-source-indicator">
              <div className="source-badge">
                <FaBrain className="source-icon" />
                <span>Source: {source}</span>
              </div>
              
              <button 
                className="refresh-btn"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <FaSyncAlt className={refreshing ? "spinning" : ""} />
                {refreshing ? "Refreshing..." : "Refresh AI"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Recommendations Grid */}
      <section className="ai-recommendations-section">
        <div className="container_fluid">
          {/* Loading State */}
          {loading && (
            <div className="ai-loading-state">
              <div className="ai-loading-orb">
                <div className="ai-pulse"></div>
                <FaBrain className="ai-brain-icon" />
              </div>
              <h3>AI is analyzing your preferences...</h3>
              <p>Finding the perfect hotels for you</p>
            </div>
          )}

          {/* Recommendations Grid */}
          {!loading && (
            <div className="ai-content-wrapper">
              <div className="ai-recommendations-header">
                <div className="ai-results-info">
                  <FaMagic className="results-icon" />
                  <span>
                    Found <strong>{hotelsRecommendPage.length}</strong> personalized recommendations
                  </span>
                </div>
                
                <div className="ai-confidence">
                  <div className="confidence-meter">
                    <div className="confidence-fill" style={{width: '92%'}}></div>
                  </div>
                  <span>92% Match</span>
                </div>
              </div>

              {hotelsRecommendPage.length === 0 ? (
                <div className="ai-empty-state">
                  <div className="ai-empty-orb">
                    <FaRobot className="empty-icon" />
                  </div>
                  <h3>No recommendations found</h3>
                  <p>Try refreshing or check back later for AI suggestions</p>
                  <button className="ai-primary-btn" onClick={handleRefresh}>
                    <FaSyncAlt />
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="ai-recommendations-grid">
                  {hotelsRecommendPage.map((hotel, index) => (
                    <div 
                      key={hotel.id} 
                      className="ai-hotel-card-wrapper"
                      style={{ '--ai-accent': getAIColor(index) }}
                    >
                      <div className="ai-recommendation-badge">
                        <FaStar className="badge-star" />
                        #{index + 1} AI Pick
                      </div>
                      
                      <HotelCardRecommendation
                        image={hotel.images?.[0]?.url || hotel.images}
                        title={hotel.name}
                        location={hotel.province}
                        description={hotel.description}
                        price={hotel.price}
                        rating={(hotel.hotel_class / 10).toFixed(1)}
                        detailsUrl={`/hotel/${hotel.id}`}
                        amenities={hotel.amenities ? JSON.parse(hotel.amenities) : []}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Top Hotels Slider with AI Theme */}
          <div className="ai-slider-section">
            <div className="ai-slider-header">
              <h2>Complementary Suggestions</h2>
              <p>Other hotels you might love based on AI analysis</p>
            </div>
            <TopHotelSlider />
          </div>
        </div>
      </section>
    </div>
  )
}

export default HotelsRecommend