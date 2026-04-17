const MissionSection = () => {
  return (
    <div className="mission-section">
      <div className="mission-content">
        <h2 className="section-title">Tầm Nhìn & Sứ Mệnh</h2>

        <p className="mission-text">
          Chúng tôi hướng đến việc tạo ra một hệ sinh thái du lịch thông minh,
          nơi mỗi khách hàng đều có trải nghiệm đặt phòng khách sạn cá nhân hóa.
        </p>

        <div className="mission-highlights">
          <div className="highlight">
            <div className="highlight-icon">🎯</div>
            <h4>Cá Nhân Hóa</h4>
            <p>Gợi ý khách sạn phù hợp với từng cá nhân</p>
          </div>

          <div className="highlight">
            <div className="highlight-icon">⚡</div>
            <h4>Tốc Độ & Tiện Lợi</h4>
            <p>Booking nhanh chóng chỉ với vài thao tác</p>
          </div>

          <div className="highlight">
            <div className="highlight-icon">🤖</div>
            <h4>Công Nghệ AI</h4>
            <p>Ứng dụng trí tuệ nhân tạo tiên tiến</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionSection;