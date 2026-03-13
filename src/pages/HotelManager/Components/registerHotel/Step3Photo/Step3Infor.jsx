import styles from "./Step3Infor.module.css";
import { FaCloudUploadAlt } from "react-icons/fa";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { EDITOR_CONFIG } from "../../../Constants/RegisterHotel/Step3";
import { useHotelInfoForm } from "../../../hooks/RegisterHotel/Step3";

export default function Step3HotelInfo({ prevStep }) {
  const {
    hotelName,
    description,
    detailInfo,
    images,
    setHotelName,
    setDescription,
    setDetailInfo,
    handleUpload,
    removeImage,
    handleFinish
  } = useHotelInfoForm();

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
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
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