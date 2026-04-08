import { useState } from "react";
import { HK_STATUS_CONFIG } from "../../Constants/Housekeeping/housekeepingConstants";
import styles from "./RoomStatusGrid.module.css";
import { FiHome } from "react-icons/fi";
import HotelSection from "./HotelSection";

// ─── Main RoomStatusGrid ──────────────────────────────────────────────────
const RoomStatusGrid = ({ rooms, loadingRooms, onUpdateRoomStatus, roomFilter, setRoomFilter, globalHkStats = {}, totalRooms = 0 }) => {
  const [hotelFilter, setHotelFilter] = useState("");

  // rooms is now an array of hotel groups: [{hotel_id, hotel_name, rooms, stats, total}]
  const hotelGroups = Array.isArray(rooms) ? rooms : [];

  // Use global stats from Dashboard API instead of calculating from filtered rooms
  const totalStats = {
    total: totalRooms,
    ...globalHkStats
  };

  const visibleGroups = hotelFilter
    ? hotelGroups.filter((h) => String(h.hotel_id) === String(hotelFilter))
    : hotelGroups;

  return (
    <div className={styles.container}>

      {/* ── Top toolbar ── */}
      <div className={styles.toolbar}>
        {/* Global HK status filter */}
        <div className={styles.statusFilters}>
          <button
            className={`${styles.statusBtn} ${roomFilter === "" ? styles.statusBtnActive : ""}`}
            onClick={() => setRoomFilter("")}
          >
            Tất cả ({totalStats.total})
          </button>
          {Object.entries(HK_STATUS_CONFIG).map(([s, cfg]) => {
            const count = totalStats[s] || 0;
            return (
              <button
                key={s}
                className={`${styles.statusBtn} ${roomFilter === s ? styles.statusBtnActive : ""}`}
                style={roomFilter === s ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color } : {}}
                onClick={() => setRoomFilter(roomFilter === s ? "" : s)}
              >
                {cfg.dot} {cfg.label}
                <span className={styles.statusCount}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Hotel filter dropdown */}
        {hotelGroups.length > 1 && (
          <div className={styles.hotelDropdownWrap}>
            <FiHome size={13} color="#64748b" />
            <select
              className={styles.hotelDropdown}
              value={hotelFilter}
              onChange={(e) => setHotelFilter(e.target.value)}
            >
              <option value="">Tất cả khách sạn ({hotelGroups.length})</option>
              {hotelGroups.map((h) => (
                <option key={h.hotel_id} value={h.hotel_id}>
                  {h.hotel_name} ({h.total} phòng)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Loading ── */}
      {loadingRooms ? (
        <div className={styles.loadingWrap}>
          {[1, 2].map((i) => (
            <div key={i} className={styles.skeletonSection}>
              <div className={styles.skeletonHeader} />
              <div className={styles.skeletonGrid}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <div key={j} className={styles.skeletonCard} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : visibleGroups.length === 0 ? (
        <div className={styles.emptyState}>
          <FiHome size={40} color="#cbd5e1" />
          <p>Không có dữ liệu phòng</p>
          <span>Hãy thêm phòng vào khách sạn của bạn trước</span>
        </div>
      ) : (
        <div className={styles.sectionsWrap}>
          {visibleGroups.map((hotelGroup) => (
            <HotelSection
              key={hotelGroup.hotel_id}
              hotelGroup={hotelGroup}
              globalHkFilter={roomFilter}
              onUpdateRoomStatus={onUpdateRoomStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomStatusGrid;
