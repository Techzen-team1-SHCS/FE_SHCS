import React, { useContext, useState } from 'react'
import HeroSection from '../../components/HeroSection/HeroSection'
import PopularDestinations from '../../components/PopularDestination/PopularDestinations'
import Destinations from '../../components/Destination/Destinations'
import AboutUs from '../../components/AboutUs/AboutUs'
import Features from '../../components/Features/Features'
import HotelSection from '../../components/HotelSection/HotelSection'
import HotelRecommendationSlider from '../../components/HotelRecommendationSlider/HotelRecommendationSlider'
import Discount from '../../components/Discount/Discount'
import { AuthContext } from '../../contexts/AuthContext'
import PopUpButton from '../../components/PopupButton/PopUpButton'

const Home = () => {
    const { user, logout } = useContext(AuthContext);
    const [isAuthVisible, setIsAuthVisible] = useState(false);
    const [isLogin, setIsLogin] = useState('');
    return (
        <div className="page-wrapper">
            <HeroSection />
            <Discount />
            <HotelRecommendationSlider/>
            <AboutUs />
            <PopularDestinations />
            <Features />
            <HotelSection />
            {!user && !isAuthVisible && <PopUpButton onLoginClick={() => {
                setIsLogin(true);
                setIsAuthVisible(true);
            }} />}
            
        </div>
    )
}

export default Home