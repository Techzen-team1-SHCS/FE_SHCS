import { FaRobot, FaSyncAlt } from "react-icons/fa";

const ErrorState = ({ refetch }) => {

  return (
    <div className="ai-error-state">

      <FaRobot />

      <h3>Oops! AI encountered an error</h3>

      <button
        className="ai-primary-btn"
        onClick={refetch}
      >
        <FaSyncAlt />
        Retry
      </button>

    </div>
  );
};

export default ErrorState;