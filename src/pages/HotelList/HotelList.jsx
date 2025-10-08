import { useState, useEffect } from 'react';
import { hotelService } from '../../services/hotelService';
import SearchBar from '../../components/SearchBar/SearchBar'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import Hotel from '../../components/Hotel/Hotel';
import ReviewFilter from '../../components/ReviewFilter/ReviewFilter';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';

function HotelList() {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRating, setSelectedRating] = useState(5);
    useEffect(() => {
        loadHotels();
    }, []);
    useEffect(() => {
        if (hotels.length > 0) {
            handleFilterByRating(selectedRating); // tự filter khi load xong
        }
    }, [hotels, selectedRating]);

    const loadHotels = async () => {
        try {
            const response = await hotelService.searchHotels();
            if (response.status === 200) {
                setHotels(response.content.data || []);
            }
        } catch (error) {
            console.error('Error loading hotels:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleFilterByRating = (rating) => {
        setSelectedRating(rating);
        const filtered = hotels.filter((hotel) => hotel.rating >= rating);
        setFilteredHotels(filtered);
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
                            Hotel List View
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
                            <div className="shop-sidebar mb-30">
                                <ReviewFilter onSelect={handleFilterByRating} selectedRating={selectedRating} />
                                <CategoryFilter />
                            </div>
                        </div>
                        <div className="col-lg-9">
                            <div className='shop-shorter rel z-3 mb-20'>
                                <div className="sort-text mb-15 me-4 me-xl-auto">
                                    0 Tours found
                                </div>
                                <div className="sort-text mb-15 me-4">
                                    Sort By
                                </div>
                                <select>
                                    <option value="default" selected="">Short By</option>
                                    <option value="new">Newness</option>
                                    <option value="old">Oldest</option>
                                    <option value="hight-to-low">High To Low</option>
                                    <option value="low-to-high">Low To High</option>
                                </select>
                            </div>

                            {loading ? (
                                <div>Loading...</div>
                            ) : filteredHotels.length > 0 ? (
                                filteredHotels.map((hotel) => (
                                    <Hotel
                                        key={hotel.id}
                                        image={
                                            hotel.images?.[0]?.url ||
                                            "/assets/images/default-hotel.jpg"
                                        }
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
                                ))
                            ) : (
                                <div>Không có khách sạn phù hợp.</div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HotelList