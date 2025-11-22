import React, { useState } from "react";
import styles from "./Notification.module.css";
const NOTIFICATION_TYPES = {
  booking: {
    icon: "/assets/images/icons/book.png",
    bg: "#E5EEFF",
  },
  hotel: {
    icon: "/assets/images/icons/new-hotel.png",
    bg: "#FFE7D6",
  },
  warning: {
    icon: "/assets/images/icons/report.png",
    bg: "#FFE4E4",
  },
  payment: {
    icon: "/assets/images/icons/payment.png",
    bg: "#E5F8FF",
  },
  system: {
    icon: "/assets/images/icons/update.png",
    bg: "#ECE3FF",
  },
};

const Notification = () => {
  const {
    pageContainer,
    tabContainer,
    tab,
    activeTab,
    card,
    left,
    iconBox,
    title,
    description,
    right,
    date,
    time,
    dot,
  } = styles;

  // ----------------------------
  // 1. State quản lý tab
  // ----------------------------
  const [currentTab, setCurrentTab] = useState("All");

  // ----------------------------
  // 2. Notifications + trạng thái đọc
  // ----------------------------
  const notifications = [
    {
      type: "booking",
      title: "New Booking Received",
      desc: "Hotel Hilton Da Nang just received an order from user Minh Quan",
      date: "17/11/2025",
      time: "10 minutes ago",
      read: false,
    },
    {
      type: "hotel",
      title: "New Hotel Registered",
      desc: "Hotel Hilton Da Nang is Registered",
      date: "17/11/2025",
      time: "10 minutes ago",
      read: true,
    },
    {
      type: "warning",
      title: "New Review Reported",
      desc: "Review has been reported bad by user Minh Quan",
      date: "17/11/2025",
      time: "10 minutes ago",
      read: false,
    },
    {
      type: "payment",
      title: "Payment Received",
      desc: "order payment #1234 was successful",
      date: "17/11/2025",
      time: "10 minutes ago",
      read: true,
    },
    {
      type: "system",
      title: "System Update",
      desc: "The system will be down for maintenance today",
      date: "17/11/2025",
      time: "10 minutes ago",
      read: false,
    },
  ];


  // ----------------------------
  // 3. Lọc theo tab
  // ----------------------------
  const filtered = notifications.filter(n => {
    if (currentTab === "All") return true;
    if (currentTab === "Read") return n.read === true;
    if (currentTab === "Unread") return n.read === false;
    return true;
  });

  return (
    <div className={pageContainer}>
      {/* Tabs */}
      <div className={tabContainer}>

        <button
          className={currentTab === "All" ? activeTab : tab}
          onClick={() => setCurrentTab("All")}
        >
          All
        </button>

        <button
          className={currentTab === "Read" ? activeTab : tab}
          onClick={() => setCurrentTab("Read")}
        >
          Read
        </button>

        <button
          className={currentTab === "Unread" ? activeTab : tab}
          onClick={() => setCurrentTab("Unread")}
        >
          Unread
        </button>

      </div>

      {/* Notification items */}
      {filtered.map((n, i) => (
        <div className={card} key={i}>
          <div className={left}>
            <div className={iconBox} style={{ background: NOTIFICATION_TYPES[n.type].bg }}>
              <img src={NOTIFICATION_TYPES[n.type].icon} alt="icon" />
            </div>
            <div>
              <div className={title}>{n.title}</div>
              <div className={description}>{n.desc}</div>
            </div>
          </div>

          <div className={right}>
            <div className={date}>{n.date}</div>
            <div className={time}>{n.time}</div>
            {/* dot chỉ hiện với unread */}
            {!n.read && <div className={dot}></div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
