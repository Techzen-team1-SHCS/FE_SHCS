import React, { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import BookingCard from "../../components/BookingCard/BookingCard.jsx";
import EmptyState from "../../components/EmptyState/EmptyState.jsx";
const Profile = () => {
  const mockData = {
    active: [
      
    ],
    past: [
      {
        id: 2,
        city: "Đà Nẵng",
        name: "Sea Hotel",
        date: "02 - 03 tháng 5, 2025",
        price: "650.000 VNĐ",
        status: "Đã qua",
        image: "/assets/images/hotel2.jpg",
      },
    ],
    canceled: [
      {
        id: 1,
        city: "Huế",
        name: "Yên Homestay",
        date: "07 - 08 tháng 6, 2025",
        price: "396.000 VNĐ",
        status: "Đã hoàn thành",
        image: "/assets/images/hotel1.jpg",
      },
    ],
  };
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const fetchData = async (tab) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400)); // fake delay
    setBookings(mockData[tab] || []);
    setLoading(false);
  };
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  return (
    <div className={styles.container}>
      <div className={styles.banner}>
        <img src="/assets/images/backgrounds/beach-bg.png" alt="Banner" />
      </div>

      <div className={styles.tabs}>
        {["active", "past", "canceled"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${styles.button} ${activeTab === tab ? styles.active : ""}`}

          >
            {tab === "active" && "Đang hoạt động"}
            {tab === "past" && "Đã qua"}
            {tab === "canceled" && "Đã hủy"}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        {loading ? (
          <p>Đang tải...</p>
        ) : bookings.length === 0 ? (
          <EmptyState />
        ) : (
          bookings.map((b) => <BookingCard key={b.id} booking={b} />)
        )}
      </div>
    </div>
  )
}

export default Profile
