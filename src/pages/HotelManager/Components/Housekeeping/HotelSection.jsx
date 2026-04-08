import { useState } from "react";
import { HK_STATUS_CONFIG } from "../../Constants/Housekeeping/housekeepingConstants";
import styles from "./RoomStatusGrid.module.css";
import { FiMapPin, FiChevronDown, FiChevronUp, FiHome } from "react-icons/fi";
import RoomCard from "./RoomCard";

const HK_STATUSES = Object.keys(HK_STATUS_CONFIG);

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

export default HotelSection;
