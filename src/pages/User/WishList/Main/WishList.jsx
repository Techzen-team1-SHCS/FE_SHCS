import { useState } from 'react';
import styles from '../WishList.module.css';
import Loader from '../../../../components/Loading/Loader';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from "../Hooks/useWishlist";
import { RATING_FILTER_OPTIONS } from "../Constants/wishlistConstants";
import { getRatingColor, getRatingText } from "../Helpers/wishlistHelpers";
import QuickActions from '../Component/QuickActions/QuickActions';
import HeroBanner from '../Component/HeroBanner/HeroBanner';
import FilterSection from '../Component/FilterSection/FilterSection';
import EmptyWishlist from '../Component/EmptyWishlist/EmptyWishlist';
import HotelCard from '../Component/HotelCard/HotelCard';
import ContentHeader from '../Component/ContentHeader/ContentHeader';
const WishList = () => {
  const { selected, setSelected, wishList, filteredList, loading, removeWishList } = useWishlist();
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const options = RATING_FILTER_OPTIONS;

  const handleRemove = (wishListId, e) => {
    e.stopPropagation();
    removeWishList(wishListId);
  };

  const handleClick = (value) => {
    setSelected(value);
    setShowFilter(false);
  };

  return (
    <div className={styles.container}>
      {/* Hero Banner */}
      <HeroBanner wishList={wishList} />

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header Section */}
        <ContentHeader
          showFilter={showFilter}
          setShowFilter={setShowFilter}
        />

        {/* Filter Options */}
        <FilterSection
          showFilter={showFilter}
          filteredList={filteredList}
          options={options}
          selected={selected}
          handleClick={handleClick}
        />

        {/* Hotel Cards Grid */}
        <div className={styles.hotelsGrid}>
          {loading && (
            <div className={styles.loaderContainer}>
              <Loader />
            </div>
          )}

          {!loading && filteredList.length === 0 && (
            <EmptyWishlist navigate={navigate} />
          )}

          {!loading && filteredList.map((item) => (
            <HotelCard
              key={item.id}
              item={item}
              navigate={navigate}
              handleRemove={handleRemove}
              getRatingColor={getRatingColor}
              getRatingText={getRatingText}
            />
          ))}
        </div>

        {/* Quick Actions */}
        {!loading && filteredList.length > 0 && (
          <QuickActions navigate={navigate} />
        )}
      </div>
    </div>
  );
};

export default WishList;