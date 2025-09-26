import React from 'react'
import SearchBar from '../components/SearchBar'
import Breadcrumb from '../components/Breadcrumb'
import Hotel from '../components/Hotel';

function HotelList() {
    const tours = [
        {
            id: 1,
            name: "Bay Cruise by Boat in Bali, Indonesia",
            location: "Bali, Indonesia",
            image: "/assets/images/destinations/tour-list1.jpg",
            price: "$58.00",
            badge: "Featured",
            badgeClass: "bgc-pink",
            description: "Bali, Indonesia, is tropical paradise renowned breathtaking beaches, vibrant culture, and lush landscapes",
            duration: "3 days 2 nights",
            guests: "5-8 guest",
            rating:3
        },
        {
            id: 2,
            name: "Buenos Aires, Calafate & Ushuaia",
            location: "Rome, Italy",
            image: "/assets/images/destinations/tour-list2.jpg",
            price: "$105.00",
            badge: "10% Off",
            description: "Bali, Indonesia, is tropical paradise renowned breathtaking beaches, vibrant culture, and lush landscapes",
            duration: "3 days 2 nights",
            guests: "5-8 guest",
            rating:2
        },
        {
            id: 3,
            name: "Camels on desert Morocco, Sahara.",
            location: "Tamnougalt, Morocco",
            image: "/assets/images/destinations/tour-list3.jpg",
            price: "$386.00",
            description: "Bali, Indonesia, is tropical paradise renowned breathtaking beaches, vibrant culture, and lush landscapes",
            duration: "3 days 2 nights",
            guests: "5-8 guest",
            rating:3
        },
        {
            id: 4,
            name: "Venice Grand Canal, Metropolitan Summer",
            location: "City of Venice, Italy",
            image: "/assets/images/destinations/tour-list4.jpg",
            price: "$258.00",
            badge: "Popular",
            badgeClass: "bgc-primary",
            description: "Bali, Indonesia, is tropical paradise renowned breathtaking beaches, vibrant culture, and lush landscapes",
            duration: "3 days 2 nights",
            guests: "5-8 guest",
            rating:5
        }
    ];
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
                            {tours.map((tour) => (
                                <Hotel
                                    key={tour.id}
                                    image={tour.image}
                                    title={tour.name}
                                    description={tour.description}
                                    location={tour.location}
                                    duration={tour.duration}
                                    guests={tour.guests}
                                    price={tour.price}
                                    badgeLabel={tour.badge}
                                    badgeClass={tour.badgeClass}
                                    rating={tour.rating}
                                    detailsUrl={`/tour/${tour.id}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HotelList