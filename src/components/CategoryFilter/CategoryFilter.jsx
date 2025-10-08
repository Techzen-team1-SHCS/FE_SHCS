import React, { useState } from 'react';

const CategoryFilter = () => {
  const [selectedActivity, setSelectedActivity] = useState('All');

  const activities = [
    { id: 'All', label: 'All' },
    { id: 'activity1', label: 'Sea Beach'},
    { id: 'activity2', label: 'Car Parking' },
    { id: 'activity3', label: 'Laundry Service' },
    { id: 'activity4', label: 'Outdoor Seating' },
    { id: 'activity5', label: 'Reservations'},
    { id: 'activity6', label: 'Smoking Allowed' }
  ];

  const handleActivityChange = (activityId) => {
    setSelectedActivity(activityId);
  };

  return (
    <div 
      className="widget widget-activity" 
      data-aos="fade-up" 
      data-aos-duration="1500" 
      data-aos-offset="50"
    >
      <h6 className="widget-title">By Category</h6>
      <ul className="radio-filter">
        {activities.map((activity) => (
          <li key={activity.id}>
            <input
              className="form-check-input"
              type="radio"
              checked={selectedActivity === activity.id}
              onChange={() => handleActivityChange(activity.id)}
              name="ByActivities"
              id={activity.id}
            />
            <label htmlFor={activity.id}>
              {activity.label} 
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;