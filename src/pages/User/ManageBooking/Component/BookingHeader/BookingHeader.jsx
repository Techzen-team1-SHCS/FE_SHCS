import styles from '../../ManageBooking.module.css';
const BookingHeader = () => {
    return (
        <div className={styles.heroBanner}>
            <img
                src="assets/images/destinations/destination-details4.jpg"
                alt="Booking Header"
                className={styles.heroImage}
            />
            <div className={styles.heroOverlay}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle} style={{ color: 'wheat' }}>Quản lý Đặt phòng</h1>
                    <p className={styles.heroSubtitle}>
                        Theo dõi và quản lý tất cả các đặt phòng của bạn tại một nơi
                    </p>
                </div>
            </div>
        </div>

    )
}

export default BookingHeader
