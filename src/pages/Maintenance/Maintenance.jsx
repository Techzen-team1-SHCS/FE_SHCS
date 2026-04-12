import React, { useEffect } from 'react';
import './Maintenance.css';

const Maintenance = () => {

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { default: api } = await import('../../services/api.js');
        const res = await api.get('/auth/maintenance/status');

        // Nếu hệ thống đã tắt bảo trì
        if (!res.data.is_maintenance) {
          const lastPath = localStorage.getItem('lastPathBeforeMaintenance') || '/';
          localStorage.removeItem('lastPathBeforeMaintenance');
          window.location.href = lastPath;
        }
      } catch (error) {
        console.error("Failed to check maintenance status", error);
      }
    };

    // Kiểm tra liên tục mỗi 5s
    const interval = setInterval(checkStatus, 2000);
    checkStatus();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="maintenance-container">
      <div className="maintenance-content">
        <div className="maintenance-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="maintenance-title">Hệ thống đang bảo trì</h1>
        <p className="maintenance-description">
          Hệ thống đang được nâng cấp để phục vụ bạn tốt hơn. Vui lòng quay lại sau.
        </p>
        <div className="maintenance-loader">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
