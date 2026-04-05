import { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { hotelService } from '../../../../services/hotelService.js';
import { commentService } from '../../../../services/commentService.js';

export const useHotelDetail = (hotelId) => {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showAvailableRooms, setShowAvailableRooms] = useState(false);
  const [searchParams, setSearchParams] = useState(null);

  const availableRoomsSectionRef = useRef(null);
  const queryClient = useQueryClient();

  // Hotel detail
  const {
    data: hotelData,
    isLoading: loadingHotel,
    isError: hotelError,
    error: hotelErrorDetail,
  } = useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => hotelService.getHotelById(hotelId),
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Comments
  const {
    data: commentsData,
    isLoading: loadingComments,
    isError: commentsError,
    refetch: refetchComments,
  } = useQuery({
    queryKey: ['hotel-comments', hotelId],
    queryFn: () =>
      commentService
        .getComments({ maHotel: hotelId })
        .then((res) => res.data || []),
    enabled: !!hotelId,
    staleTime: 2 * 60 * 1000,
  });

  // Review stats
  const {
    data: reviewStats,
    isLoading: loadingStats,
    isError: statsError,
  } = useQuery({
    queryKey: ['hotel-review-stats', hotelId],
    queryFn: () => commentService.getReviewStats(hotelId),
    enabled: !!hotelId,
    staleTime: 3 * 60 * 1000,
  });

  // Submit review
  const submitReviewMutation = useMutation({
    mutationFn: (reviewData) => {
      const payload = {
        comment: reviewData.comment,
        maHotel: hotelId,
        rating: reviewData.rating || undefined,
        parent_id: reviewData.parent_id || undefined,
      };
      return commentService.postComment(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['hotel-comments', hotelId]);
      queryClient.invalidateQueries(['hotel-review-stats', hotelId]);
    },
    onError: (error) => {
      console.error('Error submitting review:', error);
    },
  });

  // Search available rooms
  const searchAvailableRoomsMutation = useMutation({
    mutationFn: (bookingData) =>
      hotelService.getAvailableRooms(
        hotelId,
        bookingData.checkIn,
        bookingData.checkOut,
        bookingData.guests,
        bookingData.nights,
      ),
    onSuccess: (rooms, bookingData) => {
      setAvailableRooms(rooms);
      setSearchParams(bookingData);
      setShowAvailableRooms(true);
    },
    onError: (error) => {
      const response = error?.response?.data;

      if (response?.type === 'NO_ROOM') {
        setAvailableRooms([]);
        setShowAvailableRooms(true);
        toast.warning('Phòng đã hết trong thời gian bạn chọn');
        return;
      }

      if (response?.type === 'OVER_CAPACITY') {
        setShowAvailableRooms(false);
        toast.warning('Số lượng người vượt quá sức chứa phòng');
        return;
      }

      alert('Có lỗi xảy ra, vui lòng thử lại');
    },
  });

  const handleReviewSubmit = (reviewData) =>
    submitReviewMutation.mutateAsync(reviewData);

  const handleBookNowFromCalendar = (bookingData) =>
    searchAvailableRoomsMutation.mutate(bookingData);

  // Scroll to available rooms when data ready
  useEffect(() => {
    if (showAvailableRooms && availableRooms.length > 0) {
      setTimeout(() => {
        if (availableRoomsSectionRef.current) {
          availableRoomsSectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 400);
    }
  }, [showAvailableRooms, availableRooms]);

  // Derived data
  const galleryImages = hotelData?.images || [];
  const amenitiesArray = (() => {
    const data = hotelData?.amenities;
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data !== 'string') return [];
    try {
      if (data.trim().startsWith('[') && data.trim().endsWith(']')) {
        return JSON.parse(data);
      }
      return data.split(',').map(item => item.trim()).filter(Boolean);
    } catch (e) {
      console.error("Error parsing amenities:", e);
      return [];
    }
  })();
  const roomArray = hotelData?.rooms || [];
  const styleArray = hotelData?.styles || [];

  return {
    // raw data
    hotelData,
    loadingHotel,
    hotelError,
    hotelErrorDetail,
    commentsData,
    loadingComments,
    commentsError,
    reviewStats,
    loadingStats,
    statsError,

    // booking state
    availableRooms,
    showAvailableRooms,
    searchParams,
    availableRoomsSectionRef,
    searchAvailableRoomsMutation,

    // UI state
    showAllPhotos,
    setShowAllPhotos,

    // handlers
    handleReviewSubmit,
    handleBookNowFromCalendar,
    refetchComments,
    submitReviewMutation,

    // derived
    galleryImages,
    amenitiesArray,
    roomArray,
    styleArray,
  };
};

