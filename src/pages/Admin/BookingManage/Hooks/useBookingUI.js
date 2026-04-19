// hooks/useBookingUI.js
import { useState, useEffect } from 'react';
import { DEFAULT_BOOKING_FORM } from '../Constants/bookingConstants';

export const useBookingUI = () => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);

    const [editFormData, setEditFormData] = useState(DEFAULT_BOOKING_FORM);

    useEffect(() => {
        if (editingBooking && isEditModalOpen) {
            setEditFormData({
                quantity: editingBooking.quantity || '',
                guests: editingBooking.guests || '',
                check_in: editingBooking.check_in?.replace(' ', 'T')?.substring(0, 16) || '',
                check_out: editingBooking.check_out?.replace(' ', 'T')?.substring(0, 16) || '',
                total_price: editingBooking.total_price || ''
            });
        }
    }, [editingBooking, isEditModalOpen]);

    return {
        selectedBooking,
        setSelectedBooking,
        isSidebarOpen,
        setIsSidebarOpen,

        isEditModalOpen,
        setIsEditModalOpen,
        editingBooking,
        setEditingBooking,

        editFormData,
        setEditFormData
    };
};