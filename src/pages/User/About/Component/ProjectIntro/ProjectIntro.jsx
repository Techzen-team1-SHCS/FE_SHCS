const ProjectIntro = ({ projectFeatures }) => {
  return (
    <div className="project-intro-section">
      <div className="project-intro-content">
        <h2 className="section-title">HOTEL RECOMMENDATION SYSTEM</h2>

        <p className="project-description">
          Dự án của chúng tôi là một nền tảng web hiện đại sử dụng công nghệ AI
          và Machine Learning để phân tích hành vi người dùng, từ đó đưa ra các
          gợi ý khách sạn phù hợp nhất với sở thích và thói quen du lịch.
        </p>

        <div className="project-features">
          {projectFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="tech-stack">
          <h3>Công nghệ sử dụng:</h3>
          <div className="tech-tags">
            <span className="tech-tag">React.js</span>
            <span className="tech-tag">Node.js</span>
            <span className="tech-tag">Python AI/ML</span>
            <span className="tech-tag">MySQL</span>
            <span className="tech-tag">REST API</span>
            <span className="tech-tag">Payment Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectIntro;