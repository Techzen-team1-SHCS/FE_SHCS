import { useState, useEffect } from 'react';
import { hotelService } from '../../services/hotelService';
import SearchBar from '../../components/SearchBar/SearchBar'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb'
import Hotel from '../../components/Hotel/Hotel';

function HotelList() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadHotels();
    }, []);
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