import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { ROOM_AMENITIES } from "../Constants/Room/roomConstants";
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

export const useEditRoom = (roomId) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch danh sách hotel của hotel manager
  const { data: hotels = [], isLoading: hotelsLoading } = useQuery({
    queryKey: ["hotel-manager-list"],
    queryFn: () => hotelService.getHotelManagerHotels(),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch thông tin phòng cũ
  useEffect(() => {
    if (roomId) {
      const fetchRoom = async () => {
        setLoading(true);
        try {
          const response = await hotelService.getRoomDetail(roomId);
          if (response.status && response.data) {
            // response.data can be array based on the sample user provided
            const roomData = Array.isArray(response.data) 
              ? (response.data.find(r => r.id === Number(roomId)) || response.data[0])
              : response.data;
            
            let parsedAmenities = roomData.amenities;
            if (typeof parsedAmenities === "string") {
              try {
                parsedAmenities = JSON.parse(parsedAmenities);
              } catch (e) {
                parsedAmenities = [];
              }
            }

            if (roomData) {
              setForm({
                hotel_id: roomData.hotel_id || "",
                room_type: roomData.room_type || "Deluxe",
                price: roomData.price || "",
                max_guest: roomData.max_guest || "",
                quantity: roomData.quantity || 1,
                amenities: Array.isArray(parsedAmenities) ? parsedAmenities : [],
                availability_status: roomData.availability_status || "available",
                available_from: roomData.available_from || "",
                available_to: roomData.available_to || "",
              });
            }
          }
        } catch (error) {
          console.error("Lỗi lấy thông tin phòng:", error);
          toast.error("Không thể lấy thông tin phòng");
        } finally {
          setLoading(false);
        }
      };
      fetchRoom();
    }
  }, [roomId]);

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

      const response = await hotelService.updateHotelManagerRoom(roomId, payload);

      if (response?.status) {
        toast.success("Cập nhật phòng thành công!");
        queryClient.invalidateQueries({ queryKey: ["hotel-manager-rooms"] });
        return true; // signal success
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Lỗi cập nhật phòng";
      toast.error(message);
    } finally {
      setLoading(false);
    }
    return false;
  };

  return {
    form,
    errors,
    loading,
    hotels,
    hotelsLoading,
    roomAmenities: ROOM_AMENITIES,
    handleInputChange,
    toggleCheckbox,
    handleSubmit,
  };
};
