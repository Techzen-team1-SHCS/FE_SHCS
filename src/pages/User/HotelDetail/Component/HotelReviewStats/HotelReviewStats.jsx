import React from 'react';
import styles from './HotelReviewStats.module.css';
import PartLoading from '../../../../../components/Loading/PartLoading';

const HotelReviewStats = ({ statsData = null, loading = false }) => {
  const {
    reviewStats,
    statsHeader,
    statsGrid,
    statItem,
    statCategory,
    statBar,
    statBarFill,
    statPercentage,
    statRow,
    loadingText
  } = styles;

  const defaultStats = [
    { category: "Service staff", percentage: 73 },
    { category: "Convenient", percentage: 90 },
    { category: "Free wifi", percentage: 83 },
    { category: "Clean", percentage: 69 },
    { category: "Value for money", percentage: 91 },
    { category: "Comfortable", percentage: 98 }
  ];

  // Chuyển đổi data từ API sang format component
  const transformApiData = (apiData) => {
    if (!apiData) return defaultStats;

    return [
      { category: "Service staff", percentage: apiData.service_staff || 0 },
      { category: "Convenient", percentage: apiData.convenient || 0 },
      { category: "Free wifi", percentage: apiData.free_wifi || 0 },
      { category: "Clean", percentage: apiData.clean || 0 },
      { category: "Value for money", percentage: apiData.value_for_money || 0 },
      { category: "Comfortable", percentage: apiData.comfortable || 0 }
    ];
  };

  const displayStats = statsData ? transformApiData(statsData) : defaultStats;

  if (loading) {
    return (
      <div className={reviewStats}>
        <div className={loadingText}><PartLoading /></div>
      </div>
    );
  }

  return (
    <div className={reviewStats}>
      <div className={statsHeader}>
        <h3>Customer reviews</h3>
      </div>

      <div className={statsGrid}>
        {displayStats.map((stat, index) => (
          <div key={index} className={statItem}>
            <div className={statRow}>
              <span className={statCategory}>{stat.category}</span>
              <span className={statPercentage}>{stat.percentage}%</span>
            </div>
            <div className={statBar}>
              <div
                className={statBarFill}
                style={{ width: `${stat.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelReviewStats;