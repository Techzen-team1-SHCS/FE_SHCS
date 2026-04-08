import { useState } from "react";
import styles from "./Housekeeping.module.css";
import { useHousekeepingManagement } from "../../hooks/useHousekeepingManagement";
import {
  HK_TABS,
  HK_STATUS_CONFIG,
  TASK_STATUS_CONFIG,
} from "../../Constants/Housekeeping/housekeepingConstants";

// Components
import HousekeepingChart from "../../Components/Housekeeping/HousekeepingChart";
import TaskBoardView from "../../Components/Housekeeping/TaskBoardView";
import RoomStatusGrid from "../../Components/Housekeeping/RoomStatusGrid";
import MaintenanceIssuesTable from "../../Components/Housekeeping/MaintenanceIssuesTable";
import TaskFormModal from "../../Components/Housekeeping/TaskFormModal";
import IssueFormModal from "../../Components/Housekeeping/IssueFormModal";

// Icons
import {
  FiRefreshCw,
  FiPlus,
  FiCalendar,
  FiFilter,
  FiUsers,
  FiZap,
  FiClipboard,
  FiGrid,
  FiTool,
  FiCheckCircle,
  FiClock,
  FiAlertOctagon,
  FiHome,
} from "react-icons/fi";

import TaskFilterBar from "../../Components/Housekeeping/TaskFilterBar";
import StatCard from "../../Components/Housekeeping/StatCard";

// ─── Main Page ───────────────────────────────────────────────────────────────
const HousekeepingPage = () => {
  const [activeTab, setActiveTab] = useState("tasks");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    dashboard,
    loadingDashboard,
    tasks,
    tasksMeta,
    loadingTasks,
    rooms,
    loadingRooms,
    issues,
    issuesMeta,
    loadingIssues,
    staff,
    taskFilters,
    setTaskFilters,
    issueFilters,
    setIssueFilters,
    roomFilter,
    setRoomFilter,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchRooms,
    updateRoomStatus,
    fetchIssues,
    createIssue,
    updateIssueStatus,
    refreshAll,
  } = useHousekeepingManagement();

  // ── Handlers
  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshAll();
    setRefreshing(false);
  };

  const handleUpdateTaskStatus = async (id, newStatus) => {
    await updateTask(id, { task_status: newStatus });
  };

  const handleEditTask = (task) => {
    setEditTask(task);
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = async (payload) => {
    if (editTask) await updateTask(editTask.id, payload);
    else await createTask(payload);
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhiệm vụ này không?")) {
      await deleteTask(id);
    }
  };

  const handleOpenTaskModal = () => {
    setEditTask(null);
    setTaskModalOpen(true);
  };

  const handleTaskFilterChange = (key, value) => {
    const f = { ...taskFilters, [key]: value, page: 1 };
    setTaskFilters(f);
  };

  const handleIssueFilterChange = (newFilters) => {
    setIssueFilters(newFilters);
  };

  // ── Compute chart data from dashboard
  const hkStats = dashboard?.hk_status || {};
  const todayTasks = dashboard?.tasks_today || {};
  const issStats = dashboard?.issues || {};

  const hkChartData = {
    "🟢 Sạch":       Number(hkStats.clean      || 0),
    "🟡 Đang dọn":   Number(hkStats.cleaning   || 0),
    "🔴 Cần dọn":    Number(hkStats.dirty      || 0),
    "⚫ Bảo trì":    Number(hkStats["out-of-order"] || 0),
  };
  const taskChartData = {
    "✅ Xong":        Number(todayTasks.completed  || 0),
    "🔄 Đang làm":   Number(todayTasks["in-progress"] || 0),
    "⏳ Chờ":         Number(todayTasks.pending   || 0),
    "⏭️ Bỏ qua":     Number(todayTasks.skipped   || 0),
  };

  const hkColors  = ["#10b981", "#f59e0b", "#ef4444", "#6b7280"];
  const taskColors = ["#10b981", "#3b82f6", "#f59e0b", "#9ca3af"];

  const totalTasksToday = Object.values(todayTasks).reduce((a, b) => a + Number(b), 0);
  const completedToday  = Number(todayTasks.completed  || 0);
  const inProgress      = Number(todayTasks["in-progress"] || 0);
  const openIssues      = Number(issStats.open || 0);
  const cleanRooms      = Number(hkStats.clean || 0);
  const dirtyRooms      = Number(hkStats.dirty || 0);

  return (
    <div className={styles.page}>

      {/* ══════════════ PAGE HEADER ══════════════ */}
      <div className={styles.pageHeader}>
        <div className={styles.pageTitleGroup}>
          <h1 className={styles.pageTitle}>Housekeeping</h1>
          <p className={styles.pageSubtitle}>
            Quản lý vệ sinh phòng · Phân công nhân viên · Theo dõi sự cố
          </p>
        </div>

        <div className={styles.headerButtons}>
          {/* Refresh */}
          <button
            className={styles.btnOutline}
            onClick={handleRefresh}
            disabled={refreshing}
            title="Làm mới dữ liệu"
          >
            <FiRefreshCw size={14} className={refreshing ? styles.spin : ""} />
            <span>Làm mới</span>
          </button>

          {/* Issue report — muted red */}
          <button
            className={styles.btnDanger}
            onClick={() => setIssueModalOpen(true)}
          >
            <FiAlertOctagon size={14} />
            <span>Báo sự cố</span>
          </button>

          {/* Create task — primary blue */}
          <button
            className={styles.btnPrimary}
            onClick={handleOpenTaskModal}
          >
            <FiPlus size={15} />
            <span>Tạo nhiệm vụ</span>
          </button>
        </div>
      </div>

      {/* ══════════════ CHARTS ROW ══════════════ */}
      <div className={styles.chartsRow}>
        <HousekeepingChart
          title="Trạng thái phòng hôm nay"
          subtitle={`${dashboard?.total_rooms ?? 0} phòng`}
          data={hkChartData}
          colors={hkColors}
          loading={loadingDashboard}
        />
        <HousekeepingChart
          title="Nhiệm vụ trong ngày"
          subtitle={`${totalTasksToday} tasks`}
          data={taskChartData}
          colors={taskColors}
          loading={loadingDashboard}
        />

        {/* Mini stat cards on right */}
        <div className={styles.miniStats}>
          <StatCard label="Hoàn thành"     value={completedToday} color="#10b981" bg="#f0fdf4" icon={FiCheckCircle} loading={loadingDashboard} />
          <StatCard label="Đang thực hiện" value={inProgress}     color="#3b82f6" bg="#eff6ff" icon={FiClock}       loading={loadingDashboard} />
          <StatCard label="Sự cố đang mở"  value={openIssues}     color="#ef4444" bg="#fef2f2" icon={FiAlertOctagon} loading={loadingDashboard} />
          <StatCard
            label="Phòng sạch"
            value={`${cleanRooms}/${(dashboard?.total_rooms ?? 0)}`}
            color="#0ea5e9"
            bg="#f0f9ff"
            icon={FiHome}
            loading={loadingDashboard}
            sub={`${dirtyRooms} phòng cần dọn`}
          />
        </div>
      </div>

      {/* ══════════════ TAB NAV ══════════════ */}
      <div className={styles.tabNav}>
        <div className={styles.tabGroup}>
          <button
            className={`${styles.tabItem} ${activeTab === "tasks" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("tasks")}
          >
            <FiClipboard size={15} />
            <span>Task Board</span>
            {totalTasksToday > 0 && (
              <span className={styles.tabBadge} style={activeTab === "tasks" ? { background: "#fff", color: "#2563eb" } : {}}>
                {totalTasksToday}
              </span>
            )}
          </button>

          <button
            className={`${styles.tabItem} ${activeTab === "rooms" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("rooms")}
          >
            <FiGrid size={15} />
            <span>Trạng thái phòng</span>
            {dirtyRooms > 0 && (
              <span className={styles.tabBadgeDanger} style={activeTab === "rooms" ? { background: "#fff", color: "#ef4444" } : {}}>
                {dirtyRooms}
              </span>
            )}
          </button>

          <button
            className={`${styles.tabItem} ${activeTab === "issues" ? styles.tabActive : ""}`}
            onClick={() => setActiveTab("issues")}
          >
            <FiTool size={15} />
            <span>Sự cố bảo trì</span>
            {openIssues > 0 && (
              <span className={styles.tabBadgeDanger} style={activeTab === "issues" ? { background: "#fff", color: "#ef4444" } : {}}>
                {openIssues}
              </span>
            )}
          </button>
        </div>

        {/* Date picker — chỉ hiện khi ở tab tasks */}
        {activeTab === "tasks" && (
          <div className={styles.tabDatePicker}>
            <FiCalendar size={13} color="#64748b" />
            <input
              type="date"
              className={styles.datePicker}
              value={taskFilters.date}
              onChange={(e) => handleTaskFilterChange("date", e.target.value)}
            />
          </div>
        )}
      </div>

      {/* ══════════════ CONTENT AREA ══════════════ */}
      <div className={styles.contentCard}>

        {/* ── TASKS TAB ─────────────────────────── */}
        {activeTab === "tasks" && (
          <>
            {/* Filter bar */}
            <TaskFilterBar
              taskFilters={taskFilters}
              handleTaskFilterChange={handleTaskFilterChange}
              staff={staff}
              tasksMeta={tasksMeta}
              tasks={tasks}
            />

            <TaskBoardView
              tasks={tasks}
              loadingTasks={loadingTasks}
              onUpdateStatus={handleUpdateTaskStatus}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />

            {/* Pagination */}
            {tasksMeta.last_page > 1 && (
              <div className={styles.pagination}>
                <span className={styles.paginationInfo}>
                  Trang {tasksMeta.current_page}/{tasksMeta.last_page} · {tasksMeta.total} nhiệm vụ
                </span>
                <div className={styles.paginationBtns}>
                  <button
                    className={styles.pageBtn}
                    disabled={tasksMeta.current_page <= 1}
                    onClick={() => handleTaskFilterChange("page", tasksMeta.current_page - 1)}
                  >
                    ← Trước
                  </button>
                  <button
                    className={styles.pageBtn}
                    disabled={tasksMeta.current_page >= tasksMeta.last_page}
                    onClick={() => handleTaskFilterChange("page", tasksMeta.current_page + 1)}
                  >
                    Tiếp →
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── ROOMS TAB ─────────────────────────── */}
        {activeTab === "rooms" && (
          <RoomStatusGrid
            rooms={rooms}
            loadingRooms={loadingRooms}
            onUpdateRoomStatus={updateRoomStatus}
            roomFilter={roomFilter}
            setRoomFilter={setRoomFilter}
            globalHkStats={hkStats}
            totalRooms={dashboard?.total_rooms ?? 0}
          />
        )}

        {/* ── ISSUES TAB ────────────────────────── */}
        {activeTab === "issues" && (
          <MaintenanceIssuesTable
            issues={issues}
            loadingIssues={loadingIssues}
            issueFilters={issueFilters}
            setIssueFilters={handleIssueFilterChange}
            onUpdateStatus={updateIssueStatus}
            onCreateIssue={() => setIssueModalOpen(true)}
          />
        )}
      </div>

      {/* ══════════════ MODALS ══════════════ */}
      <TaskFormModal
        isOpen={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setEditTask(null); }}
        onSubmit={handleTaskSubmit}
        rooms={rooms}
        staff={staff}
        editTask={editTask}
      />

      <IssueFormModal
        isOpen={issueModalOpen}
        onClose={() => setIssueModalOpen(false)}
        onSubmit={createIssue}
        rooms={rooms}
        staff={staff}
      />
    </div>
  );
};

export default HousekeepingPage;
