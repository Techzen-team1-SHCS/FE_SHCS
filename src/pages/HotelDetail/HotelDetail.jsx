import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import HotelBooking from '../../components/HotelBooking/HotelBooking.jsx';
import { hotelService } from '../../services/hotelService';
import styles from "./style.module.css";
import "./style.css";
import Button from '../../components/Button/Button.jsx';
import AmenityIcon from '../../components/Amenities/AmenityIcon.jsx';
import AmenityImageCard from '../../components/Amenities/AmenityImageCard.jsx';
import SameProvinceHotels from '../../components/SameProvinces/SameProvinceHotels.jsx';
import SimilarHotel from '../../components/SimilarHotel/SimilarHotel.jsx';
import NavigationTabs from '../../components/NavigationTabs/NavigationTabs.jsx';
import AvailableRooms from '../../components/AvailableRooms/AvailableRooms.jsx';
import HotelReviewSubmit from '../../components/HotelReviewSubmit/HotelReviewSubmit.jsx';
import HotelReviewsList from '../../components/HotelReviewsList/HotelReviewsList.jsx';
import { commentService } from '../../services/commentService';
import HotelReviewStats from '../../components/HotelReviewStats/HotelReviewStats.jsx';
import Loader from '../../components/Loading/Loader.jsx';
import { toast } from 'react-toastify';

const HotelDetail = () => {
  const { hotelId } = useParams();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showAvailableRooms, setShowAvailableRooms] = useState(false);
  const [searchParams, setSearchParams] = useState(null);
  const navigate = useNavigate();
  const availableRoomsSectionRef = useRef(null);
  const queryClient = useQueryClient();

  // Query để lấy thông tin hotel
  const {
    data: hotelData,
    isLoading: loadingHotel,
    isError: hotelError,
    error: hotelErrorDetail
  } = useQuery({
    queryKey: ['hotel', hotelId],
    queryFn: () => hotelService.getHotelById(hotelId),
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  // Query để lấy comments
  const {
    data: commentsData,
    isLoading: loadingComments,
    isError: commentsError,
    refetch: refetchComments
  } = useQuery({
    queryKey: ['hotel-comments', hotelId],
    queryFn: () => commentService.getComments({ maHotel: hotelId }).then(res => res.data || []),
    enabled: !!hotelId,
    staleTime: 2 * 60 * 1000,
  });

  // Query để lấy review stats
  const {
    data: reviewStats,
    isLoading: loadingStats,
    isError: statsError
  } = useQuery({
    queryKey: ['hotel-review-stats', hotelId],
    queryFn: () => commentService.getReviewStats(hotelId),
    enabled: !!hotelId,
    staleTime: 3 * 60 * 1000,
  });

  // Mutation để submit review
  const submitReviewMutation = useMutation({
    mutationFn: (reviewData) => {
      const payload = {
        comment: reviewData.comment,
        maHotel: hotelId,
        rating: reviewData.rating || undefined,
        parent_id: reviewData.parent_id || undefined
      };
      return commentService.postComment(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['hotel-comments', hotelId]);
      queryClient.invalidateQueries(['hotel-review-stats', hotelId]);
    },
    onError: (error) => {
      console.error('Error submitting review:', error);
    }
  });

  // Mutation để tìm phòng trống
  const searchAvailableRoomsMutation = useMutation({
    mutationFn: (bookingData) => {
      return hotelService.getAvailableRooms(
        hotelId,
        bookingData.checkIn,
        bookingData.checkOut,
        bookingData.guests,
        bookingData.nights
      );
    },
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
    }
  });

  const handleReviewSubmit = async (reviewData) => {
    return submitReviewMutation.mutateAsync(reviewData);
  };

  const handleBookNowFromCalendar = async (bookingData) => {
    searchAvailableRoomsMutation.mutate(bookingData);
  };

  // Thêm useEffect để xử lý scroll khi có available rooms
  useEffect(() => {
    if (showAvailableRooms && availableRooms.length > 0) {
      setTimeout(() => {
        if (availableRoomsSectionRef.current) {
          availableRoomsSectionRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 400);
    }
  }, [showAvailableRooms, availableRooms]);

  const handleRoomSelect = (room, quantity) => {
    console.log('Selected room:', room, 'Quantity:', quantity);
    navigate(`/booking/`, {
      state: {
        room,
        quantity,
        searchParams,
        hotel: hotelData
      }
    });
  };

  // Xử lý loading và error states
  if (loadingHotel) {
    return (
      <div className="page-wrapper">
        <Loader />
      </div>
    );
  }

  if (hotelError) {
    navigate('/404');
    return null;
  }

  if (!hotelData) {
    return <div className="page-wrapper">No data found</div>;
  }

  // Extract data từ hotelData
  const galleryImages = hotelData?.images || [];
  const amenitiesArray = hotelData?.amenities ? JSON.parse(hotelData.amenities) : [];
  const roomArray = hotelData?.rooms || [];
  const styleArray = hotelData?.styles || [];

  return (
    <div className="page-wrapper">
      {/* Hero Section với background gradient */}
      <div className={styles.hotelHeroSection}>
        <div
          className={styles.heroBackground}
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url(${galleryImages[0]?.url})`
          }}
        >
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{hotelData?.name || 'Hotel Name'}</h1>
            <div className={styles.heroMeta}>
              <span className={styles.heroLocation}>
                <i className="fas fa-map-marker-alt"></i>
                {hotelData?.description || 'Location'}
              </span>
              {reviewStats?.averageRating && (
                <span className={styles.heroRating}>
                  <i className="fas fa-star rating-star"></i>
                  <span>{reviewStats.averageRating.toFixed(1)}</span>
                  <span className="rating-count">({reviewStats.totalReviews} đánh giá)</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className={styles.hotelMainContainer}>
        {/* Navigation Tabs */}
        <div style={{ marginBottom: '40px' }}>
          <NavigationTabs hotelId={hotelData?.id} />
        </div>

        {/* Gallery và Booking Section */}
        <div className={styles.galleryBookingGrid}>
          {/* Gallery */}
          <div>
            <div className={styles.galleryGrid}>
              <div className={styles.mainImage}>
                <img src={galleryImages[0]?.url} alt="Main view" />
              </div>
              {galleryImages.slice(1, 3).map((img, index) => (
                <div key={index} className={styles.smallImage}>
                  <img src={img.url} alt={`Gallery ${index + 1}`} />
                </div>
              ))}
            </div>
            {galleryImages.length > 3 && (
              <button onClick={() => setShowAllPhotos(!showAllPhotos)} className={styles.btnTogglePhotos}>
                <i className={`fas fa-${showAllPhotos ? 'minus' : 'plus'}`}></i>
                {showAllPhotos ? 'Ẩn bớt ảnh' : `Xem tất cả ${galleryImages.length} ảnh`}
              </button>
            )}
          </div>

          {/* Booking Widget */}
          <div className={styles.bookingWidget}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '24px',
              color: '#1a1a1a'
            }}>
              Đặt phòng ngay
            </h3>
            <HotelBooking
              onBook={handleBookNowFromCalendar}
              hotelId={hotelId}
              price={roomArray[0]?.price || 0}
              style={{ border: 'none' }}
            />

          </div>
        </div>

        {/* Room Features */}
        <div className={styles.roomFeatures}>
          {[
            { icon: '👤', label: 'Khách', value: `${roomArray[0]?.max_guest || '2'} người` },
            { icon: '📏', label: 'Diện tích', value: '70 m²' },
            { icon: '🛏️', label: 'Giá đêm', value: `${Number(roomArray[0]?.price || 0).toLocaleString('vi-VN')}₫` },
            { icon: '📅', label: 'Ưu đãi tuần', value: '-15%' }
          ].map((item, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                marginBottom: '12px'
              }}>{item.icon}</div>
              <div style={{
                fontSize: '14px',
                color: '#666',
                marginBottom: '4px'
              }}>{item.label}</div>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a1a1a'
              }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Description và Available Rooms */}
        <div className={styles.hotelDescription}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            marginBottom: '24px',
            color: '#1a1a1a'
          }}>Mô tả khách sạn</h2>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.8',
            color: '#4a5568',
            marginBottom: '40px',
            maxWidth: '800px'
          }}>{hotelData?.text || 'Description'}</p>

          {/* Available Rooms Loading/Error State */}
          {searchAvailableRoomsMutation.isLoading && (
            <div className={styles.availableLoading}>
              <Loader />
              <p>Đang tìm phòng trống...</p>
            </div>
          )}

          {searchAvailableRoomsMutation.isError && (
            <div className={styles.availableError}>😕 Không thể tìm phòng lúc này, vui lòng thử lại</div>
          )}

          {/* Available Rooms Section */}
          {showAvailableRooms && !searchAvailableRoomsMutation.isLoading && (
            <section id="available-rooms-section" ref={availableRoomsSectionRef} className={styles.availableRoomsSection}>
              <h3 style={{
                fontSize: '28px',
                fontWeight: '600',
                marginBottom: '32px',
                color: '#1a1a1a'
              }}>
                Phòng có sẵn ({availableRooms.length})
              </h3>
              {availableRooms.length > 0 ? (
                <AvailableRooms availableRooms={availableRooms} searchParams={searchParams} onRoomSelect={handleRoomSelect} />
              ) : (
                <div style={{
                  padding: '48px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px'
                }}>
                  <div style={{
                    fontSize: '48px',
                    marginBottom: '16px'
                  }}>🏨</div>
                  <h4 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>Không có phòng trống</h4>
                  <p style={{ color: '#666' }}>
                    Không tìm thấy phòng trống cho khoảng thời gian đã chọn
                  </p>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Room Types Grid */}
        <div style={{ marginBottom: '60px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '600',
              color: '#1a1a1a'
            }}>Loại phòng</h2>
            <span style={{
              color: '#666',
              fontSize: '16px'
            }}>{roomArray.length} loại phòng</span>
          </div>

          <div className={styles.roomTypesGrid}>
            {roomArray.map((room, index) => (
              <div key={index} className={styles.roomCard}>
                <div className={styles.roomImage}>
                  <img src={galleryImages[index + 1]?.url || '/default-room.jpg'} alt={room.room_type} />
                </div>
                <div className={styles.roomCardBody}>
                  <h3 className={styles.roomCardTitle}>{room.room_type}</h3>
                  <div className={styles.roomCardFooter}>
                    <div>
                      <div className="room-price-label">Giá mỗi đêm</div>
                      <div className={styles.roomPrice}>{Number(room.price).toLocaleString('vi-VN')}₫</div>
                    </div>
                    <button className={styles.btnPrimary}>Đặt ngay</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            marginBottom: '40px',
            color: '#1a1a1a'
          }}>
            Tiện nghi nổi bật
          </h2>

          <div className={styles.amenitiesGrid}>
            {amenitiesArray.slice(0, 8).map((amenity, index) => (
              <div key={index} className={styles.amenityItem}>
                <div className={styles.amenityIcon}><AmenityIcon amenityName={amenity} style={{ color: 'white' }} /></div>
                <span className={styles.amenityLabel}>{amenity}</span>
              </div>
            ))}
          </div>

          {amenitiesArray.length > 8 && (
            <div style={{ textAlign: 'center' }}>
              <button style={{
                padding: '12px 32px',
                backgroundColor: 'transparent',
                border: '2px solid #2563eb',
                color: '#2563eb',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                ':hover': {
                  backgroundColor: '#2563eb',
                  color: 'white'
                }
              }}>
                Xem thêm {amenitiesArray.length - 8} tiện nghi
              </button>
            </div>
          )}
        </div>

        {/* Hotel Styles */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '600',
            marginBottom: '32px',
            color: '#1a1a1a'
          }}>
            Phong cách
          </h2>

          <div className={styles.stylesList}>
            {styleArray.map((style, index) => (
              <div key={index} className={styles.stylePill}>
                <div className={styles.styleIcon}><i className="fas fa-palette" /></div>
                <span className="style-label">{style.style}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ marginBottom: '60px' }}>
          <HotelReviewStats statsData={reviewStats} loading={loadingStats} />

          <div className={styles.reviewsGrid}>
            {/* Review Form */}
            <div className={styles.reviewForm}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '24px',
                color: '#1a1a1a'
              }}>
                Đánh giá của bạn
              </h3>
              <HotelReviewSubmit
                hotelId={hotelId}
                onReviewSubmit={handleReviewSubmit}
                isSubmitting={submitReviewMutation.isLoading}
              />
            </div>

            {/* Reviews List */}
            <div className={styles.reviewList}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '32px',
                color: '#1a1a1a'
              }}>
                Đánh giá từ khách hàng ({commentsData?.length || 0})
              </h3>
              <HotelReviewsList
                reviews={commentsData || []}
                loading={loadingComments}
                hotelId={hotelId}
                onCommentPosted={refetchComments}
              />
            </div>
          </div>
        </div>

        {/* Similar Hotels và Same Province Hotels */}
        <div className={styles.similarSection}>
          <div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '24px',
              color: '#1a1a1a'
            }}>
              Khách sạn cùng khu vực
            </h3>
            <SameProvinceHotels currentHotelId={hotelData?.id} />
          </div>

          <div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '600',
              marginBottom: '24px',
              color: '#1a1a1a'
            }}>
              Khách sạn tương tự
            </h3>
            <SimilarHotel currentHotelId={hotelData?.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;