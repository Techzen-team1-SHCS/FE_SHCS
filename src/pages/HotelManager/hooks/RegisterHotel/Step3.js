import { useState } from "react";
import { createPreviewImages, removeImageByIndex } from "../../Helpers/RegisterHotel/Step3";

export function useHotelInfoForm() {

  const [hotelName, setHotelName] = useState("");
  const [description, setDescription] = useState("");
  const [detailInfo, setDetailInfo] = useState("");
  const [images, setImages] = useState([]);

  const handleUpload = (files) => {
    const newImages = createPreviewImages(files);
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => removeImageByIndex(prev, index));
  };

  const handleFinish = () => {
    const data = {
      hotelName,
      description,
      detailInfo,
      images,
    };

    console.log(data);
  };

  return {
    hotelName,
    description,
    detailInfo,
    images,
    setHotelName,
    setDescription,
    setDetailInfo,
    handleUpload,
    removeImage,
    handleFinish,
  };
}