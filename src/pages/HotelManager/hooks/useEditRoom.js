import { useEffect, useState } from "react";
import { hotelRooms } from "../Mock/roomData";
import {
  ROOM_AMENITIES,
  ROOM_ACCESSIBILITY_FEATURES,
} from "../Constants/Room/roomConstants";
import { validateRoomForm } from "../Helpers/roomFormHelpers";

const initialFormState = {
  roomNo: "",
  floor: "",
  status: "Vacant",
  type: "Deluxe",
  capacity: "",
  pricePerNight: "",
  description: "",
  amenities: [],
  accessibility: [],
  images: [],
};

const getStoredRooms = () => {
  const saved = localStorage.getItem("hotelRooms");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
  }
  return hotelRooms;
};

const findRoomById = (id) => {
  const rooms = getStoredRooms();
  return rooms.find((room) => String(room.id) === String(id));
};

export const useEditRoom = (roomId) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!roomId) return;
    const room = findRoomById(roomId);
    if (room) {
      setForm({
        roomNo: room.roomNo || "",
        floor: room.floor || "",
        status: room.availability || room.status || "Vacant",
        type: room.roomType || room.type || "Deluxe",
        capacity: room.capacity || "",
        pricePerNight: room.pricePerNight || room.price || "",
        description: room.description || "",
        amenities: room.amenities || [],
        accessibility: room.accessibility || [],
        images: room.images || [],
      });
    }
  }, [roomId]);

  const handleInputChange = (key, value) => {
    if (key === "images") {
      setForm((prev) => ({ ...prev, images: value }));
      return;
    }

    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prevErr) => ({ ...prevErr, [key]: undefined }));
    }
  };

  const handleUpload = (files) => {
    const newPreview = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newPreview] }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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

  const handleSubmit = async (event, onSuccess) => {
    event.preventDefault();
    const validation = validateRoomForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    const rooms = getStoredRooms();
    const updated = rooms.map((room) => {
      if (String(room.id) !== String(roomId)) return room;
      return {
        ...room,
        roomNo: form.roomNo,
        floor: form.floor,
        availability: form.status,
        status: form.status,
        roomType: form.type,
        type: form.type,
        capacity: form.capacity,
        price: form.pricePerNight,
        pricePerNight: form.pricePerNight,
        description: form.description,
        amenities: form.amenities,
        accessibility: form.accessibility,
        images: form.images,
      };
    });

    localStorage.setItem("hotelRooms", JSON.stringify(updated));

    setSuccessMessage("Cập nhật phòng thành công");
    setTimeout(() => {
      onSuccess?.();
    }, 600);
  };

  return {
    form,
    errors,
    successMessage,
    roomAmenities: ROOM_AMENITIES,
    roomAccessibility: ROOM_ACCESSIBILITY_FEATURES,
    handleInputChange,
    handleUpload,
    removeImage,
    toggleCheckbox,
    handleSubmit,
  };
};
