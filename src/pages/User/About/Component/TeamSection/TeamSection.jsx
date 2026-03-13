import { FaFacebook, FaInstagram } from "react-icons/fa";

const TeamSection = ({ teamMembers }) => {
  return (
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
                  e.target.src =
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde";
                }}
              />

              <div className="member-social">
                <a
                  href={member.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon facebook"
                >
                  <FaFacebook />
                </a>

                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon instagram"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>

            <div className="member-info">
              <h3 className="member-name">{member.name}</h3>
              <p className="member-position">{member.position}</p>

              <div className="member-skills">
                {member.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;