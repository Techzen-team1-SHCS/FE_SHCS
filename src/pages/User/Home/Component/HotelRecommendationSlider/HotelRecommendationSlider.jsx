import { useContext } from 'react'
import { AuthContext } from '../../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HotelRecommendation = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate('/HotelsRecommend');
    };

    return (
        <section className="ai-recommendation-banner">
            <div className="container">
                <div className="banner-content">
                    <div className="ai-icon">
                        <i className="fas fa-robot"></i>
                        <div className="pulse-effect"></div>
                    </div>

                    <h1 className="banner-title">
                        Khám phá khách sạn với <span className="ai-text">AI</span>
                    </h1>

                    <p className="banner-description">
                        Hệ thống AI của chúng tôi phân tích sở thích và hành vi của bạn
                        để đề xuất những khách sạn phù hợp nhất
                        {user ?
                            " dựa trên lịch sử đặt phòng và đánh giá của bạn." :
                            ". Đăng nhập và thao tác để nhận đề xuất cá nhân hóa!"
                        }
                    </p>

                    <div className="features" style={{ color: 'black' }}>
                        <div className="feature-item">
                            <i className="fas fa-bolt"></i>
                            <span>Đề xuất thông minh</span>
                        </div>
                        <div className="feature-item">
                            <i className="fas fa-heart"></i>
                            <span>Phù hợp sở thích</span>
                        </div>
                        <div className="feature-item">
                            <i className="fas fa-star"></i>
                            <span>Đánh giá cá nhân hóa</span>
                        </div>
                    </div>

                    <button
                        className="explore-btn"
                        onClick={handleExploreClick}
                    >
                        <span>Khám phá khách sạn được đề xuất</span>
                        <i className="fas fa-arrow-right"></i>
                    </button>

                    <div className="cta-note">
                        <i className="fas fa-magic"></i>
                        <span>Click để trải nghiệm sức mạnh AI</span>
                    </div>
                </div>
            </div>

            {/* Background Elements */}
            <div className="bg-elements">
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <div className="circle circle-3"></div>
                <div className="floating-element el-1"><i className="fas fa-hotel"></i></div>
                <div className="floating-element el-2"><i className="fas fa-map-marker-alt"></i></div>
                <div className="floating-element el-3"><i className="fas fa-bed"></i></div>
            </div>

            <style>{`
                .ai-recommendation-banner {
                    width:98%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 80px 0;
                    position: relative;
                    overflow: hidden;
                    margin: 40px auto;
                    border-radius: 20px;
                }
                
                .container {
                    position: relative;
                    z-index: 2;
                }
                
                .banner-content {
                    max-width: 800px;
                    margin: 0 auto;
                    text-align: center;
                }
                
                .ai-icon {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin: 0 auto 30px;
                }
                
                .ai-icon i {
                    font-size: 50px;
                    color: white;
                    position: relative;
                    z-index: 2;
                }
                
                .pulse-effect {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    animation: pulse 2s infinite;
                }
                
                .banner-title {
                    font-size: 3rem;
                    margin-bottom: 20px;
                    font-weight: 700;
                }
                
                .ai-text {
                    background: linear-gradient(45deg, #00ffcc, #0066ff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-weight: 800;
                }
                
                .banner-description {
                    font-size: 1.2rem;
                    margin-bottom: 40px;
                    line-height: 1.6;
                    opacity: 0.9;
                }
                
                .features {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    margin-bottom: 40px;
                    flex-wrap: wrap;
                }
                
                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 20px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50px;
                    backdrop-filter: blur(10px);
                }
                
                .feature-item i {
                    color: #00ffcc;
                }
                
                .explore-btn {
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 18px 40px;
                    font-size: 1.2rem;
                    font-weight: 600;
                    border-radius: 50px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    margin: 0 auto 20px;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }
                
                .explore-btn:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
                    background: #f8f9fa;
                }
                
                .cta-note {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    font-size: 0.9rem;
                    opacity: 0.8;
                }
                
                .cta-note i {
                    color: #00ffcc;
                }
                
                /* Background Elements */
                .bg-elements {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                }
                
                .circle {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                }
                
                .circle-1 {
                    width: 300px;
                    height: 300px;
                    top: -150px;
                    right: -150px;
                }
                
                .circle-2 {
                    width: 200px;
                    height: 200px;
                    bottom: -100px;
                    left: -100px;
                }
                
                .circle-3 {
                    width: 150px;
                    height: 150px;
                    top: 50%;
                    left: 10%;
                }
                
                .floating-element {
                    position: absolute;
                    font-size: 24px;
                    color: rgba(255, 255, 255, 0.2);
                    animation: float 6s ease-in-out infinite;
                }
                
                .el-1 {
                    top: 20%;
                    left: 10%;
                    animation-delay: 0s;
                }
                
                .el-2 {
                    top: 60%;
                    right: 15%;
                    animation-delay: 2s;
                }
                
                .el-3 {
                    bottom: 30%;
                    left: 20%;
                    animation-delay: 4s;
                }
                
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(10deg);
                    }
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .banner-title {
                        font-size: 2rem;
                    }
                    
                    .banner-description {
                        font-size: 1rem;
                    }
                    
                    .features {
                        gap: 15px;
                    }
                    
                    .feature-item {
                        padding: 8px 15px;
                        font-size: 0.9rem;
                    }
                    
                    .explore-btn {
                        padding: 15px 30px;
                        font-size: 1rem;
                    }
                }
            `}</style>
        </section>
    )
}

export default HotelRecommendation