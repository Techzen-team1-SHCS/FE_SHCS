import { useState, useEffect, useCallback } from 'react';
import { hotelService } from '../../../../services/hotelService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { parseHotelClassFromServer, formatHotelClassForServer } from '../helpers';

export const useHotelManage = () => {
    const [hotelsData, setHotelsData] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationData, setPaginationData] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 20,
        total: 0
    });
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

    const fetchHotels = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const response = await hotelService.getAllHotels(page);
            const resData = response.data;
            if (resData && resData.data && resData.pagination) {
                setHotelsData(resData.data);
                setPaginationData(resData.pagination);
            } else {
                setHotelsData([]);
            }
        } catch (error) {
            toast.error('Không thể tải danh sách khách sạn');
            setHotelsData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHotels(currentPage);
    }, [currentPage, fetchHotels]);

    const handlePageChange = (newPage) => {
        const totalPages = paginationData.last_page || 1;
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleView = async (hotelId, shouldEdit = false) => {
        try {
            setIsLoading(true);
            const hotel = await hotelService.getHotelById(hotelId);

            if (!hotel) {
                toast.error("Không lấy được thông tin khách sạn");
                return;
            }

            setSelectedHotel(hotel);
            setIsSidebarOpen(true);

            if (shouldEdit) {
                setTimeout(() => {
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
                    setNewAmenity('');
                    setIsEditMode(true);
                }, 100);
            } else {
                setIsEditMode(false);
            }
        } catch (error) {
            console.error("Hotel detail error:", error);
            toast.error(error.response?.data?.message || "Lỗi tải thông tin khách sạn!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (hotelId) => {
        handleView(hotelId, true);
    };

    const handleDelete = async (hotelId) => {
        try {
            const result = await Swal.fire({
                title: 'Bạn có chắc muốn xóa khách sạn này?',
                text: "Hành động này không thể hoàn tác!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Xóa',
                cancelButtonText: 'Hủy',
            });

            if (!result.isConfirmed) return;

            const res = await hotelService.getDeleteHotel(hotelId);

            if (res.status === 200) {
                if (selectedHotel?.id === hotelId) {
                    setSelectedHotel(null);
                    setIsSidebarOpen(false);
                }
                Swal.fire('Đã xóa!', res.message, 'success');
                setCurrentPage(1);
                fetchHotels(1);
            }
        } catch (error) {
            console.error("Delete hotel error:", error);
            Swal.fire('Lỗi!', error.response?.data?.message || 'Xóa thất bại, thử lại sau', 'error');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddAmenity = () => {
        const trimmed = newAmenity.trim();
        if (!trimmed) {
            toast.error("Vui lòng nhập tiện nghi");
            return;
        }

        if (editForm.amenities.includes(trimmed)) {
            toast.error("Tiện nghi này đã tồn tại");
            return;
        }

        setEditForm(prev => ({
            ...prev,
            amenities: [...prev.amenities, trimmed]
        }));
        setNewAmenity('');
    };

    const handleRemoveAmenity = (index) => {
        setEditForm(prev => ({
            ...prev,
            amenities: prev.amenities.filter((_, i) => i !== index)
        }));
    };

    const handleUpdate = async () => {
        try {
            if (!selectedHotel) return;

            if (!editForm.name.trim()) {
                toast.error("Tên khách sạn không được để trống");
                return;
            }

            if (!editForm.price || editForm.price <= 0) {
                toast.error("Giá phải lớn hơn 0");
                return;
            }

            const starRating = formatHotelClassForServer(editForm.hotel_class);
            if (starRating === 0) {
                toast.error("Hạng sao phải từ 1 đến 5");
                return;
            }

            const updateData = {
                name: editForm.name,
                province: editForm.province,
                price: Number(editForm.price),
                hotel_class: starRating,
                description: editForm.description,
                text: editForm.text,
                name_nearby_place: editForm.name_nearby_place,
                amenities: editForm.amenities
            };

            Swal.fire({
                title: 'Đang cập nhật...',
                text: 'Vui lòng chờ trong giây lát',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await hotelService.updateHotel(selectedHotel.id, updateData);
            setIsEditMode(false);
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: response.message || 'Cập nhật khách sạn thành công',
                timer: 2000,
                showConfirmButton: false
            });
            fetchHotels(currentPage);

        } catch (error) {
            console.error("Update error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi!',
                text: error.response?.data?.message || 'Cập nhật thất bại, vui lòng thử lại',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
        setSelectedHotel(null);
        setIsEditMode(false);
    };

    return {
        hotelsData,
        selectedHotel,
        isSidebarOpen,
        isLoading,
        loading,
        isEditMode,
        setIsEditMode,
        paginationData,
        editForm,
        newAmenity,
        setNewAmenity,
        handlePageChange,
        handleView,
        handleEdit,
        handleDelete,
        handleInputChange,
        handleAddAmenity,
        handleRemoveAmenity,
        handleUpdate,
        handleCancelEdit,
        handleCloseSidebar
    };
};
