import React from 'react'
import HeroSection from '../../components/HeroSection/HeroSection'
import PopularDestinations from '../../components/PopularDestination/PopularDestinations'
import Destinations from '../../components/Destination/Destinations'
import AboutUs from '../../components/AboutUs/AboutUs'
import Features from '../../components/Features/Features'
import HotelSection from '../../components/HotelSection/HotelSection'
import HotelRecommendationSlider from '../../components/HotelRecommendationSlider/HotelRecommendationSlider'
import Discount from '../../components/Discount/Discount'

const Home = () => {
    return (
        <div className="page-wrapper">
            <HeroSection />
            <Discount />
            <HotelRecommendationSlider/>
            <AboutUs />
            <PopularDestinations />
            <Features />
            <HotelSection />
        </div>
    )
}

export default Home