import React from 'react';
import styles from './HotelReviewsList.module.css';
const mockReviews = [
    {
        id: 1,
        user: "Nguyễn Văn An",
        rating: 5,
        comment: "Khách sạn tuyệt vời! Phòng ốc sạch sẽ, view đẹp, nhân viên nhiệt tình. Bữa sáng đa dạng và ngon miệng. Chắc chắn sẽ quay lại trong thời gian tới.",
        date: "15/12/2024",
        avatar_url: "/assets/images/users/user1.jpg"
    },
    {
        id: 2,
        user: "Trần Thị Bích",
        rating: 4,
        comment: "Trải nghiệm tốt overall. Vị trí thuận tiện, dễ di chuyển. Phòng rộng rãi và sạch sẽ. Chỉ hơi ồn một chút vào buổi tối do gần đường chính.",
        date: "12/12/2024",
        avatar_url: "/assets/images/users/user2.jpg"
    },
    {
        id: 3,
        user: "Lê Minh Cường",
        rating: 5,
        comment: "Dịch vụ xuất sắc! Nhân viên rất chuyên nghiệp và thân thiện. Hồ bơi rất đẹp, phòng gym đầy đủ thiết bị. Rất đáng tiền!",
        date: "10/12/2024",
        avatar_url: "/assets/images/users/user3.jpg"
    },
    {
        id: 4,
        user: "Phạm Thu Hà",
        rating: 3,
        comment: "Khách sạn ổn, giá cả phải chăng. Tuy nhiên wifi hơi chậm và phòng tắm cần được vệ sinh kỹ hơn. Phục vụ ăn uống khá tốt.",
        date: "08/12/2024",
        avatar_url: "/assets/images/users/user4.jpg"
    },
    {
        id: 5,
        user: "Hoàng Văn Dũng",
        rating: 5,
        comment: "Tuyệt vời từ A đến Z! Từ check-in đến check-out đều hoàn hảo. View từ phòng rất đẹp, đặc biệt vào buổi sáng. Rất recommend cho các cặp đôi.",
        date: "05/12/2024",
        avatar_url: "/assets/images/users/user5.jpg"
    },
    {
        id: 6,
        user: "Đặng Thùy Linh",
        rating: 4,
        comment: "Khách sạn đẹp, thiết kế hiện đại. Nhân viên lễ tân rất dễ thương. Vị trí gần trung tâm, đi bộ ra các điểm ăn uống rất tiện.",
        date: "01/12/2024",
        avatar_url: "/assets/images/users/user6.jpg"
    }
];
const HotelReviewsList = ({ reviews, loading }) => {
    const {
        reviewsList,
        loadingText,
        emptyState,
        reviewItem,
        reviewHeader,
        userAvatar,
        userInfo,
        userName,
        reviewDate,
        reviewRating,
        ratingStars,
        reviewComment,
        reviewICard
    } = styles;
    const displayReviews = reviews && reviews.length > 0 ? reviews : mockReviews;
    if (loading) {
        return (
            <div className={reviewsList}>
                <div className={loadingText}>Đang tải đánh giá...</div>
            </div>
        );
    }

    return (
        <div className={reviewsList}>
            {displayReviews.length > 0 ? (
                <>
                    <div className="reviews-container">
                        {displayReviews.map((displayReviews) => (
                            <div className={reviewICard} key={displayReviews.id}>
                                <div  className={reviewItem}>
                                    <div className={reviewHeader}>
                                        <img
                                            src={displayReviews.avatar_url}
                                            alt={displayReviews.user}
                                            className={userAvatar}
                                        />
                                        <div className={userInfo}>
                                            <div className={userName}>{displayReviews.user}</div>
                                            <div className={reviewDate}>{displayReviews.date}</div>
                                        </div>
                                    </div>

                                    <div className={reviewRating}>
                                        <span className={ratingStars}>
                                            {'★'.repeat(displayReviews.rating)}{'☆'.repeat(5 - displayReviews.rating)}
                                        </span>
                                    </div>

                                    <p className={reviewComment}>
                                        {displayReviews.comment}
                                    </p>
                                </div>
                                <hr className="mb-30" />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className={emptyState}>
                    <h4>Chưa có đánh giá nào</h4>
                    <p>Hãy là người đầu tiên đánh giá khách sạn này!</p>
                </div>
            )}
        </div>
    );
};

export default HotelReviewsList;