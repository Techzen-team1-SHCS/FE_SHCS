import styles from "./LoadingSkeleton.module.css";

const {
    cardSkeleton,
    hotelInfoSkeleton,
    cardBodySkeleton,
    contentSkeleton,
    lineXLarge,
    lineLarge,
    lineMedium,
    statusSkeleton,
    buttonGroupSkeleton,
    buttonSkeleton,
    imageSkeleton
} = styles;

export const BookingCardSkeleton = () => {
    return (
        <div className={cardSkeleton}>
            <div className={hotelInfoSkeleton}>
                <div className={cardBodySkeleton}>
                    <div className={contentSkeleton}>
                        <div className={lineXLarge}></div>
                        <div className={lineLarge}></div>
                        <div className={lineMedium}></div>
                        <div className={lineMedium}></div>
                        <div className={lineLarge}></div>
                        <div className={statusSkeleton}></div>
                        <div className={buttonGroupSkeleton}>
                            <div className={buttonGroupSkeleton}>
                                <div className={buttonSkeleton}></div>
                                <div className={buttonSkeleton}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={imageSkeleton}></div>
            </div>
        </div>
    );
};