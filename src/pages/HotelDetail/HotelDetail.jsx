import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import HotelBooking from '../../components/HotelBooking/HotelBooking.jsx';
import { hotelService } from '../../services/hotelService';
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
      <div className="hotel-hero-section">
        <div 
          className="hero-background"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)), url(${galleryImages[0]?.url})`,
            height: '600px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
          <div className="hero-content" style={{
            position: 'absolute',
            bottom: '80px',
            left: '120px',
            color: 'white',
            maxWidth: '800px'
          }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '700',
              marginBottom: '16px',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
              {hotelData?.name || 'Hotel Name'}
            </h1>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              fontSize: '18px',
              marginBottom: '32px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-map-marker-alt"></i>
                {hotelData?.description || 'Location'}
              </span>
              {reviewStats?.averageRating && (
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <i className="fas fa-star" style={{ color: '#FFD700' }}></i>
                  <span>{reviewStats.averageRating.toFixed(1)}</span>
                  <span style={{ opacity: 0.8 }}>({reviewStats.totalReviews} đánh giá)</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div style={{ 
        width: '1200px', 
        margin: '0 auto',
        padding: '40px 0'
      }}>
        {/* Navigation Tabs */}
        <div style={{ marginBottom: '40px' }}>
          <NavigationTabs hotelId={hotelData?.id} />
        </div>

        {/* Gallery và Booking Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '40px',
          marginBottom: '60px'
        }}>
          {/* Gallery */}
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                gridColumn: 'span 2',
                height: '300px',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                <img 
                  src={galleryImages[0]?.url} 
                  alt="Main view"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              {galleryImages.slice(1, 3).map((img, index) => (
                <div key={index} style={{
                  height: '200px',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={img.url} 
                    alt={`Gallery ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              ))}
            </div>
            {galleryImages.length > 3 && (
              <button
                onClick={() => setShowAllPhotos(!showAllPhotos)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f5f5f5',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className={`fas fa-${showAllPhotos ? 'minus' : 'plus'}`}></i>
                {showAllPhotos ? 'Ẩn bớt ảnh' : `Xem tất cả ${galleryImages.length} ảnh`}
              </button>
            )}
          </div>

          {/* Booking Widget */}
          <div style={{
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
            height: 'fit-content',
            position: 'sticky',
            top: '40px'
          }}>
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
              price={roomArray[0].price}
              style={{ border: 'none' }}
            />

          </div>
        </div>

        {/* Room Features */}
        <div style={{
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '40px',
          display: 'flex',
          justifyContent: 'space-around'
        }}>
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
        <div style={{ marginBottom: '60px' }}>
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
            <div style={{
              padding: '40px',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              marginTop: '40px'
            }}>
              <Loader />
              <p style={{ marginTop: '16px', color: '#666' }}>Đang tìm phòng trống...</p>
            </div>
          )}

          {searchAvailableRoomsMutation.isError && (
            <div style={{
              padding: '24px',
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              marginTop: '40px',
              textAlign: 'center',
              color: '#555'
            }}>
              😕 Không thể tìm phòng lúc này, vui lòng thử lại
            </div>
          )}

          {/* Available Rooms Section */}
          {showAvailableRooms && !searchAvailableRoomsMutation.isLoading && (
            <section
              id="available-rooms-section"
              ref={availableRoomsSectionRef}
              style={{ marginTop: '60px' }}
            >
              <h3 style={{
                fontSize: '28px',
                fontWeight: '600',
                marginBottom: '32px',
                color: '#1a1a1a'
              }}>
                Phòng có sẵn ({availableRooms.length})
              </h3>
              {availableRooms.length > 0 ? (
                <AvailableRooms
                  availableRooms={availableRooms}
                  searchParams={searchParams}
                  onRoomSelect={handleRoomSelect}
                />
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
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            {roomArray.map((room, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                transition: 'transform 0.3s ease',
                ':hover': {
                  transform: 'translateY(-4px)'
                }
              }}>
                <div style={{
                  height: '200px',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={galleryImages[index + 1]?.url || '/default-room.jpg'} 
                    alt={room.room_type}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div style={{ padding: '24px' }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '12px',
                    color: '#1a1a1a'
                  }}>{room.room_type}</h3>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '20px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        color: '#666',
                        marginBottom: '4px'
                      }}>Giá mỗi đêm</div>
                      <div style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#2563eb'
                      }}>
                        {Number(room.price).toLocaleString('vi-VN')}₫
                      </div>
                    </div>
                    <button style={{
                      padding: '12px 24px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      ':hover': {
                        backgroundColor: '#1d4ed8'
                      }
                    }}>
                      Đặt ngay
                    </button>
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
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {amenitiesArray.slice(0, 8).map((amenity, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#2563eb',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AmenityIcon amenityName={amenity} style={{ color: 'white' }} />
                </div>
                <span style={{
                  fontWeight: '500',
                  color: '#1a1a1a'
                }}>{amenity}</span>
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
          
          <div style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            {styleArray.map((style, index) => (
              <div key={index} style={{
                padding: '16px 32px',
                backgroundColor: '#f0f9ff',
                border: '2px solid #7dd3fc',
                borderRadius: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#0ea5e9',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-palette" style={{ color: 'white', fontSize: '12px' }}></i>
                </div>
                <span style={{
                  fontWeight: '500',
                  color: '#0369a1'
                }}>{style.style}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ marginBottom: '60px' }}>
          <HotelReviewStats statsData={reviewStats} loading={loadingStats} />
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '60px',
            marginTop: '40px'
          }}>
            {/* Review Form */}
            <div style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
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
            <div>
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px'
        }}>
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