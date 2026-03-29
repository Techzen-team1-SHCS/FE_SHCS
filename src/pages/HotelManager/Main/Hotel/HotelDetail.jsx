import { useParams } from "react-router-dom";
import styles from "./HotelDetail.module.css";
import { useHotelDetail } from "../../hooks/useHotelDetail";
import Header from "../../Components/HotelDetail/header";
import Gallery from "../../Components/HotelDetail/Gallery";
import Services from "../../Components/HotelDetail/Services";
import Rooms from "../../Components/HotelDetail/Rooms";
import Reviews from "../../Components/HotelDetail/Reviews";
import { useHotelEdit } from "../../hooks/useHotelEdit";
import { HOTEL_CLASS_OPTIONS } from "../../Constants/Hotel/hotelConstants";
import { getImageUrl } from "../../Helpers/HotelHelpers";
export default function HotelDetail() {
  const { id } = useParams(); // Lấy hotelId từ URL params
  const { hotel, isLoading, isError, error, updateHotelMutation } = useHotelDetail(id); // Truyền id vào hook
  const {
    isEditing,
    editData,
    setEditData,
    selectedImages,
    setSelectedImages,
    currentImages,
    startEdit,
    cancelEdit,
    removeImage,
    save
  } = useHotelEdit(hotel, id, updateHotelMutation);



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
          <button className={styles.editButton} onClick={startEdit}>
            Chỉnh sửa thông tin
          </button>
        ) : (
          <div className={styles.buttonGroup}>
            <button
              className={styles.saveButton}
              onClick={save}
              disabled={updateHotelMutation.isLoading}
            >
              {updateHotelMutation.isLoading ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button className={styles.cancelButton} onClick={cancelEdit}>
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
            {isEditing ? (
              <input
                type="number"
                className={styles.editInput}
                value={editData.price || ''}
                onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                min="0"
                step="1000"
              />
            ) : (
              <span className={styles.infoValue}>{hotel.price ? `${hotel.price} VNĐ` : 'N/A'}</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Địa điểm gần:</span>
            {isEditing ? (
              <input
                type="text"
                className={styles.editInput}
                value={editData.name_nearby_place || ''}
                onChange={(e) => setEditData({ ...editData, name_nearby_place: e.target.value })}
              />
            ) : (
              <span className={styles.infoValue}>{hotel.name_nearby_place || 'N/A'}</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Hạng sao:</span>
            {isEditing ? (
              <select
                className={styles.editInput}
                value={editData.hotel_class || ''}
                onChange={(e) => setEditData({ ...editData, hotel_class: e.target.value })}
              >
                <option value="">Chọn hạng sao</option>
                {HOTEL_CLASS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <span className={styles.infoValue}>{hotel.hotel_class || 'N/A'}</span>
            )}
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

      <Gallery images={isEditing ? currentImages : hotel.images} />
      {isEditing && (
        <div className={styles.editField}>
          <label className={styles.editLabel}>Cập nhật ảnh</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              const files = Array.from(event.target.files || []);
              setSelectedImages(files);
            }}
            className={styles.editInput}
          />
          {selectedImages.length > 0 && (
            <div className={styles.previewContainer}>
              {selectedImages.map((file, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className={styles.previewImage}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {isEditing && (
        <div className={styles.imageManagementSection}>
          <h4 className={styles.subTitle}>Ảnh hiện tại</h4>
          {currentImages && currentImages.length > 0 ? (
            <div className={styles.currentImagesGrid}>
              {currentImages.map((img, idx) => (
                <div key={idx} className={styles.currentImageCard}>
                  <img src={getImageUrl(img)} alt={`hotel-${idx}`} className={styles.currentImage} />
                  <button
                    type="button"
                    className={styles.deleteImageButton}
                    onClick={() => removeImage(idx)}
                  >
                    Xóa ảnh
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>Không còn ảnh nào.</p>
          )}
        </div>
      )}

      <h3 className={styles.sectionTitle}>Room Services</h3>
      <Services services={hotel.services} />

      <h3 className={styles.sectionTitle}>Type Room</h3>
      <Rooms rooms={hotel.rooms} />

      <Reviews reviews={hotel.reviews} />
    </div>
  );
}