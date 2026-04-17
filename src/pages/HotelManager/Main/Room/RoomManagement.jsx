import styles from "./RoomManagement.module.css";
import RoomTable from "../../Components/RoomManagement/RoomTable";
import { useRoomManagement } from "../../hooks/useRoomManagement";
import { useNavigate } from "react-router-dom";

const TABS = ["All", "Available", "Booked", "Needs Cleaning"];

const RoomManagementPage = () => {
  const navigate = useNavigate();
  const {
    rooms,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    pages,
    totalPages,
    isRoomSelected,
    toggleSelectedRoom,
    selectAll,
    selectedRoomIds,
    roomCount,
  } = useRoomManagement(10);

  const allSelected =
    rooms.length > 0 && rooms.every((room) => selectedRoomIds.includes(room.id));

  return (
    <div className={styles.container}>
      <div className={styles.alertCard}>
        <div>
          <strong>Room alert</strong>
          <p>You have {roomCount} rooms that require urgent housekeeping!</p>
        </div>
        <button className={styles.viewDetails}>View details</button>
      </div>

      <div className={styles.headerRow}>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          className={styles.addRoomBtn}
          onClick={() => navigate('/hotel-manager/rooms/add')}
        >
          + Add a new room
        </button>
      </div>

      <div className={styles.filterRow}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <RoomTable
        rooms={rooms}
        isRoomSelected={isRoomSelected}
        toggleSelectedRoom={toggleSelectedRoom}
        selectAll={selectAll}
        allSelected={allSelected}
      />

      <div className={styles.pagination}>
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <div className={styles.pages}>
          {pages.map((page) => (
            <button
              key={page}
              className={currentPage === page ? styles.activePage : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RoomManagementPage;
