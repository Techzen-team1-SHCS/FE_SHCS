import { useEffect, useState } from 'react';
import styles from './WishList.module.css';
import { FaStar } from 'react-icons/fa';
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
  const navigate = useNavigate();
  const options = [
  { label: 'Tất cả', value: 0, exact: false },
  { label: '5.0', value: 5.0, exact: true },
  { label: '4.5+', value: 4.5, exact: false },
  { label: '4.0', value: 4.0, exact: true },
  { label: '3.5', value: 3.5, exact: true },
  { label: '3.0', value: 3.0, exact: true },
];

  const handleRemove = async (wishListId) => {
    try {
      await wishListService.removeFromWishList(wishListId);

      // cập nhật danh sách sau khi xóa
      const updated = wishList.filter(item => item.id !== wishListId);
      setWishList(updated);
      setFilteredList(updated);

      toast.success('Xóa thành công');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleClick = (value) => {
    setSelected(value);
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
          return rating === selected; // đúng giá trị
        } else {
          return rating >= selected; // >= giá trị
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
        setFilteredList(response.data); // cần thiết
      } catch (error) {
        console.error('Failed to fetch wish list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishList();
  }, []);

  const { container, banner, content, content1, TabOption, option, active,
    content2, card, img, contentCard, footerCard, price, btn, description, rating 
  } = styles;

  return (
    <div className={container}>
      <div className={banner}>
        <img
          src="https://cdn6.agoda.net/images/WebCampaign/20251103_ss_doubleday1111/home_banner_web/vi-vn.png"
          alt=""
          style={{ width: '100%', objectFit: 'cover', height: '400px', marginBottom: '50px' }}
        />
      </div>

      <div className={content}>
        <div className={content1}>
          <h3>Khách sạn yêu thích của bạn</h3>
          <p>Danh sách các khách sạn yêu thích</p>

          <div className={TabOption}>
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`${option} ${selected === opt.value ? active : ''}`}
                onClick={() => handleClick(opt.value)}
              >
                {opt.label !== 'Tất cả' && <FaStar size={14} />}
                {opt.label}
              </div>
            ))}
          </div>
        </div>

        <div className={content2}>
          {loading && <Loader />}
          {!loading && filteredList.length === 0 && <a href='/HotelList'>Chưa có khách sạn yêu thích</a>}

          {!loading && filteredList.map((item) => (
            <div key={item.id} className={card} onClick={()=>navigate(`/hotel/${item.hotel.id}`)} style={{cursor:'pointer'}}>
              <div className={img}>
                <div className={rating}>
                  <i className="fas fa-star"></i> {(item.hotel.hotel_class / 10).toFixed(1)}
                </div>
                <img src={item.hotel.images[1].url} alt={item.title} />
              </div>

              <div className={contentCard}>
                <h3>{item.hotel.name}</h3>
                <p className="fal fa-map-marker-alt"> {item.hotel.province}</p>
                <span className={description}>{item.hotel.text}</span>

                <div className={footerCard}>
                  <span className={price}>
                    {Number(item.hotel.price).toLocaleString('vi-VN')} ₫
                  </span>

                  <div className={btn}>
                    <Button onClick={() => handleRemove(item.id)} props="Xóa Khách sạn" />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishList;
