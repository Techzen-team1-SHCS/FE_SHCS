import { useState } from "react";
import { createPreviewImages, removeImageByIndex } from "../../Helpers/RegisterHotel/Step3";

export function useHotelInfoForm(initial = {}, onSubmit) {

  const [hotelName, setHotelName] = useState(initial.name || "");
  const [description, setDescription] = useState(initial.description || "");
  const [detailInfo, setDetailInfo] = useState(initial.detailInfo || "");
  const [price, setPrice] = useState(initial.price || "");
  const [hotelClass, setHotelClass] = useState(initial.hotel_class || "");
  const [nameNearbyPlace, setNameNearbyPlace] = useState(initial.name_nearby_place || "");
  const [images, setImages] = useState(initial.images || []);

  const handleUpload = (files) => {
    const newImages = createPreviewImages(files);
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => removeImageByIndex(prev, index));
  };
  const handleFinish = async () => {
    if (typeof onSubmit !== "function") {
      console.error("useHotelInfoForm: onSubmit is not a function");
      return;
    }

    const parsedPrice = parseFloat(price);
    const hotelClassNumber = parseFloat(hotelClass);

    const normalizedHotelClass = Number.isFinite(hotelClassNumber)
      ? hotelClassNumber.toFixed(1)
      : hotelClass;

    await onSubmit({
      name: hotelName,
      description,
      detail_info: detailInfo,
      price: Number.isFinite(parsedPrice) ? parsedPrice : price,
      hotel_class: normalizedHotelClass,
      name_nearby_place: nameNearbyPlace,
      images
    });
  };
  return {
    hotelName,
    description,
    detailInfo,
    price,
    hotelClass,
    nameNearbyPlace,
    images,
    setImages,
    setHotelName,
    setDescription,
    setDetailInfo,
    setPrice,
    setHotelClass,
    setNameNearbyPlace,
    handleUpload,
    removeImage,
    handleFinish,
  };
}