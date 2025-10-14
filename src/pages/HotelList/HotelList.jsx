import { useState, useEffect } from 'react';
import { hotelService } from '../../services/hotelService';
import SearchBar from '../../components/SearchBar/SearchBar'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import Hotel from '../../components/Hotel/Hotel';
import HotelListFilter from '../../components/HotelListFilter/HotelListFilter';
const filterData = [
    {
        title: "Các bộ lọc phổ biến",
        options: [
            { name: "4 sao", },
            { name: "Khách sạn", },
            { name: "Tuyệt hảo: 9 điểm trở lên", },
            { name: "Hồ bơi", },
            { name: "WiFi miễn phí", },
            { name: "Trung tâm Spa & chăm sóc sức khoẻ", },
            { name: "Ban công", },
            { name: "Căn hộ", },
        ],
    },
    {
        title: "Các chứng chỉ",
        options: [{ name: "Chứng chỉ bền vững", }],
    },
    {
        title: "Thương hiệu",
        options: [
            { name: "OYO Rooms", },
            { name: "VBA Hospitality Group", },
            { name: "Somerset", },
            { name: "Belvilla", },
            { name: "Muong Thanh Hospitality", },
            { name: "InterContinental Hotels & Resorts", },
        ],
    },
    {
    title: "Tiện nghi",
    options: [
      { name: "Chỗ đỗ xe" },
      { name: "Nhà hàng" },
      { name: "Dịch vụ phòng" },
      { name: "Lễ tân 24 giờ" },
      { name: "Trung tâm thể dục" },
    ],
  },
  {
    title: "Tiện nghi phòng",
    options: [
      { name: "Ban công" },
      { name: "Hồ bơi riêng" },
      { name: "Nhìn ra biển" },
      { name: "Phòng tắm riêng" },
      { name: "Bể sục" },
    ],
  },
  {
    title: "Điểm đánh giá của khách",
    options: [
      { name: "Tuyệt hảo: 9 điểm trở lên" },
      { name: "Rất tốt: 8 điểm trở lên" },
      { name: "Tốt: 7 điểm trở lên" },
      { name: "Dễ chịu: 6 điểm trở lên" },
    ],
  },
   {
    title: "Loại chỗ ở",
    options: [
      { name: "Căn hộ" },
      { name: "Khách sạn" },
      { name: "Chỗ nghỉ nhà dân" },
      { name: "Nhà khách" },
      { name: "Nhà trọ" },
      { name: "Nhà nghỉ B&B" },
      { name: "Biệt thự" },
      { name: "Nhà nghỉ mát" },
      { name: "Khách sạn tình nhân" },
      { name: "Khách sạn khoang ngủ" },
      { name: "Resort" },
      { name: "Khu cắm trại" },
      { name: "Nhà nghỉ giữa thiên nhiên" },
    ],
  },
];
function HotelList() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilters, setSelectedFilters] = useState([]);
    useEffect(() => {
        loadHotels();
    }, [selectedFilters]);
    const loadHotels = async () => {
        setLoading(true);
        try {
            const response = await hotelService.searchHotels({ filters: selectedFilters });
            if (response.status === 200) {
                setHotels(response.content.data || []);
            }
        } catch (error) {
            console.error('Error loading hotels:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleFilterChange = (newFilters) => {
        setSelectedFilters(newFilters);
    };
    return (
        <div className='page-wrapper'>
            <section
                className="page-banner-area pt-50 pb-35 rel z-1 bgs-cover"
                style={{ backgroundImage: "url(assets/images/banner/banner.jpg)" }}
            >
                <div className="container">
                    <div className="banner-inner text-white mb-50">
                        <h2
                            className="page-title mb-10"
                            data-aos="fade-left"
                            data-aos-duration="1500"
                            data-aos-offset="50"
                        >
                            Tour List View
                        </h2>
                        <Breadcrumb items={[
                            { label: "Home", href: "/", active: false },
                            { label: "Hotel List", active: true },
                        ]} />
                    </div>
                </div>
            </section>
            <SearchBar />
            <section className="tour-list-page py-100 rel z-1">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-10 rmb-75">
                            <HotelListFilter filters={filterData}  onFilterChange={handleFilterChange}/>
                        </div>
                        <div className="col-lg-9">
                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                hotels.map((hotel) => (
                                    <Hotel
                                        key={hotel.id}
                                        image={hotel.images?.[0]?.url || '/assets/images/default-hotel.jpg'}
                                        title={hotel.name}
                                        description={hotel.description}
                                        location={hotel.province}
                                        duration={hotel.duration}
                                        guests={hotel.guests}
                                        price={`${hotel.price_formatted || hotel.price} VNĐ`}
                                        badgeLabel={hotel.badge}
                                        badgeClass={hotel.badgeClass}
                                        rating={hotel.rating}
                                        detailsUrl={`/hotel/${hotel.id}`}
                                    />
                                )))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HotelList