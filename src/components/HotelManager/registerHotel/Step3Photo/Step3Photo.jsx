import styles from "./Step3HotelInfo.module.css";
import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function Step3HotelInfo({ prevStep }) {

  const [hotelName, setHotelName] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFinish = () => {
    console.log({
      hotelName,
      description,
      preview
    });
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

      <hr className={styles.divider}/>

      {/* Upload photo */}
      <h4 className={styles.sectionTitle}>Upload photo</h4>

      <div className={styles.photoSection}>

        {/* Upload box */}
        <div className={styles.uploadBox}>

          <FaCloudUploadAlt className={styles.uploadIcon}/>

          <p>Drag and drop images here or</p>

          <label className={styles.uploadBtn}>
            Upload photo
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              hidden
            />
          </label>

          <span className={styles.note}>
            JPG, PNG format. Maximum 5 mb
          </span>

        </div>

        {/* Preview */}
        <div className={styles.previewBox}>

          {preview ? (
            <img src={preview} alt="preview"/>
          ) : (
            <span>preview photo</span>
          )}

        </div>

      </div>

      <hr className={styles.divider}/>

      {/* Description */}
      <div className={styles.field}>
        <label>Set Description</label>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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