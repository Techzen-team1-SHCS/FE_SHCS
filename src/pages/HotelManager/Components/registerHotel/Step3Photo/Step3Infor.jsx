import styles from "./Step3Infor.module.css";
import { FaCloudUploadAlt } from "react-icons/fa";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { EDITOR_CONFIG } from "../../../Constants/RegisterHotel/Step3";
import { useHotelInfoForm } from "../../../hooks/RegisterHotel/Step3";
import { useEffect } from "react";

export default function Step3HotelInfo({ prevStep, data, onSubmit }) {
  const {
    hotelName,
    description,
    detailInfo,
    price,
    hotelClass,
    nameNearbyPlace,
    images,
    setHotelName,
    setDescription,
    setDetailInfo,
    setPrice,
    setHotelClass,
    setNameNearbyPlace,
    handleUpload,
    removeImage,
    setImages,
    handleFinish
  } = useHotelInfoForm(data, onSubmit);
  // lần đầu set data nếu có
  useEffect(() => {
    if (data?.name) setHotelName(data.name);
    if (data?.description) setDescription(data.description);
    if (data?.detail_info) setDetailInfo(data.detail_info);
    if (data?.price) setPrice(data.price);
    if (data?.hotel_class) setHotelClass(data.hotel_class);
    if (data?.name_nearby_place) setNameNearbyPlace(data.name_nearby_place);
    if (data?.images) setImages(data.images);
  }, [data, setHotelName, setDescription, setDetailInfo, setPrice, setHotelClass, setNameNearbyPlace, setImages]);
  const handleDrop = (e) => {
    e.preventDefault();
    handleUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.container}>

      <h2 className={styles.title}>
        Hotel photo and Short Description
      </h2>

      {/* Hotel name */}
      <div className={styles.field}>
        <label>Hotel name</label>

        <input
          type="text"
          placeholder="Nhập tên khách sạn của bạn (VD: Travelwise Hotel)"
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label>Price (VND)</label>
        <input
          type="number"
          min="0"
          value={price}
          placeholder="Nhập giá phòng"
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label>Class (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={hotelClass}
          placeholder="Ví dụ: 4.5"
          onChange={(e) => setHotelClass(e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label>Nearby place</label>
        <input
          type="text"
          value={nameNearbyPlace}
          placeholder="Các địa điểm nổi tiếng xung quanh (VD: Hồ Gươm, Chùa Cầu)"
          onChange={(e) => setNameNearbyPlace(e.target.value)}
        />
      </div>

      <hr className={styles.divider} />

      {/* Upload photo */}
      <h4 className={styles.sectionTitle}>Upload photo</h4>

      <div className={styles.photoSection}>

        <div
          className={styles.uploadBox}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <FaCloudUploadAlt className={styles.uploadIcon} />

          <p>Drag and drop images here or</p>

          <label className={styles.uploadBtn}>
            Upload photo

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleUpload(e.target.files)}
              hidden
            />
          </label>

          <span className={styles.note}>
            JPG, PNG format. Maximum 5 mb
          </span>
        </div>

        {/* Preview */}
        <div className={styles.previewBox}>

          {images.length === 0 && (
            <span className={styles.previewPlaceholder}>
              preview photo
            </span>
          )}

          {images.map((img, index) => (
            <div key={index} className={styles.imageItem}>

              <img src={img.preview} alt="preview" />

              <button
                className={styles.removeBtn}
                onClick={() => removeImage(index)}
              >
                ✕
              </button>

            </div>
          ))}

        </div>

      </div>

      <hr className={styles.divider} />

      {/* Description */}
      <div className={styles.field}>
        <label>Set Description</label>

        <CKEditor
          editor={ClassicEditor}
          config={EDITOR_CONFIG}
          data={description}
          onChange={(event, editor) => {
            setDescription(editor.getData());
          }}
        />
      </div>

      <hr className={styles.divider} />

      {/* Detailed information */}
      <div className={styles.field}>
        <label>Set Detailed Information</label>

        <CKEditor
          editor={ClassicEditor}
          config={EDITOR_CONFIG}
          data={detailInfo}
          onChange={(event, editor) => {
            setDetailInfo(editor.getData());
          }}
        />
      </div>

      {/* Buttons */}
      <div className={styles.buttons}>

        <button
          className={styles.backBtn}
          onClick={prevStep}
        >
          ‹
        </button>

        <button
          className={styles.finishBtn}
          onClick={handleFinish}
        >
          Finish
        </button>

      </div>

    </div>
  );
}