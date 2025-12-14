import { useEffect, useState } from 'react';
import styles from './WishList.module.css';
import { FaStar, FaMapMarkerAlt, FaHeart,FaTrash , FaRegHeart, FaFilter } from 'react-icons/fa';
import Button from '../../components/Button/Button';
import { wishListService } from '../../services/wishListService';
import Loader from '../../components/Loading/Loader';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const WishList = () => {
  const [selected, setSelected] = useState(0);
  const [wishList, setWishList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  
  const options = [
    { label: 'Tất cả', value: 0, exact: false },
    { label: '5.0', value: 5.0, exact: true },
    { label: '4.5+', value: 4.5, exact: false },
    { label: '4.0+', value: 4.0, exact: false },
    { label: '3.5+', value: 3.5, exact: false },
    { label: '3.0+', value: 3.0, exact: false },
  ];

  const handleRemove = async (wishListId, e) => {
    e.stopPropagation();
    try {
      await wishListService.deleteWishList(wishListId);
      const updated = wishList.filter(item => item.id !== wishListId);
      setWishList(updated);
      setFilteredList(updated);
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleClick = (value) => {
    setSelected(value);
    setShowFilter(false);
  };

  // Lọc theo rating
  useEffect(() => {
    if (selected === 0) {
      setFilteredList(wishList);
    } else {
      const optionSelected = options.find(opt => opt.value === selected);
      setFilteredList(
        wishList.filter(item => {
          const rating = item.hotel.hotel_class / 10;
          if (optionSelected.exact) {
            return rating === selected;
          } else {
            return rating >= selected;
          }
        })
      );
    }
  }, [selected, wishList]);

  // Lấy wishlist từ API
  useEffect(() => {
    const fetchWishList = async () => {
      setLoading(true);
      try {
        const response = await wishListService.getWishList();
        setWishList(response.data);
        setFilteredList(response.data);
      } catch (error) {
        console.error('Failed to fetch wish list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishList();
  }, []);

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#10B981';
    if (rating >= 4.0) return '#F59E0B';
    if (rating >= 3.5) return '#EF4444';
    return '#6B7280';
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return 'Xuất sắc';
    if (rating >= 4.0) return 'Tốt';
    if (rating >= 3.5) return 'Khá';
    return 'Trung bình';
  };

  return (
    <div className={styles.container}>
      {/* Hero Banner */}
      <div className={styles.heroBanner}>
        <img
          src="https://cdn6.agoda.net/images/WebCampaign/20251103_ss_doubleday1111/home_banner_web/vi-vn.png"
          alt="Wishlist Banner"
          className={styles.bannerImage}
        />
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Danh sách yêu thích</h1>
            <p className={styles.heroSubtitle}>
              Khám phá những khách sạn bạn đã lưu lại cho chuyến đi sắp tới
            </p>
            <div className={styles.wishlistStats}>
              <div className={styles.statItem}>
                <FaHeart className={styles.statIcon} />
                <span className={styles.statNumber}>{wishList.length}</span>
                <span className={styles.statLabel}>khách sạn đã lưu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header Section */}
        <div className={styles.contentHeader}>
          <div className={styles.headerText}>
            <h2>Khách sạn yêu thích của bạn</h2>
            <p>Danh sách các khách sạn bạn đã lưu lại để tham khảo sau</p>
          </div>
          
          {/* Filter Toggle for Mobile */}
          <button 
            className={styles.filterToggle}
            onClick={() => setShowFilter(!showFilter)}
          >
            <FaFilter />
            Lọc theo rating
          </button>
        </div>

        {/* Filter Options */}
        <div className={`${styles.filterSection} ${showFilter ? styles.filterSectionOpen : ''}`}>
          <div className={styles.filterHeader}>
            <h3>Lọc theo đánh giá</h3>
            <span className={styles.selectedCount}>
              {filteredList.length} khách sạn
            </span>
          </div>
          
          <div className={styles.filterOptions}>
            {options.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.filterOption} ${selected === opt.value ? styles.filterOptionActive : ''}`}
                onClick={() => handleClick(opt.value)}
              >
                <div className={styles.optionContent}>
                  {opt.label !== 'Tất cả' && (
                    <FaStar 
                      className={styles.optionStar} 
                      color={selected === opt.value ? '#FFFFFF' : '#F59E0B'} 
                    />
                  )}
                  <span className={styles.optionLabel}>{opt.label}</span>
                </div>
                {opt.label !== 'Tất cả' && !opt.exact && (
                  <span className={styles.optionPlus}>+</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Hotel Cards Grid */}
        <div className={styles.hotelsGrid}>
          {loading && (
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          )}
          
          {!loading && filteredList.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyHeart}>
                <FaRegHeart size={64} />
              </div>
              <h3>Chưa có khách sạn yêu thích</h3>
              <p>Hãy khám phá và lưu lại những khách sạn bạn yêu thích</p>
              <Button 
                onClick={() => navigate('/HotelList')}
                props="Khám phá khách sạn ngay"
                className={styles.exploreButton}
              />
            </div>
          )}

          {!loading && filteredList.map((item) => {
            const rating = item.hotel.hotel_class / 10;
            const ratingColor = getRatingColor(rating);
            const ratingText = getRatingText(rating);
            
            return (
              <div 
                key={item.id} 
                className={styles.hotelCard}
                onClick={() => navigate(`/hotel/${item.hotel.id}`)}
              >
                {/* Card Image */}
                <div className={styles.cardImage}>
                  <img 
                    src={item.hotel?.images[1]?.url || '/default-hotel.jpg'} 
                    alt={item.hotel.name} 
                  />
                  <div className={styles.cardOverlay}>
                    {/* Rating Badge */}
                    <div 
                      className={styles.ratingBadge}
                      style={{ backgroundColor: ratingColor }}
                    >
                      <FaStar className={styles.ratingStar} />
                      <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                      className={styles.removeButton}
                      onClick={(e) => handleRemove(item.id, e)}
                      title="Xóa khỏi danh sách yêu thích"
                    >
                      <FaTrash className={styles.removeIcon} />
                    </button>
                  </div>
                  
                  {/* Rating Text */}
                  <div className={styles.ratingText}>
                    {ratingText}
                  </div>
                </div>

                {/* Card Content */}
                <div className={styles.cardContent}>
                  <h3 className={styles.hotelName}>{item.hotel.name}</h3>
                  
                  <div className={styles.location}>
                    <FaMapMarkerAlt className={styles.locationIcon} />
                    <span>{item.hotel.province}</span>
                  </div>
                  
                  <p className={styles.description}>
                    {item.hotel.text || 'Khách sạn tiện nghi với đầy đủ dịch vụ hiện đại'}
                  </p>

                  {/* Price & Action */}
                  <div className={styles.cardFooter}>
                    <div className={styles.priceSection}>
                      <span className={styles.priceLabel}>Giá chỉ từ</span>
                      <span className={styles.price}>
                        {Number(item.hotel.price).toLocaleString('vi-VN')} ₫
                      </span>
                      <span className={styles.priceNote}>/đêm</span>
                    </div>
                    
                    <div className={styles.actionButtons}>
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/hotel/${item.hotel.id}`);
                        }}
                        props="Xem chi tiết"
                        className={styles.detailButton}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        {!loading && filteredList.length > 0 && (
          <div className={styles.quickActions}>
            <h3>Thao tác nhanh</h3>
            <div className={styles.actionButtons}>
              <button 
                className={styles.quickAction}
                onClick={() => navigate('/HotelList')}
              >
                <FaHeart className={styles.actionIcon} />
                <span>Thêm khách sạn yêu thích</span>
              </button>
              <button 
                className={styles.quickAction}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <FaStar className={styles.actionIcon} />
                <span>Lên đầu trang</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;