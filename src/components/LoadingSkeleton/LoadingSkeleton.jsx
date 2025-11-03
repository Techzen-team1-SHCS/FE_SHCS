import React from "react";
import styles from "./LoadingSkeleton.module.css";

const { 
    cardSkeleton, 
    hotelInfoSkeleton, 
    cardBodySkeleton, 
    imageSkeleton, 
    contentSkeleton, 
    lineLarge, 
    lineMedium, 
    lineSmall, 
    statusSkeleton, 
    menuSkeleton, 
    buttonSkeleton 
} = styles;

export const BookingCardSkeleton = () => {
    return (
        <div className={cardSkeleton}>
            <div className={hotelInfoSkeleton}>
                <div className={cardBodySkeleton}>
                    <div className={imageSkeleton}></div>
                    <div className={contentSkeleton}>
                        <div className={lineLarge}></div>
                        <div className={lineMedium}></div>
                        <div className={lineSmall}></div>
                        <div className={statusSkeleton}></div>
                    </div>
                </div>
                <div className={menuSkeleton}></div>
            </div>
            <div className={buttonSkeleton}></div>
        </div>
    );
};