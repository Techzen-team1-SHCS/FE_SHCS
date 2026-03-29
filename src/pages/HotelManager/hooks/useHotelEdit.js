import { useState, useEffect } from "react";
import { hotelService } from "../../../services/hotelService";
import { toast } from "react-toastify";
import { formatHotelClass, extractImageRefs } from "../Helpers/HotelHelpers";

export const useHotelEdit = (hotel, id, updateHotelMutation) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);

    const [editData, setEditData] = useState({
        name: "",
        province: "",
        description: "",
        price: "",
        name_nearby_place: "",
        hotel_class: "",
    });

    useEffect(() => {
        if (hotel?.images) {
            setCurrentImages(hotel.images);
        }
    }, [hotel]);

    const startEdit = () => {
        setEditData({
            name: hotel.name || "",
            province: hotel.province || "",
            description: hotel.description || "",
            price: hotel.price || "",
            name_nearby_place: hotel.name_nearby_place || "",
            hotel_class: hotel.hotel_class
                ? String(hotel.hotel_class).replace(".0", "")
                : "",
        });

        setCurrentImages(hotel.images || []);
        setSelectedImages([]);
        setRemovedImages([]);
        setIsEditing(true);
    };

    const cancelEdit = () => setIsEditing(false);

    const removeImage = (index) => {
        const removed = currentImages[index];
        setRemovedImages((prev) => [...prev, removed]);
        setCurrentImages((prev) => prev.filter((_, i) => i !== index));
    };

    const save = () => {
        const deleteRefs = extractImageRefs(removedImages);

        const dataToSend = {
            ...editData,
            price: Number(editData.price || 0),
            hotel_class: formatHotelClass(editData.hotel_class),
            delete_images: deleteRefs,
        };

        updateHotelMutation.mutate(
            { id, data: dataToSend },
            {
                onSuccess: async () => {
                    try {
                        if (selectedImages.length > 0) {
                            await hotelService.uploadHotelImages(id, selectedImages);
                            toast.success("Ảnh đã được cập nhật.");
                        }

                        setIsEditing(false);
                        toast.success("Cập nhật thành công!");
                    } catch (err) {
                        toast.error("Lỗi upload ảnh");
                    }
                },
                onError: (error) => {
                    toast.error(`Cập nhật thất bại: ${error?.message || "Đã có lỗi xảy ra"}`);
                },
            }
        );
    };

    return {
        isEditing,
        editData,
        setEditData,
        selectedImages,
        setSelectedImages,
        currentImages,
        removedImages,
        startEdit,
        cancelEdit,
        removeImage,
        save,
    };
};