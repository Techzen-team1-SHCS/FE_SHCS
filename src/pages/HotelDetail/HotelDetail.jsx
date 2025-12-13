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
    staleTime: 5 * 60 * 1000, // 5 phút
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
    staleTime: 2 * 60 * 1000, // 2 phút
  });

  // Query để lấy review stats
  const {
    data: reviewStats,
    isLoading: loadingStats,
    isError: statsError
  } = useQuery({
    queryKey: ['hotel-review-stats', hotelId],
    queryFn: () => commentService.getReviewStats(hotelId), // Giả sử có service này
    enabled: !!hotelId,
    staleTime: 3 * 60 * 1000, // 3 phút
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
      // Invalidate và refetch các queries liên quan
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
      console.error('Error fetching available rooms:', error);
      alert('Không thể tải danh sách phòng trống');
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
      {/* Banner Image - Hiển thị ngay lập tức */}
      <img
        src={galleryImages[0]?.url}
        alt="Destination 1"
        style={{ height: '500px', width: '100%', objectFit: 'cover' }}
      />

      {/* Navigation Tabs - Hiển thị ngay lập tức */}
      <NavigationTabs hotelId={hotelData?.id} />

      {/* Hotel Header - Hiển thị ngay lập tức */}
      <section className="page-banner-two rel z-1 mt-20">
        <div className="container-fluid" style={{ width: '85%', alignItems: 'center', justifyContent: 'center' }}>
          <div className="container3">
            <div className="banner-inner ">
              <h2 className="page-title">{hotelData?.name || 'Hotel Name'}</h2>
            </div>
            <span className="location d-inline-block mb-10">
              <i className="fal fa-map-marker-alt"></i> {hotelData?.description || 'Location'}
            </span>
          </div>
        </div>
      </section>

      {/* Gallery và Booking - Hiển thị ngay lập tức */}
      <div className="tour-gallery">
        <div className="container-fluid" style={{ width: '85%', alignItems: 'center', justifyContent: 'center' }}>
          <div className="container1">
            <div className='image-sequence'>
              <img src={galleryImages[0]?.url} alt="Destination 1" />
              <img src={galleryImages[1]?.url} alt="Destination 1" />
              <img src={galleryImages[2]?.url} alt="Destination 1" />
            </div>
            <div className='content2'>
              <HotelBooking onBook={handleBookNowFromCalendar} hotelId={hotelId} />
            </div>
          </div>
          
          {/* Room Info - Hiển thị ngay lập tức */}
          <div className='container2'>
            {roomArray.length > 0 ? (
              <>
                {roomArray.slice(0, 1).map((room) => (
                  <div key={room.id} className='roomStyle'>
                    <div className='item1'>
                      <img src="/assets/images/about/icon-user-grey.svg" alt="" />
                      <p>{room.max_guest} GUEST</p>
                    </div>
                    <div className='item1'>
                      <img src="/assets/images/about/icon-plan-grey.svg" alt="" />
                      <p>70 ft</p>
                    </div>
                    <div className='item1'>
                      <img src="/assets/images/about/icon-bed-grey.svg" alt="" />
                      <p>{Number(room.price).toLocaleString('vi-VN')} / PER NIGHT</p>
                    </div>
                    <div className='item1'>
                      <img src="/assets/images/about/icon-calendar-grey.svg" alt="" />
                      <p>WEEK PRICE</p>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div>Không có dữ liệu</div>
            )}
          </div>
          <div className='lineRoom'></div>
        </div>
      </div>

      {/* Description và Available Rooms */}
      <section className="container-fluid" style={{ width: '85%', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container3">
          <div className="tour-header-content mb-15">
            <div className=" body-content pb-5">
              <div className="description-content">
                <p>{hotelData?.text || 'Description'}</p>
                
                {/* Loading state cho available rooms */}
                {searchAvailableRoomsMutation.isLoading && (
                  <div style={{ marginTop: '50px' }}>
                    <Loader />
                    <p>Đang tìm phòng trống...</p>
                  </div>
                )}

                {/* Error state cho available rooms */}
                {searchAvailableRoomsMutation.isError && (
                  <div style={{ marginTop: '50px', color: 'red' }}>
                    Đã có lỗi xảy ra khi tìm phòng
                  </div>
                )}

                {/* Available rooms section */}
                {showAvailableRooms && !searchAvailableRoomsMutation.isLoading && (
                  <section
                    id="available-rooms-section"
                    ref={availableRoomsSectionRef}
                    style={{ width: '100%', marginTop: '50px' }}
                  >
                    {availableRooms.length > 0 ? (
                      <AvailableRooms
                        availableRooms={availableRooms}
                        searchParams={searchParams}
                        onRoomSelect={handleRoomSelect}
                      />
                    ) : (
                      <div>Không có phòng trống cho khoảng ngày đã chọn</div>
                    )}
                  </section>
                )}
              </div>
              
              {/* Room List và Styles - Hiển thị ngay lập tức */}
              <div className='style2-content'>
                <div className='contentRoom'>
                  <div className='titleRoom'>Best Rooms</div>
                  <div className='containerRoom'>
                    {roomArray.map((item, index) => (
                      item?.room_type && (
                        <div key={index} className='roomRender'>
                          <img src={galleryImages[index + 1]?.url || '/default-room.jpg'} alt="Destination 1" />
                          <div className='info-room'>
                            <span className='room_type'>{item?.room_type}</span>
                            <span className='price'>
                              {item?.price
                                ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)
                                : "N/A"}
                            </span>
                            <Button props={'Book Now'}></Button>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
                <div className='title-style'>
                  <p>Thể Loại</p>
                </div>
                <div className='content-style'>
                  {styleArray.map((item, index) => (
                    item?.style && (
                      <div key={index} className='contentStyle'>
                        <img src="/assets/images/about/pdf-gold.svg" alt="" />
                        <p>Thể Loại {item?.style}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          </div>
          <hr className="mb-30" />
        </div>
      </section>

      {/* Amenities - Hiển thị ngay lập tức */}
      <section className="container-fluid pb-70px" style={{ width: '85%', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container3">
          <h2>Các tiện nghi được ưa chuộng nhất</h2>
          <div className="d-flex mb-20 mt-20 " style={{ gap: '100px' }}>
            {amenitiesArray.length
              ? amenitiesArray.map((amenity, i) => (
                <h4 key={i}>
                  <AmenityIcon amenityName={amenity} /> {amenity}
                </h4>
              ))
              : (
                <>
                  <h4><i className="fas fa-wifi"></i> Wifi miễn phí</h4>
                  <h4><i className="fas fa-parking"></i> Chỗ đậu xe</h4>
                </>
              )}
          </div>
          <hr className="mb-30" />

          <div className='info-around-Hotel'>
            <div className='around-Hotel'>
              <h1 className='title-around'>Around The Hotel</h1>
              <div className='content-around' style={{ display: 'flex', gap: '30px' }}>
                {amenitiesArray.length
                  ? amenitiesArray.slice(0, 3).map((amenity, i) => (
                    <div key={i} className="amenity-item" style={{ minWidth: '150px' }}>
                      <AmenityImageCard key={i} amenityName={amenity} />
                    </div>
                  ))
                  : null
                }
              </div>
            </div>
            <hr className="mb-30" style={{ height: '400px', width: '1px' }} />
            <div className='branch-Hotel'>
              {/* Same Province Hotels có thể tự xử lý loading */}
              <SameProvinceHotels currentHotelId={hotelData?.id} />
            </div>
          </div>
          <hr className="mb-30" />
          
          {/* Similar Hotel có thể tự xử lý loading */}
          <SimilarHotel currentHotelId={hotelData?.id} />
        </div>
        <hr className="mb-30" />
      </section>

      {/* Reviews Section */}
      <section className="container-fluid pb-70px" style={{ width: '85%', alignItems: 'center', justifyContent: 'center' }}>
        {/* Review Stats với loading riêng */}
        <HotelReviewStats statsData={reviewStats} loading={loadingStats} />
        
        {/* Review Submit Form */}
        <HotelReviewSubmit
          hotelId={hotelId}
          onReviewSubmit={handleReviewSubmit}
          isSubmitting={submitReviewMutation.isLoading}
        />
        
        <hr className="mb-30" />
        
        {/* Reviews List với loading riêng */}
        <HotelReviewsList
          reviews={commentsData || []}
          loading={loadingComments}
          hotelId={hotelId}
          onCommentPosted={refetchComments}
        />
      </section>
    </div>
  );
};

export default HotelDetail;