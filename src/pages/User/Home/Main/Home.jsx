import { useContext, useState } from 'react'
import HeroSection from '../Component/HeroSection/HeroSection'
import PopularDestinations from '../Component/PopularDestination/PopularDestinations'
import AboutUs from '../Component/AboutUs/AboutUs'
import Features from '../Component/Features/Features'
import HotelSection from '../Component/HotelSection/HotelSection'
import HotelRecommendationSlider from '../Component/HotelRecommendationSlider/HotelRecommendationSlider'
import Discount from '../Component/Discount/Discount'
import { AuthContext } from '../../../../contexts/AuthContext'
import PopUpButton from '../../../../components/PopupButton/PopUpButton'

const Home = () => {
    const { user } = useContext(AuthContext);
    const [isAuthVisible, setIsAuthVisible] = useState(false);
    const [ setIsLogin] = useState(false);
    return (
        <div className="page-wrapper">
            <HeroSection />
            <Discount />
            <HotelRecommendationSlider />
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