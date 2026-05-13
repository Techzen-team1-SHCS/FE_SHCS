import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useStaffManagement = () => {
  const [searchId, setSearchId] = useState("");
  const queryClient = useQueryClient();

  const tokenAdmin = localStorage.getItem("tokenAdmin");
  const token = localStorage.getItem("token");
  const activeToken = tokenAdmin || token;

  // ─── 1. Query Data ────────────────────────────────────────────────────────
  const { data: staffList = [], isLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/auth/hotel-manager/staff", {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      return res.data.status === 200 ? res.data.data : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // ─── 2. Mutations ─────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(import.meta.env.VITE_API_URL + `/auth/hotel-manager/staff/${id}`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Xóa nhân viên thành công!");
    },
    onError: (error) => {
      toast.error("Lỗi khi xóa nhân viên!");
      console.error(error);
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newStaff) => {
      const res = await axios.post(import.meta.env.VITE_API_URL + "/auth/hotel-manager/staff", newStaff, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Thêm nhân viên thành công!");
    },
    onError: (error) => {
      toast.error("Lỗi khi thêm nhân viên!");
      console.error(error);
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, updatedStaff }) => {
      const res = await axios.put(import.meta.env.VITE_API_URL + `/auth/hotel-manager/staff/${id}`, updatedStaff, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("Cập nhật nhân viên thành công!");
    },
    onError: (error) => {
      toast.error("Lỗi khi cập nhật nhân viên!");
      console.error(error);
    },
  });

  // ─── 3. Helper wrappers ───────────────────────────────────────────────────
  const deleteStaff = (id) => deleteMutation.mutate(id);
  const addStaff = (newStaff) => addMutation.mutate(newStaff);
  const editStaff = (id, updatedStaff) => editMutation.mutate({ id, updatedStaff });

  // ─── 4. Filters ───────────────────────────────────────────────────────────
  const displayList = staffList.filter(
    (staff) =>
      staff.id.toString().includes(searchId) ||
      (staff.name?.toLowerCase().includes(searchId.toLowerCase())) ||
      (staff.email?.toLowerCase().includes(searchId.toLowerCase()))
  );

  return {
    staffList,
    displayList,
    searchId,
    setSearchId,
    deleteStaff,
    addStaff,
    editStaff,
    loading: isLoading, // Added loading state for UI
  };
};
