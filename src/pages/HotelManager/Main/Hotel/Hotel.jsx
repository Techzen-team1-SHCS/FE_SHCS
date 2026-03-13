import styles from "./HotelManagement.module.css";
import { useState } from "react";
import { hotels } from "../../Mock/hotelData";
import { HOTEL_TABS } from "../../Constants/Hotel/hotelTabs";
import { HOTEL_TABLE_COLUMNS } from "../../Constants/Hotel/hotelTableColumns";
import { HOTEL_STATUS } from "../../Constants/Hotel/hotelStatus";
import { useHotelManagement } from "../../hooks/useHotelManagement";
import { filterHotels } from "../../Helpers/HotelHelpers";
import {getPaginationPages } from "../../Helpers/HotelHelpers"

export default function HotelManagement() {
  const {
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    currentHotels,
    totalPages,
  } = useHotelManagement(hotels, 5); // số dòng mỗi trang

  // ===== FILTER =====
  const filteredHotels = filterHotels(hotels, activeTab);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.tabs}>
          {HOTEL_TABS.map((tab) => (
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
            <tr>
              {HOTEL_TABLE_COLUMNS.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
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
                      hotel.status === HOTEL_STATUS.OPEN
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
          {getPaginationPages(totalPages).map((num) => (
            <button
              key={num}
              className={`${styles.pageBtn} ${
                num === currentPage ? styles.activePage : ""
              }`}
              onClick={() => setCurrentPage(num)}
            >
              {num}
            </button>
          ))}
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
