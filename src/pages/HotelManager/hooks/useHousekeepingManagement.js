import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE = `${import.meta.env.VITE_API_URL}/auth/hotel-manager/housekeeping`;

const getHeaders = () => {
  const token = localStorage.getItem("tokenAdmin") || localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const useHousekeepingManagement = () => {
  // ─── State ────────────────────────────────────────────────────────────────
  const [dashboard, setDashboard] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tasksMeta, setTasksMeta] = useState({});
  const [rooms, setRooms] = useState([]);
  const [issues, setIssues] = useState([]);
  const [issuesMeta, setIssuesMeta] = useState({});
  const [logs, setLogs] = useState([]);
  const [staff, setStaff] = useState([]);

  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingIssues, setLoadingIssues] = useState(false);

  // ─── Filters ──────────────────────────────────────────────────────────────
  const [taskFilters, setTaskFilters] = useState({
    status: "",
    date: new Date().toISOString().split("T")[0],
    staff_id: "",
    priority: "",
    page: 1,
    per_page: 15,
  });
  const [issueFilters, setIssueFilters] = useState({ status: "", page: 1, per_page: 15 });
  const [roomFilter, setRoomFilter] = useState("");

  // ─── 1. Dashboard ─────────────────────────────────────────────────────────
  const fetchDashboard = useCallback(async () => {
    setLoadingDashboard(true);
    try {
      const res = await axios.get(`${BASE}/dashboard`, { headers: getHeaders() });
      if (res.data.status) setDashboard(res.data.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoadingDashboard(false);
    }
  }, []);

  // ─── 2. Tasks ─────────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async (filters = taskFilters) => {
    setLoadingTasks(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "" && v !== null)
      );
      const res = await axios.get(`${BASE}/tasks`, { headers: getHeaders(), params });
      if (res.data.status) {
        setTasks(res.data.data.data || []);
        setTasksMeta(res.data.data || {});
      }
    } catch (err) {
      console.error("Tasks fetch error:", err);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  const createTask = async (payload) => {
    try {
      const res = await axios.post(`${BASE}/tasks`, payload, { headers: getHeaders() });
      if (res.data.status) {
        toast.success("✅ Tạo nhiệm vụ thành công!");
        await Promise.all([fetchTasks(), fetchDashboard()]);
        return res.data.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi khi tạo nhiệm vụ";
      toast.error(`❌ ${msg}`);
      throw err;
    }
  };

  const updateTask = async (id, payload) => {
    try {
      const res = await axios.put(`${BASE}/tasks/${id}`, payload, { headers: getHeaders() });
      if (res.data.status) {
        toast.success("✅ Cập nhật nhiệm vụ thành công!");
        await Promise.all([fetchTasks(), fetchDashboard(), fetchRooms()]);
        return res.data.data;
      }
    } catch (err) {
      toast.error("❌ Lỗi khi cập nhật nhiệm vụ");
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${BASE}/tasks/${id}`, { headers: getHeaders() });
      toast.success("🗑️ Xóa nhiệm vụ thành công!");
      await Promise.all([fetchTasks(), fetchDashboard()]);
    } catch (err) {
      toast.error("❌ Lỗi khi xóa nhiệm vụ");
    }
  };

  // ─── 3. Rooms ─────────────────────────────────────────────────────────────
  const fetchRooms = useCallback(async (hkStatus = "", hotelId = "") => {
    setLoadingRooms(true);
    try {
      const params = {};
      if (hkStatus) params.hk_status = hkStatus;
      if (hotelId)  params.hotel_id  = hotelId;
      const res = await axios.get(`${BASE}/rooms`, { headers: getHeaders(), params });
      // API now returns grouped-by-hotel array
      if (res.data.status) setRooms(res.data.data);
    } catch (err) {
      console.error("Rooms fetch error:", err);
    } finally {
      setLoadingRooms(false);
    }
  }, []);

  const updateRoomStatus = async (id, payload) => {
    try {
      const res = await axios.put(`${BASE}/rooms/${id}/status`, payload, {
        headers: getHeaders(),
      });
      if (res.data.status) {
        toast.success("✅ Cập nhật trạng thái phòng thành công!");
        await Promise.all([fetchRooms(), fetchDashboard()]);
        return res.data.data;
      }
    } catch (err) {
      toast.error("❌ Lỗi khi cập nhật trạng thái phòng");
      throw err;
    }
  };

  // ─── 4. Issues ────────────────────────────────────────────────────────────
  const fetchIssues = useCallback(async (filters = issueFilters) => {
    setLoadingIssues(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "")
      );
      const res = await axios.get(`${BASE}/issues`, { headers: getHeaders(), params });
      if (res.data.status) {
        setIssues(res.data.data.data || []);
        setIssuesMeta(res.data.data || {});
      }
    } catch (err) {
      console.error("Issues fetch error:", err);
    } finally {
      setLoadingIssues(false);
    }
  }, []);

  const createIssue = async (payload) => {
    try {
      const res = await axios.post(`${BASE}/issues`, payload, { headers: getHeaders() });
      if (res.data.status) {
        toast.success("✅ Báo cáo sự cố thành công!");
        await Promise.all([fetchIssues(), fetchDashboard(), fetchRooms()]);
        return res.data.data;
      }
    } catch (err) {
      toast.error("❌ Lỗi khi báo cáo sự cố");
      throw err;
    }
  };

  const updateIssueStatus = async (id, payload) => {
    try {
      const res = await axios.put(`${BASE}/issues/${id}`, payload, { headers: getHeaders() });
      if (res.data.status) {
        toast.success("✅ Cập nhật sự cố thành công!");
        await Promise.all([fetchIssues(), fetchDashboard(), fetchRooms()]);
        return res.data.data;
      }
    } catch (err) {
      toast.error("❌ Lỗi khi cập nhật sự cố");
      throw err;
    }
  };

  // ─── 5. Staff (for assignment dropdowns) ──────────────────────────────────
  const fetchStaff = useCallback(async () => {
    try {
      const token = localStorage.getItem("tokenAdmin") || localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/hotel-manager/staff`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status === 200) setStaff(res.data.data);
    } catch (err) {
      console.error("Staff fetch error:", err);
    }
  }, []);

  // ─── 6. Logs ──────────────────────────────────────────────────────────────
  const fetchLogs = useCallback(async (roomNumberId = "") => {
    try {
      const params = roomNumberId ? { room_number_id: roomNumberId } : {};
      const res = await axios.get(`${BASE}/logs`, { headers: getHeaders(), params });
      if (res.data.status) setLogs(res.data.data.data || []);
    } catch (err) {
      console.error("Logs fetch error:", err);
    }
  }, []);

  // ─── Init ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchDashboard();
    fetchTasks();
    fetchRooms();
    fetchIssues();
    fetchStaff();
  }, []);

  // ─── Refresh all ──────────────────────────────────────────────────────────
  const refreshAll = () =>
    Promise.all([fetchDashboard(), fetchTasks(), fetchRooms(), fetchIssues()]);

  return {
    // Data
    dashboard,
    tasks,
    tasksMeta,
    rooms,
    issues,
    issuesMeta,
    logs,
    staff,
    // Loading
    loadingDashboard,
    loadingTasks,
    loadingRooms,
    loadingIssues,
    // Filters
    taskFilters,
    setTaskFilters,
    issueFilters,
    setIssueFilters,
    roomFilter,
    setRoomFilter,
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchRooms,
    updateRoomStatus,
    fetchIssues,
    createIssue,
    updateIssueStatus,
    fetchLogs,
    refreshAll,
  };
};
