import { useState } from 'react';
import { hotelService } from '../../../../services/hotelService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
    parseHotelClassFromServer,
    formatHotelClassForServer
} from '../Helpers/hotelHelpers';

export const useHotelActions = (fetchHotels, currentPage) => {
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [editForm, setEditForm] = useState({
        name: '',
        province: '',
        price: '',
        hotel_class: '',
        description: '',
        text: '',
        amenities: [],
        name_nearby_place: ''
    });

    const [newAmenity, setNewAmenity] = useState('');

    // ===== VIEW / EDIT =====
    const handleView = async (hotelId, shouldEdit = false) => {
        try {
            setIsLoading(true);
            const hotel = await hotelService.getHotelById(hotelId);

            setSelectedHotel(hotel);
            setIsSidebarOpen(true);

            if (shouldEdit) {
                const amenitiesArray = Array.isArray(hotel.amenities) ? hotel.amenities : [];

                setEditForm({
                    name: hotel.name || '',
                    province: hotel.province || '',
                    price: hotel.price || '',
                    hotel_class: parseHotelClassFromServer(hotel.hotel_class),
                    description: hotel.description || '',
                    text: hotel.text || '',
                    amenities: amenitiesArray,
                    name_nearby_place: hotel.name_nearby_place || ''
                });

                setIsEditMode(true);
            } else {
                setIsEditMode(false);
            }
        } catch (err) {
            toast.error("Lỗi tải khách sạn");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (id) => handleView(id, true);

    // ===== DELETE =====
    const handleDelete = async (hotelId) => {
        const result = await Swal.fire({
            title: 'Xóa khách sạn?',
            icon: 'warning',
            showCancelButton: true
        });

        if (!result.isConfirmed) return;

        try {
            await hotelService.getDeleteHotel(hotelId);

            Swal.fire('Đã xóa!', '', 'success');

            if (selectedHotel?.id === hotelId) {
                setSelectedHotel(null);
                setIsSidebarOpen(false);
            }

            fetchHotels(currentPage);
        } catch {
            Swal.fire('Lỗi!', '', 'error');
        }
    };

    // ===== UPDATE =====
    const handleUpdate = async () => {
        const star = formatHotelClassForServer(editForm.hotel_class);

        if (!star) {
            toast.error("Hạng sao không hợp lệ");
            return;
        }

        try {
            await hotelService.updateHotel(selectedHotel.id, {
                ...editForm,
                price: Number(editForm.price),
                hotel_class: star
            });

            setIsEditMode(false);
            fetchHotels(currentPage);

            Swal.fire('Thành công', '', 'success');
        } catch {
            Swal.fire('Lỗi', '', 'error');
        }
    };

    // ===== FORM =====
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAddAmenity = () => {
        if (!newAmenity.trim()) return;

        setEditForm(prev => ({
            ...prev,
            amenities: [...prev.amenities, newAmenity]
        }));

        setNewAmenity('');
    };

    const handleRemoveAmenity = (index) => {
        setEditForm(prev => ({
            ...prev,
            amenities: prev.amenities.filter((_, i) => i !== index)
        }));
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedHotel(null);
        setIsEditMode(false);
    };

    return {
        selectedHotel,
        isSidebarOpen,
        isEditMode,
        isLoading,
        editForm,
        newAmenity,

        setNewAmenity,

        handleView,
        handleEdit,
        handleDelete,
        handleUpdate,
        handleInputChange,
        handleAddAmenity,
        handleRemoveAmenity,
        handleCloseSidebar,
        setIsEditMode
    };
};