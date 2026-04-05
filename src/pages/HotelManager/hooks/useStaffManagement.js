import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const useStaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [searchId, setSearchId] = useState("");

  const tokenAdmin = localStorage.getItem("tokenAdmin"); // Standard token admin used. If normal token, it would be token.
  const token = localStorage.getItem("token");
  const activeToken = tokenAdmin || token;

  const fetchStaff = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/auth/hotel-manager/staff",
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        },
      );
      if (res.data.status === 200) {
        setStaffList(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const deleteStaff = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/auth/hotel-manager/staff/${id}`,
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        },
      );
      if (res.data.status === 200) {
        setStaffList((prev) => prev.filter((staff) => staff.id !== id));
        toast.success("Xóa nhân viên thành công!");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa nhân viên!");
      console.error(error);
    }
  };

  const addStaff = async (newStaff) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/auth/hotel-manager/staff`,
        newStaff,
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        },
      );
      if (res.data.status === 200) {
        fetchStaff();
        toast.success("Thêm nhân viên thành công!");
      }
    } catch (error) {
      toast.error("Lỗi khi thêm nhân viên!");
      console.error(error);
    }
  };

  const editStaff = async (id, updatedStaff) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/auth/hotel-manager/staff/${id}`,
        updatedStaff,
        {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
        },
      );
      if (res.data.status === 200) {
        fetchStaff();
        toast.success("Cập nhật nhân viên thành công!");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật nhân viên!");
      console.error(error);
    }
  };

  const displayList = staffList.filter(
    (staff) =>
      staff.id.toString().includes(searchId) ||
      staff.name?.toLowerCase().includes(searchId.toLowerCase()),
  );

  return {
    staffList: displayList,
    searchId,
    setSearchId,
    deleteStaff,
    addStaff,
    editStaff,
  };
};
