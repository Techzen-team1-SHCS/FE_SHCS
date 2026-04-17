import React, { useState } from "react";
import styles from "../../style.module.css";
import HotelBooking from "../HotelBooking/HotelBooking";

const GalleryBookingSection = ({
  galleryImages = [],
  hotelId,
  roomArray,
  handleBookNowFromCalendar
}) => {

  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const mainImage = galleryImages?.[0]?.url || "/default-hotel.jpg";
  const price = roomArray?.[0]?.price || 0;

  return (
    <div className={styles.galleryBookingGrid}>

      {/* Gallery */}
      <div>

        <div className={styles.galleryGrid}>

          <div className={styles.mainImage}>
            <img src={mainImage} alt="Main view" />
          </div>

          {galleryImages.slice(1, 3).map((img, index) => (
            <div key={index} className={styles.smallImage}>
              <img src={img.url} alt={`Gallery ${index + 1}`} />
            </div>
          ))}

        </div>

        {galleryImages.length > 3 && (
          <button
            onClick={() => setShowAllPhotos(!showAllPhotos)}
            className={styles.btnTogglePhotos}
          >
            <i className={`fas fa-${showAllPhotos ? "minus" : "plus"}`}></i>

            {showAllPhotos
              ? "Ẩn bớt ảnh"
              : `Xem tất cả ${galleryImages.length} ảnh`}
          </button>
        )}

      </div>

      {/* Booking Widget */}
      <div className={styles.bookingWidget}>

        <h3
          style={{
            fontSize: "24px",
            fontWeight: "600",
            marginBottom: "24px",
            color: "#1a1a1a"
          }}
        >
          Đặt phòng ngay
        </h3>

        <HotelBooking
          onBook={handleBookNowFromCalendar}
          hotelId={hotelId}
          price={price}
          style={{ border: "none" }}
        />

      </div>

    </div>
  );
};

export default React.memo(GalleryBookingSection);