import styles from "./HotelManagement.module.css";
// import { hotels } from "../../Mock/hotelData"; // bỏ
import { HOTEL_TABS } from "../../Constants/Hotel/hotelTabs";
import { HOTEL_TABLE_COLUMNS } from "../../Constants/Hotel/hotelTableColumns";
import { HOTEL_STATUS } from "../../Constants/Hotel/hotelStatus";
import { useHotelManagement } from "../../hooks/useHotelManagement";
import { getPaginationPages } from "../../Helpers/HotelHelpers";
import PartLoading from "../../../../components/Loading/PartLoading";

export default function HotelManagement() {
  const {
    loading,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    currentHotels,
    totalPages,
  } = useHotelManagement(5);

  if (loading) {
    return <div><PartLoading /></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.tabs}>
          {HOTEL_TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""
                }`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.searchBox}>
          <input placeholder="Search by room number" value={search} onChange={(e) => setSearch(e.target.value)} />
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
              <tr key={hotel.id}>
                <td>{hotel.name}</td>
                <td>{hotel.hotelId || hotel.id}</td>
                <td>{hotel.rating || "-"}</td>
                <td>{hotel.revenue || "-"}</td>
                <td>{hotel.totalRooms || "-"}</td>
                <td>{hotel.availableRooms || "-"}</td>
                <td>{hotel.date || "-"}</td>
                <td>
                  <span
                    className={`${styles.status} ${hotel.status === HOTEL_STATUS.OPEN
                        ? styles.open
                        : styles.close
                      }`}
                  >
                    {hotel.status || HOTEL_STATUS.CLOSE}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              className={`${styles.pageBtn} ${num === currentPage ? styles.activePage : ""
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