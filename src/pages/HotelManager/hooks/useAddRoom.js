import { useMemo, useState } from "react";
import { ROOM_AMENITIES, ROOM_ACCESSIBILITY_FEATURES } from "../Constants/Room/roomConstants";
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

export const useAddRoom = () => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const selectedAmenities = useMemo(() => form.amenities, [form.amenities]);
  const selectedAccessibility = useMemo(() => form.accessibility, [form.accessibility]);

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
    const newPreview = Array.from(files).map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setForm((prev) => ({ ...prev, images: [...prev.images, ...newPreview] }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const toggleCheckbox = (key, item) => {
    setForm((prev) => {
      const list = prev[key];
      const updated = list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
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

    // TODO: call backend API (ví dụ roomService.createRoom(form))
    setSuccessMessage("Tạo phòng mới thành công");
    setTimeout(() => {
      onSuccess?.();
    }, 600);
  };

  const resetForm = () => {
    setForm(initialFormState);
    setErrors({});
    setSuccessMessage("");
  };

  return {
    form,
    errors,
    successMessage,
    selectedAmenities,
    selectedAccessibility,
    roomAmenities: ROOM_AMENITIES,
    roomAccessibility: ROOM_ACCESSIBILITY_FEATURES,
    handleInputChange,
    handleUpload,
    removeImage,
    toggleCheckbox,
    handleSubmit,
    resetForm,
  };
};
