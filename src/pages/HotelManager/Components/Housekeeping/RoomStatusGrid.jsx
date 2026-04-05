import { useState } from "react";
import { HK_STATUS_CONFIG } from "../../Constants/Housekeeping/housekeepingConstants";
import styles from "./RoomStatusGrid.module.css";
import { FiUser, FiMapPin, FiChevronDown, FiChevronUp, FiHome } from "react-icons/fi";

const HK_STATUSES = Object.keys(HK_STATUS_CONFIG);

// ─── Single Room Card ─────────────────────────────────────────────────────
const RoomCard = ({ room, onSelect }) => {
  const cfg = HK_STATUS_CONFIG[room.hk_status] || HK_STATUS_CONFIG.dirty;
  return (
    <div
      className={styles.roomCard}
      style={{ "--status-color": cfg.color, "--status-bg": cfg.bg, "--status-border": cfg.border }}
      onClick={() => onSelect(room)}
      title={`Phòng ${room.room_number} — ${cfg.labelVi}`}
    >
      {/* Top stripe */}
      <div className={styles.roomStripe} style={{ background: cfg.color }} />

      <div className={styles.roomCardInner}>
        <div className={styles.roomTop}>
          <span className={styles.roomNumber}>
            {room.room_number}
          </span>
          <div className={styles.roomFlags}>
            {room.do_not_disturb && (
              <span className={styles.dndBadge} title="Do Not Disturb">🚫</span>
            )}
          </div>
        </div>

        {room.room?.room_type && (
          <span className={styles.roomType}>{room.room.room_type}</span>
        )}

        {/* Status badge */}
        <div className={styles.statusBadge} style={{ color: cfg.color, background: cfg.bg }}>
          <span>{cfg.dot}</span>
          <span>{cfg.label}</span>
        </div>

        {/* FO Status */}
        <div className={`${styles.foStatus} ${room.fo_status === "occupied" ? styles.foOccupied : styles.foVacant}`}>
          <FiUser size={10} />
          <span>{room.fo_status === "occupied" ? "Có khách" : "Trống"}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Hotel Section ────────────────────────────────────────────────────────
const HotelSection = ({ hotelGroup, globalHkFilter, onUpdateRoomStatus }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newFoStatus, setNewFoStatus] = useState("");
  const [dnd, setDnd] = useState(false);
  const [saving, setSaving] = useState(false);

  const { hotel_name, hotel_address, stats, rooms, total, hotel_id } = hotelGroup;

  // Apply global hk filter inside section too
  const filteredRooms = globalHkFilter
    ? rooms.filter((r) => r.hk_status === globalHkFilter)
    : rooms;

  const handleSelect = (room) => {
    setSelectedRoom(room);
    setNewStatus(room.hk_status);
    setNewFoStatus(room.fo_status);
    setDnd(room.do_not_disturb);
  };

  const handleSave = async () => {
    if (!selectedRoom) return;
    setSaving(true);
    try {
      await onUpdateRoomStatus(selectedRoom.id, {
        hk_status: newStatus,
        fo_status: newFoStatus,
        do_not_disturb: dnd,
      });
      setSelectedRoom(null);
    } finally {
      setSaving(false);
    }
  };

  // Stat bar widths
  const dirtyPct   = total > 0 ? Math.round((stats.dirty / total) * 100)   : 0;
  const cleanPct   = total > 0 ? Math.round((stats.clean / total) * 100)   : 0;
  const cleaningPct= total > 0 ? Math.round((stats.cleaning / total) * 100) : 0;
  const oooPct     = total > 0 ? Math.round((stats["out-of-order"] / total) * 100) : 0;

  return (
    <div className={styles.hotelSection}>
      {/* Hotel Header */}
      <div
        className={styles.hotelHeader}
        onClick={() => setCollapsed((v) => !v)}
      >
        <div className={styles.hotelHeaderLeft}>
          <div className={styles.hotelIcon}>
            <FiHome size={16} color="#fff" />
          </div>
          <div>
            <h3 className={styles.hotelName}>{hotel_name}</h3>
            {hotel_address && (
              <p className={styles.hotelAddress}>
                <FiMapPin size={11} /> {hotel_address}
              </p>
            )}
          </div>
        </div>

        <div className={styles.hotelHeaderRight}>
          {/* Mini stat pills */}
          <div className={styles.hotelStats}>
            {stats.dirty > 0 && (
              <span className={styles.statPill} style={{ background: "#fef2f2", color: "#ef4444" }}>
                🔴 {stats.dirty} bẩn
              </span>
            )}
            {stats.cleaning > 0 && (
              <span className={styles.statPill} style={{ background: "#fffbeb", color: "#f59e0b" }}>
                🟡 {stats.cleaning} đang dọn
              </span>
            )}
            {stats.clean > 0 && (
              <span className={styles.statPill} style={{ background: "#f0fdf4", color: "#10b981" }}>
                🟢 {stats.clean} sạch
              </span>
            )}
            {stats["out-of-order"] > 0 && (
              <span className={styles.statPill} style={{ background: "#f9fafb", color: "#6b7280" }}>
                ⚫ {stats["out-of-order"]} bảo trì
              </span>
            )}
            <span className={styles.totalPill}>{total} phòng</span>
          </div>

          <button className={styles.collapseBtn}>
            {collapsed ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {!collapsed && (
        <div className={styles.progressBar}>
          <div className={styles.progressTrack}>
            {cleanPct > 0 && <div className={styles.progressFill} style={{ width: `${cleanPct}%`, background: "#10b981" }} />}
            {cleaningPct > 0 && <div className={styles.progressFill} style={{ width: `${cleaningPct}%`, background: "#f59e0b" }} />}
            {dirtyPct > 0 && <div className={styles.progressFill} style={{ width: `${dirtyPct}%`, background: "#ef4444" }} />}
            {oooPct > 0 && <div className={styles.progressFill} style={{ width: `${oooPct}%`, background: "#9ca3af" }} />}
          </div>
          <span className={styles.progressLabel}>
            {cleanPct}% sạch
          </span>
        </div>
      )}

      {/* Rooms grid */}
      {!collapsed && (
        <div className={styles.hotelBody}>
          {filteredRooms.length === 0 ? (
            <div className={styles.noRooms}>Không có phòng phù hợp với bộ lọc</div>
          ) : (
            <div className={styles.roomsGrid}>
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} onSelect={handleSelect} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {selectedRoom && (
        <div className={styles.overlay} onClick={() => setSelectedRoom(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <h3 className={styles.modalTitle}>
                  Phòng {selectedRoom.room_number}
                </h3>
                <p className={styles.modalHotel}>📍 {hotel_name}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelectedRoom(null)}>✕</button>
            </div>

            <div className={styles.modalBody}>
              <label className={styles.fieldLabel}>
                🏠 Trạng thái Housekeeping
                <select
                  className={styles.fieldSelect}
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {HK_STATUSES.map((s) => {
                    const c = HK_STATUS_CONFIG[s];
                    return (
                      <option key={s} value={s}>
                        {c.dot} {c.label} — {c.labelVi}
                      </option>
                    );
                  })}
                </select>
              </label>

              <label className={styles.fieldLabel}>
                🛎️ Trạng thái Lễ tân (FO)
                <select
                  className={styles.fieldSelect}
                  value={newFoStatus}
                  onChange={(e) => setNewFoStatus(e.target.value)}
                >
                  <option value="vacant">⚪ Vacant — Phòng trống</option>
                  <option value="occupied">🟠 Occupied — Có khách</option>
                </select>
              </label>

              <label className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={dnd}
                  onChange={(e) => setDnd(e.target.checked)}
                  className={styles.checkbox}
                />
                <div>
                  <span className={styles.checkboxTitle}>🚫 Do Not Disturb</span>
                  <span className={styles.checkboxDesc}>Khách treo biển — không vào dọn</span>
                </div>
              </label>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setSelectedRoom(null)}>
                Hủy
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "💾 Lưu trạng thái"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main RoomStatusGrid ──────────────────────────────────────────────────
const RoomStatusGrid = ({ rooms, loadingRooms, onUpdateRoomStatus, roomFilter, setRoomFilter }) => {
  const [hotelFilter, setHotelFilter] = useState("");

  // rooms is now an array of hotel groups: [{hotel_id, hotel_name, rooms, stats, total}]
  const hotelGroups = Array.isArray(rooms) ? rooms : [];

  // Aggregate total counts across all hotels
  const totalStats = hotelGroups.reduce(
    (acc, h) => {
      acc.total += h.total;
      Object.keys(h.stats || {}).forEach((k) => { acc[k] = (acc[k] || 0) + h.stats[k]; });
      return acc;
    },
    { total: 0 }
  );

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
