import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  ROOM_AMENITIES,
} from "../Constants/Room/roomConstants";
import { validateRoomForm } from "../Helpers/roomFormHelpers";
import { hotelService } from "../../../services/hotelService";

const initialFormState = {
  hotel_id: "",
  room_type: "Deluxe",
  price: "",
  max_guest: "",
  quantity: 1,
  amenities: [],
  availability_status: "available",
  available_from: "",
  available_to: "",
};

export const useAddRoom = () => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState(null);
  const [showRoomNumberModal, setShowRoomNumberModal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch danh sách hotel của hotel manager
  const { data: hotels = [], isLoading: hotelsLoading } = useQuery({
    queryKey: ["hotel-manager-list"],
    queryFn: () => hotelService.getHotelManagerHotels(),
    staleTime: 5 * 60 * 1000,
  });

  const handleInputChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prevErr) => ({ ...prevErr, [key]: undefined }));
    }
  };

  const toggleCheckbox = (key, item) => {
    setForm((prev) => {
      const list = prev[key];
      const updated = list.includes(item)
        ? list.filter((i) => i !== item)
        : [...list, item];
      return { ...prev, [key]: updated };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateRoomForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        hotel_id: form.hotel_id,
        room_type: form.room_type,
        price: Number(form.price),
        max_guest: Number(form.max_guest),
        amenities: JSON.stringify([...form.amenities]),
        availability_status: form.availability_status,
        quantity: Number(form.quantity) || 1,
      };

      if (form.available_from) payload.available_from = form.available_from;
      if (form.available_to) payload.available_to = form.available_to;

      const response = await hotelService.createHotelManagerRoom(form.hotel_id, payload);

      const roomData = response?.data || response;
      setCreatedRoom(roomData);
      setShowRoomNumberModal(true);
      toast.success("Tạo phòng thành công!");

      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ["hotel-manager-rooms"] });
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Lỗi tạo phòng";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoomNumbers = async (quantity) => {
    if (!createdRoom?.id) return;

    setLoading(true);
    try {
      const response = await hotelService.createRoomNumbers(createdRoom.id, quantity);
      toast.success(response?.message || `Tạo ${quantity} room numbers thành công!`);
      setShowRoomNumberModal(false);

      // Invalidate cache
      queryClient.invalidateQueries({ queryKey: ["hotel-manager-rooms"] });

      return true; // signal success
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Lỗi tạo room numbers";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowRoomNumberModal(false);
  };

  const resetForm = () => {
    setForm(initialFormState);
    setErrors({});
    setCreatedRoom(null);
  };

  return {
    form,
    errors,
    loading,
    hotels,
    hotelsLoading,
    createdRoom,
    showRoomNumberModal,
    roomAmenities: ROOM_AMENITIES,
    handleInputChange,
    toggleCheckbox,
    handleSubmit,
    handleCreateRoomNumbers,
    closeModal,
    resetForm,
  };
};
