import React, { useContext, useRef, useState } from 'react';
import styles from './PersonalDetails.module.css';
import { AuthContext } from '../../contexts/AuthContext';
const PersonalDetail = ({ user }) => {
  const { updateUser } = useContext(AuthContext);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.avatar_url || '');
  const fileInputRef = useRef(null);
   const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh!');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh không được vượt quá 5MB!');
        return;
      }

      setSelectedImage(file);
      
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);

      // GỌI API UPLOAD
      uploadImageToServer(file);
    }
  };
   const handleChoosePhotoClick = () => {
    fileInputRef.current?.click();
  };
  const uploadImageToServer = async (file) => {
    setIsUploading(true); 
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      // THAY THẾ BẰNG API THỰC TẾ CỦA BẠN
      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // CẬP NHẬT USER CONTEXT
        const updatedUser = { ...user, avatar_url: data.avatarUrl };
        updateUser(updatedUser);
        
        alert('Cập nhật ảnh đại diện thành công!');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Lỗi upload ảnh:', error);
      alert('Có lỗi xảy ra khi upload ảnh!');
      
      // Reset nếu upload thất bại
      setSelectedImage(null);
      setPreviewUrl(user?.avatar_url || '');
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>Personal detail</div>
      <hr></hr>
      <div className='d-flex'>
        <div className={styles.titleColumn}>
          <div className={styles.titleItem}>User name</div>
          <div className={styles.titleItem}>Email</div>
          <div className={styles.titleItem}>Phone number</div>
          <div className={styles.titleItem}>Gender</div>
          <div className={styles.titleItem}>Date of birth</div>
          <div className={styles.titleItem}>Province/City</div>
        </div>
        <div className={styles.infoColumn}>
          <div className={styles.infoItems}>{user?.name}</div>
          <div className={styles.infoItems}>{user?.gmail}</div>
          <div className={styles.infoItems}>{user?.phone}</div>
          <div className={styles.infoItems}>{user?.gender}</div>
          <div className={styles.infoItems}>{user?.date}</div>
          <div className={styles.infoItems}>{user?.province}</div>
        </div>
        {/* <div className={styles.buttons}>
          
        </div> */}
        <hr style={{ width: "1px", height: '300px' }} />
        <div className={styles.avatar}>
          <img
            src={previewUrl || 'assets/images/avatar/avatar_default.png'}
            alt="avatar"
            className="rounded-circle"
            width={120}
            height={120}
          />
           <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
             disabled={isUploading}
          />
          <button className={styles.avatarBtn} onClick={handleChoosePhotoClick} disabled={isUploading}>
            
            {isUploading ? 'Uploading...' : 'Choose photo'}
          </button>
          {selectedImage && (
            <div className={styles.fileInfo}>
              <small>Đã chọn: {selectedImage.name}</small>
              {isUploading && <small>Đang upload...</small>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalDetail
