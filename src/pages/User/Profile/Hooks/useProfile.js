import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { authService } from "../../../../services/authService";
import { validateImageFile, readImagePreview } from "../Helpers/profileHelpers";
export const useProfile = (user, updateUser) => {
    const [editingField, setEditingField] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        birth: "",
        address: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const [avatar, setAvatar] = useState("assets/images/avatar/avatar_default.png");
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                gender: user.gender || "",
                birth: user.birth || "",
                address: user.address || "",
                password: ""
            });

            setAvatar(
                user.image || user.avatar_url || "assets/images/avatar/avatar_default.png"
            );
        }
    }, [user]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const startEditing = (field) => setEditingField(field);

    const cancelEditing = () => {
        setEditingField(null);
        if (!user) return;

        setFormData({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            gender: user.gender || "",
            birth: user.birth || "",
            address: user.address || "",
            password: ""
        });
    };

    const saveChanges = async (field) => {
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const updateData = {
                [field]: formData[field]
            };

            await authService.updateProfile(user.id, updateData, token);

            const freshUser = await authService.getUserById(user.id);

            updateUser(freshUser);

            localStorage.setItem("user", JSON.stringify(freshUser));

            toast.success(`${field} updated successfully`);

            setEditingField(null);

        } catch (error) {
            toast.error(error?.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };
    // Hàm xử lý chọn file
    const handleFileSelect = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        if (!validateImageFile(file)) return;

        setSelectedFile(file);

        readImagePreview(file, setPreviewUrl, setPreview);
    };
    // Hàm mở modal edit avatar
    const handleEditAvatar = () => {
        setShowAvatarModal(true);
    };

    // Hàm đóng modal
    const closeAvatarModal = () => {
        setShowAvatarModal(false);
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const saveAvatar = async () => {
        if (!selectedFile) {
            toast.error('No image selected');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('avatar', selectedFile);

            await authService.updateProfile(user.id, formData, token);
            const freshUserData = await authService.getUserById(user.id);

            if (!freshUserData) {
                toast.error("Avatar update failed. No user data returned.");
                return;
            }

            if (updateUser) {
                updateUser(freshUserData);
            }

            localStorage.setItem('user', JSON.stringify(freshUserData));
            const newAvatarUrl = freshUserData.image;

            if (newAvatarUrl) {
                setAvatar(newAvatarUrl);
            } else {
                setAvatar('assets/images/avatar/avatar_default.png');
            }

            setPreview('');
            toast.success('Avatar updated successfully');
            closeAvatarModal();

        } catch (error) {
            console.error('❌ Error in avatar update process:', error);
            toast.error(error?.response?.data?.message || 'Error uploading avatar');
        } finally {
            setLoading(false);
        }
    };
    return {
        editingField,
        startEditing,
        cancelEditing,
        saveChanges,
        formData,
        handleInputChange,
        loading,
        setLoading,
        avatar,
        setAvatar,

        showAvatarModal,
        setShowAvatarModal,

        selectedFile,
        setSelectedFile,

        preview,
        setPreview,

        previewUrl,
        setPreviewUrl,

        fileInputRef,
        handleFileSelect,
        handleEditAvatar,
        closeAvatarModal,
        saveAvatar,
        setFormData
    };
};