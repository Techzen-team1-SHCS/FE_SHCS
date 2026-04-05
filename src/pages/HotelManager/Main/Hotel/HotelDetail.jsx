import { useParams } from "react-router-dom";
import { useState } from "react";
import styles from "./HotelDetail.module.css";
import { useHotelDetail } from "../../hooks/useHotelDetail";

import Header from "../../Components/HotelDetail/header";
import Gallery from "../../Components/HotelDetail/Gallery";
import Services from "../../Components/HotelDetail/Services";
import Rooms from "../../Components/HotelDetail/Rooms";
import Reviews from "../../Components/HotelDetail/Reviews";

export default function HotelDetail() {
  const { id } = useParams(); // Lấy hotelId từ URL params
  const { hotel, isLoading, isError, error, updateHotelMutation } = useHotelDetail(id); // Truyền id vào hook

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    province: '',
    description: ''
  });

  const handleEditClick = () => {
    setEditData({
      name: hotel.name || '',
      province: hotel.province || '',
      description: hotel.description || ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Merge current hotel data with edited data
    const dataToSend = {
      name: editData.name,
      province: editData.province,
      description: editData.description,
      price: hotel.price || 0,
      name_nearby_place: hotel.name_nearby_place || '',
      hotel_class: `${hotel.hotel_class || 1}.0`  // Send as decimal string
    };

    updateHotelMutation.mutate(
      { id, data: dataToSend },
      {
        onSuccess: () => {
          setIsEditing(false);
          alert('Cập nhật thành công!');
        }
      }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isLoading) {
    return <div className={styles.container}>Đang tải dữ liệu...</div>;
  }

  if (isError) {
    return <div className={styles.container}>Lỗi: {error?.message}</div>;
  }

  if (!hotel) {
    return <div className={styles.container}>Không tìm thấy khách sạn</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.editSection}>
        {!isEditing ? (
          <button className={styles.editButton} onClick={handleEditClick}>
            Chỉnh sửa thông tin
          </button>
        ) : (
          <div className={styles.buttonGroup}>
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={updateHotelMutation.isLoading}
            >
              {updateHotelMutation.isLoading ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button className={styles.cancelButton} onClick={handleCancel}>
              Hủy
            </button>
          </div>
        )}
      </div>
      <Header
        hotel={hotel}
        isEditing={isEditing}
        editData={editData}
        onEditDataChange={setEditData}
      />



      {isEditing ? (
        <div className={styles.editField}>
          <label className={styles.editLabel}>Mô tả khách sạn</label>
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className={styles.descriptionTextarea}
            rows="6"
            placeholder="Nhập mô tả chi tiết về khách sạn"
          />
        </div>
      ) : (
        <p className={styles.description}>{hotel.description}</p>
      )}

      {/* Additional Information Section */}
      <div className={styles.infoSection}>
        <h3 className={styles.sectionTitle}>Thông tin bổ sung</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Trạng thái:</span>
            <span className={styles.infoValue}>{hotel.status || 'N/A'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Giá từ:</span>
            <span className={styles.infoValue}>{hotel.price ? `${hotel.price} VNĐ` : 'N/A'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Địa điểm gần:</span>
            <span className={styles.infoValue}>{hotel.name_nearby_place || 'N/A'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Hạng sao:</span>
            <span className={styles.infoValue}>{hotel.hotel_class || 'N/A'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Ngày tạo:</span>
            <span className={styles.infoValue}>
              {hotel.created_at ? new Date(hotel.created_at).toLocaleDateString('vi-VN') : 'N/A'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Ngày cập nhật:</span>
            <span className={styles.infoValue}>
              {hotel.updated_at ? new Date(hotel.updated_at).toLocaleDateString('vi-VN') : 'N/A'}
            </span>
          </div>
        </div>
        {hotel.text && (
          <div className={styles.textSection}>
            <h4 className={styles.subTitle}>Mô tả chi tiết</h4>
            <p className={styles.textContent}>{hotel.text}</p>
          </div>
        )}
        {hotel.amenities && (
          <div className={styles.amenitiesSection}>
            <h4 className={styles.subTitle}>Tiện nghi</h4>
            <ul className={styles.amenitiesList}>
              {JSON.parse(hotel.amenities).map((amenity, index) => (
                <li key={index} className={styles.amenityItem}>{amenity}</li>
              ))}
            </ul>
          </div>
        )}
        {hotel.styles && hotel.styles.length > 0 && (
          <div className={styles.stylesSection}>
            <h4 className={styles.subTitle}>Phong cách</h4>
            <ul className={styles.stylesList}>
              {hotel.styles.map((style, index) => (
                <li key={index} className={styles.styleItem}>{style}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Gallery images={hotel.images} />

      <h3 className={styles.sectionTitle}>Room Services</h3>
      <Services services={hotel.services} />

      <h3 className={styles.sectionTitle}>Type Room</h3>
      <Rooms rooms={hotel.rooms} />

      <Reviews reviews={hotel.reviews} />
    </div>
  );
}