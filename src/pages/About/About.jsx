import React from 'react';
import { FaFacebook, FaInstagram, FaCode, FaUsers, FaRocket, FaHeart, FaHotel, FaCalendarCheck, FaChartLine, FaRobot } from 'react-icons/fa';

const About = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Trần Quốc Vĩ",
      position: "Full Stack Developer",
      image: "/vi.jpg",
      instagram: "https://www.instagram.com/vitran712/",
      facebook: "https://www.facebook.com/tran.vi.209923?locale=vi_VN",
      skills: ["React", "Node.js", "MongoDB", "Php", "Laravel", "UI/UX"]
    },
    {
      id: 2,
      name: "Phan Minh Vân",
      position: "Frontend Developer",
      image: "/quan.jpg",
      instagram: "#",
      facebook: "https://www.facebook.com/van.phan.minh.563583?locale=vi_VN",
      skills: ["React", "Vite.js", "CSS/SCSS", "JavaScript"]
    },
    {
      id: 3,
      name: "Nguyễn Trần Minh Quân",
      position: "Product Owner",
      image: "/van.jpg",
      instagram: "https://www.instagram.com/nobitaco197/",
      facebook: "https://www.facebook.com/minhquan19072004",
      skills: ["Tester", "Q&A", "UI/UX"]
    },
    {
      id: 4,
      name: "Nguyễn Thiên Tú",
      position: "AI developer ",
      image: '/tu.jpg',
      facebook: "https://www.facebook.com/tu.nguyenthien.35",
      skills: ["MySQL", "php", "Marchine learning"]
    },
    {
      id: 5,
      name: "Nguyễn Thành Nhân",
      position: "AI developer ",
      image: "/nhan.jpg",
      facebook: "https://www.facebook.com/share/1AX2YpUXyD/",
      skills: ["Python", "Java", "Sorfware Achitectural Designer"]
    }
  ];

  const projectFeatures = [
    { icon: <FaRobot />, title: "Gợi ý thông minh", desc: "AI phân tích hành vi người dùng để đề xuất khách sạn phù hợp" },
    { icon: <FaCalendarCheck />, title: "Đặt phòng dễ dàng", desc: "Hệ thống booking tích hợp thanh toán trực tuyến" },
    { icon: <FaChartLine />, title: "Phân tích cá nhân hóa", desc: "Theo dõi và học hỏi từ sở thích du lịch của bạn" },
    { icon: <FaHotel />, title: "Đa dạng lựa chọn", desc: "Hàng nghìn khách sạn từ bình dân đến cao cấp" }
  ];

  const teamStats = [
    { icon: <FaUsers />, value: "05", label: "Thành viên năng động" },
    { icon: <FaCode />, value: "03", label: "Dự án demo & mini-project" },
    { icon: <FaRocket />, value: "Đang học", label: "Phát triển kỹ năng" },
    { icon: <FaHeart />, value: "100%", label: "Đam mê công nghệ" }
  ];

  return (
    <div className="page-wrapper">
      {/* Header Section */}
      <div className="about-header">
        <div className="about-header-content">
          <h1 className="about-title" style={{ marginTop: "50px" }}>Về Dự Án Của Chúng Tôi</h1>
          <p className="about-subtitle">
            Hệ thống gợi ý khách sạn thông minh tích hợp booking - Công nghệ AI phân tích hành vi người dùng
          </p>
        </div>
      </div>

      {/* Project Introduction Section */}
      <div className="project-intro-section">
        <div className="project-intro-content">
          <h2 className="section-title">HOTEL RECOMMENDATION SYSTEM</h2>
          <p className="project-description">
            Dự án của chúng tôi là một nền tảng web hiện đại sử dụng công nghệ AI và Machine Learning để
            phân tích hành vi người dùng, từ đó đưa ra các gợi ý khách sạn phù hợp nhất với sở thích và
            thói quen du lịch của từng cá nhân. Hệ thống tích hợp đầy đủ các chức năng đặt phòng, thanh toán
            và quản lý đặt chỗ thông minh.
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

      {/* Team Stats */}
      <div className="team-stats">
        {teamStats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Team Members Section */}
      <div className="team-section">
        <h2 className="section-title">Đội Ngũ Phát Triển</h2>
        <p className="section-subtitle">Những người đứng sau dự án thành công</p>

        <div className="team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="member-card">
              <div className="member-image-container">
                <img
                  src={member.image}
                  alt={member.name}
                  className="member-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
                  }}
                />
                <div className="member-social">
                  <a href={member.facebook} target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                    <FaFacebook />
                  </a>
                  <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                    <FaInstagram />
                  </a>
                </div>
              </div>

              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <p className="member-position">{member.position}</p>

                <div className="member-skills">
                  {member.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Section */}
      <div className="mission-section">
        <div className="mission-content">
          <h2 className="section-title">Tầm Nhìn & Sứ Mệnh</h2>
          <p className="mission-text">
            Chúng tôi hướng đến việc tạo ra một hệ sinh thái du lịch thông minh, nơi mỗi khách hàng
            đều có trải nghiệm đặt phòng khách sạn cá nhân hóa và hoàn hảo nhất. Sứ mệnh của chúng tôi
            là ứng dụng AI để thấu hiểu và phục vụ tốt hơn nhu cầu du lịch của người Việt.
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

      {/* CSS Styles */}
      <style jsx>{`
        .page-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .about-header {
          background: linear-gradient(to right, #4b6cb7, #182848);
          color: white;
          padding: 80px 20px;
          text-align: center;
          clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
        }
        
        .about-title {
          font-size: 3.5rem;
          margin-bottom: 20px;
          font-weight: 800;
          letter-spacing: -1px;
        }
        
        .about-subtitle {
          font-size: 1.2rem;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
          opacity: 0.9;
        }
        
        .project-intro-section {
          padding: 80px 20px;
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          margin-top: -40px;
          position: relative;
          z-index: 3;
        }
        
        .project-intro-content {
          text-align: center;
        }
        
        .project-description {
          font-size: 1.2rem;
          line-height: 1.8;
          color: #555;
          max-width: 900px;
          margin: 30px auto 50px;
        }
        
        .project-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin: 50px 0;
        }
        
        .feature-card {
          background: #f8f9ff;
          border-radius: 15px;
          padding: 30px 20px;
          transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-10px);
          background: linear-gradient(145deg, #4b6cb7, #3a56a5);
          color: white;
        }
        
        .feature-card:hover .feature-icon {
          color: white;
        }
        
        .feature-icon {
          font-size: 2.5rem;
          color: #4b6cb7;
          margin-bottom: 20px;
        }
        
        .feature-title {
          font-size: 1.4rem;
          margin-bottom: 10px;
          font-weight: 700;
        }
        
        .feature-desc {
          font-size: 0.95rem;
          opacity: 0.9;
          line-height: 1.6;
        }
        
        .tech-stack {
          margin-top: 60px;
          padding-top: 40px;
          border-top: 2px solid #eee;
        }
        
        .tech-stack h3 {
          font-size: 1.5rem;
          color: #182848;
          margin-bottom: 20px;
        }
        
        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
        }
        
        .tech-tag {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .team-stats {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 30px;
          margin: 60px auto;
          max-width: 1200px;
          padding: 0 20px;
          position: relative;
          z-index: 2;
        }
        
        .stat-card {
          background: white;
          border-radius: 15px;
          padding: 30px 25px;
          text-align: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          min-width: 180px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        
        .stat-icon {
          font-size: 2.5rem;
          color: #4b6cb7;
          margin-bottom: 15px;
        }
        
        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #182848;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 1rem;
          color: #666;
          font-weight: 500;
        }
        
        .team-section {
          padding: 80px 20px;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .section-title {
          text-align: center;
          font-size: 2.8rem;
          color: #182848;
          margin-bottom: 15px;
          font-weight: 700;
        }
        
        .section-subtitle {
          text-align: center;
          color: #666;
          font-size: 1.2rem;
          margin-bottom: 60px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }
        
        .member-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: all 0.4s ease;
          position: relative;
        }
        
        .member-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .member-image-container {
          position: relative;
          height: 280px;
          overflow: hidden;
        }
        
        .member-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .member-card:hover .member-image {
          transform: scale(1.05);
        }
        
        .member-social {
          position: absolute;
          bottom: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
        }
        
        .member-card:hover .member-social {
          opacity: 1;
          transform: translateY(0);
        }
        
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: white;
          color: #333;
          font-size: 1.2rem;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        
        .social-icon.facebook:hover {
          background: #3b5998;
          color: white;
        }
        
        .social-icon.instagram:hover {
          background: #e1306c;
          color: white;
        }
        
        .member-info {
          padding: 25px;
        }
        
        .member-name {
          font-size: 1.5rem;
          color: #182848;
          margin-bottom: 5px;
          font-weight: 700;
        }
        
        .member-position {
          color: #4b6cb7;
          font-size: 1rem;
          margin-bottom: 20px;
          font-weight: 600;
        }
        
        .member-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .skill-tag {
          background: #f0f4ff;
          color: #4b6cb7;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .mission-section {
          background: linear-gradient(to right, #182848, #4b6cb7);
          color: white;
          padding: 80px 20px;
          margin-top: 60px;
          clip-path: polygon(0 15%, 100% 0, 100% 100%, 0 100%);
        }
        
        .mission-content {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .mission-text {
          font-size: 1.2rem;
          line-height: 1.8;
          max-width: 800px;
          margin: 30px auto 60px;
          text-align: center;
          opacity: 0.9;
        }
        
        .mission-highlights {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 40px;
          margin-top: 50px;
        }
        
        .highlight {
          text-align: center;
          max-width: 300px;
          padding: 20px;
        }
        
        .highlight-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }
        
        .highlight h4 {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: white;
        }
        
        .highlight p {
          opacity: 0.8;
          line-height: 1.6;
        }
        
        /* Responsive Design */
        @media (max-width: 992px) {
          .team-stats {
            gap: 20px;
          }
          
          .stat-card {
            min-width: 160px;
            padding: 25px 20px;
          }
          
          .about-title {
            font-size: 2.8rem;
          }
          
          .section-title {
            font-size: 2.4rem;
          }
        }
        
        @media (max-width: 768px) {
          .project-intro-section {
            padding: 60px 20px;
            margin-top: -20px;
          }
          
          .team-stats {
            gap: 15px;
            margin-top: 40px;
          }
          
          .stat-card {
            min-width: calc(50% - 30px);
            padding: 20px 15px;
          }
          
          .about-title {
            font-size: 2.2rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .project-features {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .team-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          }
          
          .mission-highlights {
            flex-direction: column;
            align-items: center;
          }

          .mission-section {
            clip-path: polygon(0 5%, 100% 0, 100% 100%, 0 100%);
          }
        }
        
        @media (max-width: 576px) {
          .about-header {
            padding: 60px 20px;
          }
          
          .about-title {
            font-size: 1.8rem;
          }
          
          .team-stats {
            flex-direction: column;
            align-items: center;
          }
          
          .stat-card {
            width: 80%;
            min-width: auto;
          }
          
          .team-section {
            padding: 60px 20px;
          }
          
          .member-image-container {
            height: 250px;
          }
          
          .tech-tags {
            flex-direction: column;
            align-items: center;
          }
          
          .tech-tag {
            width: fit-content;
          }
        }
      `}</style>
    </div>
  );
};

export default About;