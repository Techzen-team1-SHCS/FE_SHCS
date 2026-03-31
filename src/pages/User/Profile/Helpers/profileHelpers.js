import { toast } from "react-toastify";

export const validateImageFile = (file) => {

    if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return false;
    }

    if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return false;
    }

    return true;
};


export const readImagePreview = (file, setPreviewUrl, setPreview) => {

    const reader = new FileReader();

    reader.onload = (e) => {
        setPreviewUrl(e.target.result);
    };

    reader.readAsDataURL(file);

    setPreview(URL.createObjectURL(file));
};