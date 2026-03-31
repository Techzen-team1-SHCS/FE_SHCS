import { FaRobot, FaBrain, FaSyncAlt, FaInfoCircle, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const AIHeader = ({ user, source, refreshing, refetch, hasInteraction }) => {

  return (
    <section className="ai-banner-area">

      <div className="container" style={{ marginTop: "50px" }}>

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
            Powered by machine learning algorithms
            {user && " and booking history"}
          </p>

          {!hasInteraction && (
            <div className="ai-new-user-banner">

              <FaInfoCircle />

              <Link to="/HotelList"  className="explore-cta">
                Start Exploring <FaArrowRight />
              </Link>

            </div>
          )}

          <div className="ai-source-indicator">

            <div className="source-badge">
              <FaBrain />
              <span>Source: {source}</span>
            </div>

            <button
              className="refresh-btn"
              onClick={refetch}
              disabled={refreshing}
            >
              <FaSyncAlt className={refreshing ? "spinning" : ""} />
              {refreshing ? "Refreshing..." : "Refresh AI"}
            </button>

          </div>

        </div>

      </div>

    </section>
  );
};

export default AIHeader;