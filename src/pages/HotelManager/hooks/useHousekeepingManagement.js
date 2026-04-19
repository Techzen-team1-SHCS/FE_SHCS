import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEcho } from "../../../services/echo";

const BASE = `${import.meta.env.VITE_API_URL}/auth/hotel-manager/housekeeping`;

const getHeaders = () => {
  const token = localStorage.getItem("tokenAdmin") || localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const useHousekeepingManagement = () => {
  const queryClient = useQueryClient();

  // ─── Filters State ────────────────────────────────────────────────────────
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

  // ─── 1. Dashboard Query ───────────────────────────────────────────────────
  const realtimePollMs = 10000;

  useEffect(() => {
    let echo;

    try {
      echo = getEcho();
    } catch (error) {
      console.warn(error);
      return undefined;
    }

    const channel = echo.private("hotel-manager.housekeeping");

    const onUpdate = () => {
      InvalidateAll();
    };

    channel.listen(".HousekeepingUpdated", onUpdate);

    return () => {
      echo.leave("hotel-manager.housekeeping");
    };
  }, []);

  const { data: dashboard = null, isLoading: loadingDashboard } = useQuery({
    queryKey: ["hk_dashboard"],
    queryFn: async () => {
      const res = await axios.get(`${BASE}/dashboard`, { headers: getHeaders() });
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: realtimePollMs,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  // ─── 2. Tasks Query ───────────────────────────────────────────────────────
  const { data: tasksData = { data: [], total: 0 }, isLoading: loadingTasks } = useQuery({
    queryKey: ["hk_tasks", taskFilters],
    queryFn: async () => {
      const params = Object.fromEntries(Object.entries(taskFilters).filter(([, v]) => v !== "" && v !== null));
      const res = await axios.get(`${BASE}/tasks`, { headers: getHeaders(), params });
      return res.data.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: realtimePollMs,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  // ─── 3. Rooms Query ───────────────────────────────────────────────────────
  const { data: rooms = [], isLoading: loadingRooms } = useQuery({
    queryKey: ["hk_rooms", roomFilter],
    queryFn: async () => {
      const params = roomFilter ? { hk_status: roomFilter } : {};
      const res = await axios.get(`${BASE}/rooms`, { headers: getHeaders(), params });
      return res.data.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: realtimePollMs,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  // ─── 4. Issues Query ──────────────────────────────────────────────────────
  const { data: issuesData = { data: [], total: 0 }, isLoading: loadingIssues } = useQuery({
    queryKey: ["hk_issues", issueFilters],
    queryFn: async () => {
      const params = Object.fromEntries(Object.entries(issueFilters).filter(([, v]) => v !== ""));
      const res = await axios.get(`${BASE}/issues`, { headers: getHeaders(), params });
      return res.data.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: realtimePollMs,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  // ─── 5. Staff Query ───────────────────────────────────────────────────────
  const { data: staff = [] } = useQuery({
    queryKey: ["hk_staff"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/hotel-manager/staff`, { headers: getHeaders() });
      return res.data.status === 200 ? res.data.data : [];
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  // ─── 6. Mutations ─────────────────────────────────────────────────────────
  const InvalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["hk_dashboard"] });
    queryClient.invalidateQueries({ queryKey: ["hk_tasks"] });
    queryClient.invalidateQueries({ queryKey: ["hk_rooms"] });
    queryClient.invalidateQueries({ queryKey: ["hk_issues"] });
  };

  const createTaskMut = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(`${BASE}/tasks`, payload, { headers: getHeaders() });
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("✅ Tạo nhiệm vụ thành công!");
      InvalidateAll();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Lỗi khi tạo nhiệm vụ";
      toast.error(`❌ ${msg}`);
    },
  });

  const updateTaskMut = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axios.put(`${BASE}/tasks/${id}`, payload, { headers: getHeaders() });
      return res.data;
    },
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["hk_tasks"] });
      const previousTasks = queryClient.getQueryData(["hk_tasks", taskFilters]);

      // Cập nhật mảng data trực tiếp trước khi API chạy xong
      if (previousTasks && previousTasks.data) {
        queryClient.setQueryData(["hk_tasks", taskFilters], {
          ...previousTasks,
          data: previousTasks.data.map((task) =>
            task.id == id ? { ...task, ...payload } : task
          ),
        });
      }
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["hk_tasks", taskFilters], context.previousTasks);
      }
      toast.error("❌ Lỗi khi cập nhật nhiệm vụ");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["hk_tasks"] });
      queryClient.invalidateQueries({ queryKey: ["hk_dashboard"] });
    },
    onSuccess: (data, variables) => {
      // Chỉ hiện toast khi chỉnh sửa form, đối với thao tác kéo thả thì giảm ồn ào UI
      if (!variables.payload.task_status || Object.keys(variables.payload).length > 1) {
        toast.success("✅ Cập nhật nhiệm vụ thành công!");
      }
    },
  });

  const deleteTaskMut = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${BASE}/tasks/${id}`, { headers: getHeaders() });
    },
    onSuccess: () => {
      toast.success("🗑️ Xóa nhiệm vụ thành công!");
      InvalidateAll();
    },
    onError: () => toast.error("❌ Lỗi khi xóa nhiệm vụ"),
  });

  const updateRoomStatusMut = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axios.put(`${BASE}/rooms/${id}/status`, payload, { headers: getHeaders() });
      return res.data;
    },
    onSuccess: () => {
      toast.success("✅ Cập nhật trạng thái phòng thành công!");
      InvalidateAll();
    },
    onError: () => toast.error("❌ Lỗi khi cập nhật trạng thái phòng"),
  });

  const createIssueMut = useMutation({
    mutationFn: async (payload) => {
      const res = await axios.post(`${BASE}/issues`, payload, { headers: getHeaders() });
      return res.data;
    },
    onSuccess: () => {
      toast.success("✅ Báo cáo sự cố thành công!");
      InvalidateAll();
    },
    onError: () => toast.error("❌ Lỗi khi báo cáo sự cố"),
  });

  const updateIssueStatusMut = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await axios.put(`${BASE}/issues/${id}`, payload, { headers: getHeaders() });
      return res.data;
    },
    onSuccess: () => {
      toast.success("✅ Cập nhật sự cố thành công!");
      InvalidateAll();
    },
    onError: () => toast.error("❌ Lỗi khi cập nhật sự cố"),
  });

  return {
    dashboard,
    tasks: tasksData.data,
    tasksMeta: tasksData,
    rooms,
    issues: issuesData.data,
    issuesMeta: issuesData,
    staff,
    logs: [], // logs logic simplified or moved if needed
    loadingDashboard,
    loadingTasks,
    loadingRooms,
    loadingIssues,
    taskFilters, setTaskFilters,
    issueFilters, setIssueFilters,
    roomFilter, setRoomFilter,

    fetchTasks: () => queryClient.invalidateQueries({ queryKey: ["hk_tasks"] }),
    fetchRooms: () => queryClient.invalidateQueries({ queryKey: ["hk_rooms"] }),
    fetchIssues: () => queryClient.invalidateQueries({ queryKey: ["hk_issues"] }),
    refreshAll: InvalidateAll,

    createTask: createTaskMut.mutateAsync,
    updateTask: (id, payload) => updateTaskMut.mutateAsync({ id, payload }),
    deleteTask: deleteTaskMut.mutateAsync,
    updateRoomStatus: (id, payload) => updateRoomStatusMut.mutateAsync({ id, payload }),
    createIssue: createIssueMut.mutateAsync,
    updateIssueStatus: (id, payload) => updateIssueStatusMut.mutateAsync({ id, payload }),
  };
};
