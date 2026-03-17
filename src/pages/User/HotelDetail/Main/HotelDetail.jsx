import { useNavigate, useParams } from 'react-router-dom';

import styles from '../style.module.css';
import '../style.css';

import HotelBooking from '../Component/HotelBooking/HotelBooking.jsx';
import AmenityIcon from '../Component/Amenities/AmenityIcon.jsx';
import SameProvinceHotels from '../Component/SameProvinces/SameProvinceHotels.jsx';
import SimilarHotel from '../Component/SimilarHotel/SimilarHotel.jsx';
import NavigationTabs from '../../../../components/NavigationTabs/NavigationTabs.jsx';
import AvailableRooms from '../Component/AvailableRooms/AvailableRooms.jsx';
import HotelReviewSubmit from '../Component/HotelReviewSubmit/HotelReviewSubmit.jsx';
import HotelReviewsList from '../Component/HotelReviewsList/HotelReviewsList.jsx';
import HotelReviewStats from '../Component/HotelReviewStats/HotelReviewStats.jsx';
import Loader from '../../../../components/Loading/Loader.jsx';

import { useHotelDetail } from '../Hooks/useHotelDetail';
import HotelHeroSection from '../Component/HotelHeroSection/HotelHeroSection.jsx';
import GalleryBookingSection from '../Component/GalleryBookingSection/GalleryBookingSection.jsx';
import RoomFeatures from '../Component/RoomFeatures/RoomFeatures.jsx';
import HotelDescriptionSection from '../Component/HotelDescriptionSection/HotelDescriptionSection.jsx';
import RoomTypesSection from '../Component/RoomTypesSection/RoomTypesSection.jsx';
import AmenitiesSection from '../Component/AmenitiesSection/AmenitiesSection.jsx';
import HotelStylesSection from '../Component/HotelStylesSection/HotelStylesSection.jsx';

const HotelDetail = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const {
    hotelData,
    loadingHotel,
    hotelError,
    commentsData,
    loadingComments,
    reviewStats,
    loadingStats,

    availableRooms,
    showAvailableRooms,
    searchParams,
    availableRoomsSectionRef,
    searchAvailableRoomsMutation,

    showAllPhotos,
    setShowAllPhotos,

    handleReviewSubmit,
    handleBookNowFromCalendar,
    refetchComments,
    submitReviewMutation,

    galleryImages,
    amenitiesArray,
    roomArray,
    styleArray,
  } = useHotelDetail(hotelId);
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

  const handleRoomSelect = (room, quantity) => {
    navigate(`/booking/`, {
      state: {
        room,
        quantity,
        searchParams,
        hotel: hotelData,
      },
    });
  };

  return (
    <div className="page-wrapper">
      {/* Hero Section với background gradient */}
      <HotelHeroSection
        hotelData={hotelData}
        galleryImages={galleryImages}
        reviewStats={reviewStats}
      />

      {/* Main Content Container */}
      <div className={styles.hotelMainContainer}>
        {/* Navigation Tabs */}
        <div style={{ marginBottom: '40px' }}>
          <NavigationTabs hotelId={hotelData?.id} />
        </div>

        {/* Gallery và Booking Section */}
        <GalleryBookingSection
          galleryImages={galleryImages}
          hotelId={hotelId}
          roomArray={roomArray}
          handleBookNowFromCalendar={handleBookNowFromCalendar}
        />

        {/* Room Features */}
        <RoomFeatures room={roomArray[0]} />

        {/* Description và Available Rooms */}
        <HotelDescriptionSection
          hotelData={hotelData}
          showAvailableRooms={showAvailableRooms}
          availableRooms={availableRooms}
          searchParams={searchParams}
          handleRoomSelect={handleRoomSelect}
          searchAvailableRoomsMutation={searchAvailableRoomsMutation}
          availableRoomsSectionRef={availableRoomsSectionRef}
        />

        {/* Room Types Grid */}
        <RoomTypesSection
          roomArray={roomArray}
          galleryImages={galleryImages}
        />

        {/* Amenities Section */}
        <AmenitiesSection amenitiesArray={amenitiesArray} />

        {/* Hotel Styles */}
        <HotelStylesSection styleArray={styleArray} />

        {/* Reviews Section */}
        <div style={{ marginBottom: '60px' }}>
          <HotelReviewStats
            statsData={reviewStats}
            loading={loadingStats}
          />

          <div className={styles.reviewsGrid}>
            {/* Review Form */}
            <div className={styles.reviewForm}>
              <HotelReviewSubmit
                hotelId={hotelId}
                onReviewSubmit={handleReviewSubmit}
                isSubmitting={submitReviewMutation.isLoading}
              />
            </div>

            {/* Reviews List */}
            <div className={styles.reviewList}>
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  marginBottom: '32px',
                  color: '#1a1a1a',
                }}
              >
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
            <h3
              style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '24px',
                color: '#1a1a1a',
              }}
            >
              Khách sạn cùng khu vực
            </h3>
            <SameProvinceHotels currentHotelId={hotelData?.id} />
          </div>

          <div>
            <SimilarHotel currentHotelId={hotelData?.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;

