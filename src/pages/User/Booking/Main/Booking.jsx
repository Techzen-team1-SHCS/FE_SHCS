import { useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../Booking.module.css";

import Loader from "../../../../components/Loading/Loader";
import NavigationTabs from "../../../../components/NavigationTabs/NavigationTabs";

import { useBookingData } from "../Hooks/useBookingData";

import BookingBanner from ".././Component/BookingBanner/BookingBanner";
import BookingDetailCard from ".././Component/BookingDetailCard/BookingDetailCard";
import PriceSummaryCard from ".././Component/PriceSummaryCard/PriceSummaryCard";
import CancelPolicyCard from "../Component/CancelPolicyCard/CancelPolicyCard";
import BookingInfo from "../Component/BookingInfo/BookingInfo";

const Booking = () => {
    const { bookingId } = useParams();

    const { hotelData, loading, bookingPrice, setBookingPrice } =
        useBookingData(bookingId);

    const [currentStep, setCurrentStep] = useState(1);

    const handlePriceChange = (priceData) => {
        setBookingPrice({
            ...priceData,
        });
    };

    const handleBookingSubmit = () => {
        setCurrentStep(2);
    };

    const handleBackToForm = () => {
        setCurrentStep(1);
    };

    if (loading) {
        return (
            <div className="page-wrapper">
                <div className={styles.loading}>
                    <Loader />
                </div>
            </div>
        );
    }

    const displayPrice =
        bookingPrice.finalPrice || bookingPrice.originalPrice;
    const hasDiscount = bookingPrice.discountAmount > 0;

    return (
        <div className="page-wrapper">

            <BookingBanner image={hotelData?.room?.hotel?.images?.[0]?.url} />

            <NavigationTabs hotelId={bookingId} currentStep={currentStep} />

            <div className={styles.bookingContainer}>

                <div className={styles.bookingLeft}>

                    <img
                        className={styles.bookingHotelImage}
                        src={hotelData?.room?.hotel?.images?.[1]?.url}
                        alt=""
                    />

                    <div className={styles.bookingDatePicker}>

                        <BookingDetailCard hotel={hotelData} />

                        <PriceSummaryCard
                            hotel={hotelData}
                            bookingPrice={bookingPrice}
                            hasDiscount={hasDiscount}
                            displayPrice={displayPrice}
                        />

                        <CancelPolicyCard hotel={hotelData} />

                    </div>

                </div>

                <div className={styles.bookingRight}>
                    <BookingInfo
                        hotelData={hotelData}
                        onBookingSubmit={handleBookingSubmit}
                        currentStep={currentStep}
                        onBackToForm={handleBackToForm}
                        onPriceChange={handlePriceChange}
                    />
                </div>

            </div>
        </div>
    );
};

export default Booking;