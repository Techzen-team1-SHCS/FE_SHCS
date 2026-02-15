import { useContext, useEffect, useState } from 'react';
import HotelCardRecommendation from '../../components/HotelCardRecommendation/HotelCardRecommendation'
import { AuthContext } from '../../contexts/AuthContext';
import TopHotelSlider from "../../components/TopHotelSlider/TopHotelSlider"
import { FaRobot, FaMagic, FaBrain, FaStar, FaSyncAlt, FaSearch, FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import './style.css';
import { Link } from 'react-router-dom';
import { useRecommendedHotels } from '../../queries/useRecommendedHotels'; // Import hook

const HotelsRecommend = () => {
  const { user } = useContext(AuthContext);

  // Sử dụng useQuery thông qua custom hook
  const {
    data: hotelsRecommendPage = [],
    isLoading,
    isError,
    isFetching,
    refetch
  } = useRecommendedHotels();

  const [hasInteraction, setHasInteraction] = useState(false);
  const [source, setSource] = useState("");

  // Effect để xử lý logic nguồn dữ liệu và tương tác người dùng
  useEffect(() => {
    // Kiểm tra local storage khi component mount
    const hasInteracted = localStorage.getItem('hasHotelInteraction') === 'true';
    setHasInteraction(hasInteracted);

    // Xác định nguồn dữ liệu
    const dataSource = localStorage.getItem("token") ? "AI/History" : "Top Hotels";
    setSource(dataSource);

    // Nếu có dữ liệu từ API, cũng coi như có tương tác
    if (hotelsRecommendPage.length > 0 && !hasInteracted) {
      setHasInteraction(true);
    }
  }, [hotelsRecommendPage]);

  // Hàm mô phỏng người dùng đã tương tác
  const simulateUserInteraction = () => {
    localStorage.setItem('hasHotelInteraction', 'true');
    setHasInteraction(true);
    refetch(); // Gọi refetch để làm mới dữ liệu
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

  // Tính toán loading state
  const loading = isLoading;
  const refreshing = isFetching && !isLoading;

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

        <div className="container" style={{ marginTop: '50px' }}>
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
                onClick={() => refetch()}
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

          {/* Error State */}
          {isError && !loading && (
            <div className="ai-error-state">
              <div className="ai-error-orb">
                <FaRobot className="error-icon" />
              </div>
              <h3>Oops! AI encountered an error</h3>
              <p>We couldn't load recommendations at this time</p>
              <button
                className="ai-primary-btn"
                onClick={() => refetch()}
              >
                <FaSyncAlt />
                Retry
              </button>
            </div>
          )}

          {/* Hiển thị hướng dẫn cho người dùng mới chưa có tương tác */}
          {!loading && !isError && !hasInteraction && (
            <div className="ai-guide-section">
              {/* ... (giữ nguyên phần onboarding steps) ... */}
            </div>
          )}

          {/* Hiển thị recommendations cho người dùng đã có tương tác */}
          {!loading && !isError && hasInteraction && (
            <div className="ai-content-wrapper">
              <div className="ai-recommendations-header">
                <div className="ai-results-info">
                  <FaMagic className="results-icon" />
                  <span>
                    Found <strong>{hotelsRecommendPage.length}</strong> personalized recommendations
                  </span>
                </div>

                <div className="ai-confidence">
                  {/* <div className="confidence-meter">
                    <div className="confidence-fill" style={{ width: '92%' }}></div>
                  </div>
                  <span>92% Match</span> */}
                </div>
              </div>

              {hotelsRecommendPage.length === 0 ? (
                <div className="ai-empty-state">
                  <div className="ai-empty-orb">
                    <FaRobot className="empty-icon" />
                  </div>

                  <h3>No recommendations found</h3>
                  <p>
                    Our AI needs more interaction to understand your preferences.
                    Follow these simple steps to unlock personalized hotel suggestions.
                  </p>

                  {/* AI STEP FLOW */}
                  <div className="ai-steps-flow">
                    <div className="ai-step">
                      <FaSearch className="step-icon" />
                      <h4>Explore Hotels</h4>
                      <p>Browse available hotels</p>
                    </div>

                    <div className="ai-step-arrow">→</div>

                    <div className="ai-step">
                      <FaInfoCircle className="step-icon" />
                      <h4>View Details</h4>
                      <p>Check hotel information</p>
                    </div>

                    <div className="ai-step-arrow">→</div>

                    <div className="ai-step">
                      <FaStar className="step-icon" />
                      <h4>Interact</h4>
                      <p>Save or book hotels</p>
                    </div>

                    <div className="ai-step-arrow">→</div>

                    <div className="ai-step ">
                      <FaBrain className="step-icon" />
                      <h4>AI Learns</h4>
                      <p>Get smart recommendations</p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="empty-state-actions">
                    <Link to="/HotelList" className="ai-primary-btn">
                      <FaSearch />
                      Explore Hotels
                    </Link>

                    <button
                      className="ai-secondary-btn"
                      onClick={() => refetch()}
                    >
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
                          image={hotel.images?.[0]?.url || 'default-hotel.jpg'}
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

export default HotelsRecommend;