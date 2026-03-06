import styles from "./HotelManagement.module.css";
import { useState } from "react";

const hotels = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1,
  name: "Tran Vy Homestay",
  hotelId: "12345",
  rating: 4.2,
  revenue: "250,000,000 vnd",
  totalRooms: 120,
  availableRooms: 50,
  date: "14-Aug-2023 at 12:00 AM",
  status: i % 2 === 0 ? "Open" : "Close",
}));

export default function HotelManagement() {
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5; // số dòng mỗi trang
  
  // ===== FILTER =====
  const filteredHotels =
    activeTab === "All"
      ? hotels
      : hotels.filter((hotel) => hotel.status === activeTab);

  // ===== PHÂN TRANG =====
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHotels = filteredHotels.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.tabs}>
          {["All", "Open", "Close"].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${
                activeTab === tab ? styles.activeTab : ""
              }`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1); // reset về trang 1 khi đổi tab
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <input placeholder="Search by room number" />
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr >
              <th>Hotel name</th>
              <th>ID hotel</th>
              <th>Avg rating</th>
              <th>Revenue today</th>
              <th>Total rooms</th>
              <th>Available rooms</th>
              <th>Registration date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {currentHotels.map((hotel) => (
              <tr key={hotel.id} className={styles.tr}>
                <td>{hotel.name}</td>
                <td>{hotel.hotelId}</td>
                <td>{hotel.rating}</td>
                <td>{hotel.revenue}</td>
                <td>{hotel.totalRooms}</td>
                <td>{hotel.availableRooms}</td>
                <td>{hotel.date}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      hotel.status === "Open"
                        ? styles.open
                        : styles.close
                    }`}
                  >
                    {hotel.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION UI giữ nguyên ===== */}
      <div className={styles.pagination}>
        <button
          className={styles.prev}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <div className={styles.pages}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (num) => (
              <button
                key={num}
                className={`${styles.pageBtn} ${
                  num === currentPage ? styles.activePage : ""
                }`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            )
          )}
        </div>

        <button
          className={styles.next}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}