import { useNavigate } from "react-router-dom";
import "./NotFound.css"
const NotFoundPage = () => {
   const navigate = useNavigate();
  return (
    <div>
      <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-title">
          <img
            src="assets/images/newsletter/404new.jpg"
            alt="404 character"
            className="notfound-image"
          />
        </h1>
        <p className="notfound-text">This Page Can’t Be Found</p>
        <button
          className="back-home-btn"
          onClick={() => navigate("/")}
        >
          Back to home
        </button>
      </div>
    </div>
    </div>
  )
}

export default NotFoundPage
