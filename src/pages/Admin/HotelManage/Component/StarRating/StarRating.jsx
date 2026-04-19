const StarRating = ({ value }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} style={{ color: i <= value ? '#ffc107' : '#e4e5e9' }}>
                ★
            </span>
        );
    }

    return <>{stars}</>;
};

export default StarRating;