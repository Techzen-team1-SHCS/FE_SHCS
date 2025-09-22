import React from 'react'
import HeroSection from '../components/HeroSection'
import PopularDestinations from '../components/PopularDestinations'
import Destinations from '../components/Destinations'
import AboutUs from '../components/AboutUs'
import Features from '../components/Features'
import HotelSection from '../components/HotelSection'

const Home = () => {
    return (
        <div className="page-wrapper">
            <HeroSection />
            <Destinations />
            <AboutUs/>
            <PopularDestinations />
            <Features/>
            <HotelSection/>
        </div>
    )
}

export default Home