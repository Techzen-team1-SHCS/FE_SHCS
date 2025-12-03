import { useContext, useEffect, useState } from 'react';
import HotelCardRecommendation from '../../components/HotelCardRecommendation/HotelCardRecommendation'
import { AuthContext } from '../../contexts/AuthContext';
import TopHotelSlider from "../../components/TopHotelSlider/TopHotelSlider"
import { hotelService } from '../../services/hotelService';
import { FaRobot, FaMagic, FaBrain, FaStar, FaSyncAlt, FaHistory, FaHeart, FaSearch, FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import './style.css';
import { Link } from 'react-router-dom';

const HotelsRecommend = () => {
  const [hotelsRecommendPage, setHotelsRecommendPage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContext(AuthContext);
  const [source, setSource] = useState("");
  const [hasInteraction, setHasInteraction] = useState(false); // Theo dõi người dùng đã có tương tác chưa

  const fetchHotels = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await hotelService.getRecommendedHotels();
      setHotelsRecommendPage(data || []);
      setSource(localStorage.getItem("token") ? "AI/History" : "Top Hotels");
      
      // Kiểm tra xem người dùng có dữ liệu hay không
      // Trong thực tế, bạn cần API kiểm tra lịch sử người dùng
      // Tạm thời dùng localStorage để demo
      const userHasHistory = localStorage.getItem('hasHotelInteraction') === 'true';
      setHasInteraction(userHasHistory || (data && data.length > 0));
      
    } catch (error) {
      console.error(error);
      setHotelsRecommendPage([]);
      setSource("Top Hotels");
      setHasInteraction(localStorage.getItem('hasHotelInteraction') === 'true');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Hàm mô phỏng người dùng đã tương tác (trong thực tế gọi khi user tương tác)
  const simulateUserInteraction = () => {
    localStorage.setItem('hasHotelInteraction', 'true');
    setHasInteraction(true);
    fetchHotels(true); // Refresh recommendations
  };

  useEffect(() => {
    fetchHotels();
    
    // Kiểm tra localStorage khi component mount
    const hasInteracted = localStorage.getItem('hasHotelInteraction') === 'true';
    setHasInteraction(hasInteracted);
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

            {/* Thông báo cho người dùng mới */}
            {!hasInteraction && !loading && (
              <div className="ai-new-user-banner">
                <div className="new-user-content">
                  <FaInfoCircle className="info-icon" />
                  <div>
                    <strong>First time here?</strong> Start exploring hotels to get personalized AI recommendations!
                  </div>
                </div>
                <Link to="/HotelList" className="explore-cta">
                  Start Exploring <FaArrowRight />
                </Link>
              </div>
            )}

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

          {/* Hiển thị hướng dẫn cho người dùng mới chưa có tương tác */}
          {!loading && !hasInteraction && (
            <div className="ai-guide-section">
              <div className="ai-guide-container">
                <div className="ai-guide-header">
                  <div className="ai-guide-icon">
                    <FaRobot />
                  </div>
                  <h2>Welcome to AI Hotel Recommendations! 🎯</h2>
                  <p className="ai-guide-subtitle">
                    Our AI needs to learn about your preferences to provide personalized recommendations
                  </p>
                </div>

                <div className="ai-onboarding-steps">
                  <div className="onboarding-step active">
                    <div className="step-indicator">
                      <div className="step-dot"></div>
                      <div className="step-line"></div>
                    </div>
                    <div className="step-card">
                      <div className="step-header">
                        <div className="step-number">1</div>
                        <div className="step-icon-wrapper">
                          <FaSearch className="step-icon" />
                        </div>
                      </div>
                      <div className="step-body">
                        <h4>Explore Hotels</h4>
                        <p>Browse through our extensive collection of hotels</p>
                        <Link to="/HotelList" className="step-button">
                          Browse Hotels <FaArrowRight />
                        </Link>
                      </div>
                      <div className="step-hint">
                        💡 Click on hotels to view details
                      </div>
                    </div>
                  </div>

                  <div className="onboarding-step">
                    <div className="step-indicator">
                      <div className="step-dot"></div>
                      <div className="step-line"></div>
                    </div>
                    <div className="step-card">
                      <div className="step-header">
                        <div className="step-number">2</div>
                        <div className="step-icon-wrapper">
                          <FaHeart className="step-icon" />
                        </div>
                      </div>
                      <div className="step-body">
                        <h4>Save Favorites</h4>
                        <p>Click the heart icon on hotels you like</p>
                        <button 
                          className="step-button demo-btn"
                          onClick={simulateUserInteraction}
                        >
                          Demo: Mark as Favorite
                        </button>
                      </div>
                      <div className="step-hint">
                        💡 This helps AI understand your style
                      </div>
                    </div>
                  </div>

                  <div className="onboarding-step">
                    <div className="step-indicator">
                      <div className="step-dot"></div>
                    </div>
                    <div className="step-card">
                      <div className="step-header">
                        <div className="step-number">3</div>
                        <div className="step-icon-wrapper">
                          <FaHistory className="step-icon" />
                        </div>
                      </div>
                      <div className="step-body">
                        <h4>Get AI Recommendations</h4>
                        <p>Return here to see personalized suggestions</p>
                        <button 
                          className="step-button"
                          onClick={() => {
                            simulateUserInteraction();
                            fetchHotels();
                          }}
                        >
                          Check Recommendations
                        </button>
                      </div>
                      <div className="step-hint">
                        🎉 AI will suggest hotels just for you!
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ai-stats-preview">
                  <div className="stat-card">
                    <div className="stat-number">94%</div>
                    <div className="stat-label">Users get better recommendations</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">50+</div>
                    <div className="stat-label">Filters analyzed by AI</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-number">Instant</div>
                    <div className="stat-label">Personalized matches</div>
                  </div>
                </div>

                <div className="quick-start-options">
                  <h4>Quick Start Options:</h4>
                  <div className="quick-options-grid">
                    <button 
                      className="quick-option-btn"
                      onClick={simulateUserInteraction}
                    >
                      <div className="option-icon">🎲</div>
                      <div className="option-content">
                        <div className="option-title">Try Demo Mode</div>
                        <div className="option-desc">Experience AI recommendations with sample data</div>
                      </div>
                    </button>
                    
                    <Link to="/HotelList" className="quick-option-btn">
                      <div className="option-icon">🏨</div>
                      <div className="option-content">
                        <div className="option-title">Browse Top Hotels</div>
                        <div className="option-desc">Start with our most popular hotels</div>
                      </div>
                    </Link>
                    
                    <Link to="/profile" className="quick-option-btn">
                      <div className="option-icon">⚙️</div>
                      <div className="option-content">
                        <div className="option-title">Set Preferences</div>
                        <div className="option-desc">Tell us what you like manually</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Hiển thị recommendations cho người dùng đã có tương tác */}
          {!loading && hasInteraction && (
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
                  <p>Try exploring more hotels to improve AI suggestions</p>
                  <div className="empty-state-actions">
                    <Link to="/HotelList" className="ai-primary-btn">
                      <FaSearch />
                      Explore Hotels
                    </Link>
                    <button className="ai-secondary-btn" onClick={handleRefresh}>
                      <FaSyncAlt />
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="ai-success-message">
                    <div className="success-icon">✨</div>
                    <div className="success-text">
                      <strong>Great! AI has analyzed your preferences</strong>
                      <p>Here are personalized recommendations based on your activity</p>
                    </div>
                  </div>
                  
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
                </>
              )}
            </div>
          )}
        </div>

        {/* Top Hotels Slider - Luôn hiển thị */}
        <div className="ai-slider-section">
          <div className="ai-slider-header">
            <h2>{hasInteraction ? "You Might Also Like" : "Popular Hotels to Start With"}</h2>
            <p>{hasInteraction ? "More suggestions based on similar profiles" : "Explore these popular hotels to begin your journey"}</p>
          </div>
          <TopHotelSlider />
        </div>
      </section>
    </div>
  )
}

export default HotelsRecommend