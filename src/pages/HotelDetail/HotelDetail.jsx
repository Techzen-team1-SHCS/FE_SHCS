import  { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import HotelReviewStats from '../../components/HotelReviewStats/HotelReviewStats.jsx';

const HotelDetail = () => {
  const { hotelId } = useParams();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [availableRooms,setAvailableRooms]=useState([]);
  const [showAvailableRooms,setShowAvailableRooms]=useState(false);
   const [searchParams, setSearchParams] = useState(null);
  const [hotelData, setHotelData] = useState(null); // object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const navigate=useNavigate();
  const availableRoomsSectionRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewStats, setReviewStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const handleReviewSubmit = async (reviewData) => {
    try {
      // Mock function - thay bằng API call thực tế
      const response = await hotelService.submitReview(reviewData);
      const newReview = {
        id: response.data?.id || Date.now(),
        ...reviewData,
        user: response.data?.user?.name || response.data?.user_name || "Current User",
        date: response.data?.created_at ? new Date(response.data.created_at).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
        avatar: response.data?.user?.avatar || response.data?.avatar || "/assets/images/users/user-default.jpg"
      };
      
      setReviews(prev => [newReview, ...prev]);
      return newReview;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };
  // Thêm useEffect để load review stats
  useEffect(() => {
    const loadReviewStats = async () => {
      if (!hotelId) return;
      
      setLoadingStats(true);
      try {
        const statsData = await hotelService.getHotelReviewStats(hotelId);
        setReviewStats(statsData);
      } catch (error) {
        console.error('Error loading review stats:', error);
        // Có thể giữ null để component sử dụng default data
      } finally {
        setLoadingStats(false);
      }
    };

    if (hotelId) {
      loadReviewStats();
    }
  }, [hotelId]);
  useEffect(() => {
    const loadReviews = async () => {
      if (!hotelId) return;
      
      setLoadingReviews(true);
      try {
        const reviewsData = await hotelService.getHotelReviews(hotelId);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error loading reviews:', error);
        // Không set mock data, để mảng rỗng nếu API fail
      } finally {
        setLoadingReviews(false);
      }
    };

   if (hotelId) {
      loadReviews();
   }
}, [hotelId]);
  // Thêm useEffect để xử lý scroll
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
  const handleBookNowFromCalendar = async (bookingData) => {
    
    
    try {
      setLoadingRooms(true);
      const rooms = await hotelService.getAvailableRooms(
        hotelId, 
        bookingData.checkIn, 
        bookingData.checkOut, 
        bookingData.guests,
        bookingData.nights
      );
      
      setAvailableRooms(rooms);
      setSearchParams(bookingData);
      setShowAvailableRooms(true);
      console.log('🔍 searchParams sau khi set:', bookingData);
      // Scroll xuống phần phòng trống
    } catch (err) {
      console.error('Error fetching available rooms:', err);
      alert('Không thể tải danh sách phòng trống');
    } finally {
      setLoadingRooms(false);
    }
  };
  const handleRoomSelect = (room, quantity) => {
    console.log('Selected room:', room, 'Quantity:', quantity);
    // Điều hướng đến trang checkout hoặc xử lý booking
    navigate(`/booking/`, { 
      state: { 
        room, 
        quantity, 
        searchParams,
        hotel: hotelData 
      } 
    });
  };
  useEffect(() => {
    const fetchHotelData = async () => {
      setLoading(true);
      try {
        const data = await hotelService.getHotelById(hotelId);
        setHotelData(data || null);
      } catch (err) {
        console.error('Error fetching hotel data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) fetchHotelData();
  }, [hotelId]);
  console.log(hotelData);
  if (loading) return <div className="page-wrapper">Loading...</div>;
  if (error) return <div className="page-wrapper">Error: {error}</div>;
  if (!hotelData) return <div className="page-wrapper">No data found</div>;

  

  // Chuyển hotelData thành array để map giống TopHotelSlider
  const hotelArray = [hotelData];

  return (
    <div className="page-wrapper">
      
      {hotelArray.map((hotel) => {
        const galleryImages = hotel.images || [];
        const amenitiesArray = hotel.amenities ? JSON.parse(hotel.amenities) : [];
        const roomArray=hotel.rooms || [];
        const styleArray=hotel.styles || [];
        console.log(amenitiesArray);
        console.log(galleryImages);
        return (
          <div key={hotel.id}>
            <img  src={galleryImages[0]?.url} alt="Destination 1" style={{height:'500px',width:'100%',objectFit:'cover'}} />
            <NavigationTabs hotelId={hotel.id} />
            <section className="page-banner-two rel z-1 mt-20">
              <div className="container-fluid" style={{ width: '85%',alignItems: 'center', justifyContent: 'center'   }}>
                <div className="container3">
                  <div className="banner-inner ">
                    <h2 className="page-title">{hotel.name || 'Hotel Name'}</h2>
                  </div>
                  <span className="location d-inline-block mb-10">
                    <i className="fal fa-map-marker-alt"></i> { hotel.description || 'Location'}
                  </span>
                </div>
              </div>
            </section>

            <div className="tour-gallery">
              <div className="container-fluid" style={{ width: '85%',alignItems: 'center', justifyContent: 'center'   }}>
                <div className="container1">
                  {/* Ảnh 1 */}
                  <div className='image-sequence'>
                      <img  src={galleryImages[0]?.url} alt="Destination 1" />
                      <img  src={galleryImages[1]?.url} alt="Destination 1" />
                      <img  src={galleryImages[2]?.url} alt="Destination 1" />
                  </div>
                  <div className='content2'>
                      <HotelBooking onBook={handleBookNowFromCalendar} hotelId={hotelId}/>
                  </div>
                </div>
                <div className='container2'>
                  {roomArray.length > 0 ?(
                  <>
                    {roomArray.slice(0,1).map((room)=>(
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
                ):(
                  <div>Không có dữ liệu</div>
                )}
                </div>
                <div className='lineRoom'></div>
              </div>
            </div>

            <section  className="container-fluid" style={{ width: '85%',alignItems: 'center', justifyContent: 'center'   }}>
              <div className="container3">
                <div className="tour-header-content mb-15">
                  <div className=" body-content pb-5">
                    <div className="description-content">
                        <p>{hotel.text || 'Description'}</p>
                        {showAvailableRooms && (
                        <section id="available-rooms-section"  style={{ width: '100%', marginTop: '50px' }}>
                          
                          
                          {loadingRooms ? (
                            <div>Đang tải danh sách phòng...</div>
                          ) : availableRooms.length > 0 ? (
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
                    <div className='style2-content'>
                        <div className='contentRoom'>
                          <div className='titleRoom'>Best Rooms</div>
                          <div className='containerRoom'>
                            {roomArray.map((item,index)=>(
                              item?.room_type&&(
                                <div key={index} className='roomRender'>
                                  <img  src={galleryImages[index+1]?.url} alt="Destination 1" />
                                  <div className='info-room'>
                                    <span className='room_type'>{item.room_type}</span>
                                    <span className='price'>{item.price
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
                                <p>Thể Loại {item.style}</p>
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
           
            <section className="container-fluid pb-70px" style={{ width: '85%',alignItems: 'center', justifyContent: 'center'   }}>
              <div className="container3">
                <h2>Các tiện nghi được ưa chuộng nhất</h2>
                <div className="d-flex mb-20 mt-20 " style={{gap:'100px'}}>
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
                  <div className='content-around' style={{ display: 'flex',gap: '30px' }}>
                    {amenitiesArray.length
                      ? amenitiesArray.slice(0,3).map((amenity, i) => (
                          <div key={i} className="amenity-item" style={{ minWidth: '150px' }}>
                            <AmenityImageCard key={i} amenityName={amenity} />
                          </div>
                        ))
                      : null
                    }
                  </div> 
                   
                                
               </div>
               <hr className="mb-30" style={{height:'400px',width:'1px'}} />  
               <div className='branch-Hotel'>
                <SameProvinceHotels currentHotelId={hotel.id}></SameProvinceHotels>
               </div>
               </div>
               <hr className="mb-30" />
               <SimilarHotel currentHotelId={hotel.id}/>
              </div>
               <hr className="mb-30" />
            </section>
            <section className="container-fluid pb-70px" style={{ width: '85%',alignItems: 'center', justifyContent: 'center'   }}>
              <HotelReviewStats statsData={reviewStats} loading={loadingStats}/>
              <HotelReviewSubmit hotelId={hotelId} onReviewSubmit={handleReviewSubmit}/>
              <hr className="mb-30" />
              <HotelReviewsList reviews={reviews} loading={loadingReviews} />
            </section>
          </div>
        );
      })}
    </div>
  );
};

export default HotelDetail;
