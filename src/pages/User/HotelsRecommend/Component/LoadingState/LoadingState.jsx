import { FaBrain } from "react-icons/fa";

const LoadingState = () => {

  return (
    <div className="ai-loading-state">

      <div className="ai-loading-orb">
        <div className="ai-pulse"></div>
        <FaBrain className="ai-brain-icon" />
      </div>

      <h3>AI is analyzing your preferences...</h3>
      <p>Finding the perfect hotels for you</p>

    </div>
  );
};

export default LoadingState;