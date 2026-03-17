import React from "react";
import { Link } from "react-router-dom";
import styles from "../../Profile.module.css";

const ProfileSidebar = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logo}>
        <Link to="/">
          <div
            className={styles.logoContainer}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <img
              src="/assets/images/logos/logo.png"
              alt="Logo"
              className={styles.logoImage}
              style={{ marginTop: "30px" }}
            />
          </div>
        </Link>
      </div>

      <nav className={styles.sidebarNav}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${styles.navButton} ${
              activeTab === tab.id ? styles.active : ""
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabLabel}>{tab.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default ProfileSidebar;