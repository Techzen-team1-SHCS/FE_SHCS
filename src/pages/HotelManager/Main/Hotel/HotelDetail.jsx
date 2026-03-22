import styles from "./HotelDetail.module.css";
import { useHotelDetail } from "../../hooks/useHotelDetail";

import Header from "../../Components/HotelDetail/header";
import Gallery from "../../Components/HotelDetail/Gallery";
import Services from "../../Components/HotelDetail/Services";
import Rooms from "../../Components/HotelDetail/Rooms";
import Reviews from "../../Components/HotelDetail/Reviews";

export default function HotelDetail() {
  const { hotel } = useHotelDetail();
  
  if (!hotel) {
    return <div className={styles.container}>Đang tải dữ liệu...</div>;
  }

  return (
    <div className={styles.container}>
      <Header hotel={hotel} />

      <Gallery images={hotel.images} />

      <p className={styles.description}>{hotel.description}</p>

      <h3 className={styles.sectionTitle}>Room Services</h3>
      <Services services={hotel.services} />

      <h3 className={styles.sectionTitle}>Type Room</h3>
      <Rooms rooms={hotel.rooms} />

      <Reviews reviews={hotel.reviews} />
    </div>
  );
}
