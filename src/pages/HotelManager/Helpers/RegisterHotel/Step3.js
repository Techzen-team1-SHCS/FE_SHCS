export const createPreviewImages = (files) => {
  return Array.from(files).map((file) => ({
    file,
    preview: URL.createObjectURL(file),
  }));
};

export const removeImageByIndex = (images, index) => {
  return images.filter((_, i) => i !== index);
};