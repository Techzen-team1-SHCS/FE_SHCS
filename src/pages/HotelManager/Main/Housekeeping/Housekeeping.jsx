import styles from "./Housekeeping.module.css";
import HousekeepingChart from "../../Components/Housekeeping/HousekeepingChart";
import HousekeepingTable from "../../Components/Housekeeping/HousekeepingTable";
import { useHousekeepingManagement } from "../../hooks/useHousekeepingManagement";
import { HOUSEKEEPING_TABS } from "../../Constants/Housekeeping/housekeepingTabs";
import { housekeepingStatistics } from "../../Mock/housekeepingData";
import HousekeepingModal from "../../Components/Housekeeping/HousekeepingModal";

const HousekeepingPage = () => {
  const {
    schedules,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    pages,
    totalPages,
    isModalOpen,
    modalData,
    handleOpenAddModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveSchedule,
  } = useHousekeepingManagement(10);

  const managementColors = ["#10b981", "#fbbf24", "#ef4444", "#d1d5db"];
  const cleanlinessColors = ["#10b981", "#fbbf24", "#ef4444", "#9ca3af"];

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>House keeping</h1>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        <HousekeepingChart
          title="House keeping management"
          data={housekeepingStatistics.management}
          colors={managementColors}
        />
        <HousekeepingChart
          title="Cleanliness score"
          data={housekeepingStatistics.cleanliness}
          colors={cleanlinessColors}
        />
      </div>

      {/* Tabs and Actions */}
      <div className={styles.headerRow}>
        <div className={styles.tabs}>
          {HOUSEKEEPING_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        <div className={styles.actions}>
          <button className={styles.filterBtn}>🔽 Filter</button>
          <button className={styles.addBtn} onClick={handleOpenAddModal}>+ Add new schedule</button>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search schedule..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Table */}
      <HousekeepingTable schedules={schedules} onEdit={handleOpenEditModal} />

      {/* Pagination */}
      <div className={styles.pagination}>
        <span className={styles.pageInfo}>
          1 - 10 / 100
        </span>
        <span className={styles.recordsPerPage}>
          Records per page: <select><option>10</option></select>
        </span>
        <div className={styles.paginationButtons}>
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

      <HousekeepingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveSchedule}
        initialData={modalData}
      />
    </div>
  );
};

export default HousekeepingPage;
