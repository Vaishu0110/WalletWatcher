import React, {useState, useRef} from "react";
import Input from "../Inputs/Input";
import EmojiPickerPopup from "../EmojiPickerPopup";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from "../../utils/apiPaths";
import toast from "react-hot-toast";
import CharAvatar from "../Cards/CharAvatar";
import {LuPencil} from "react-icons/lu";

const EditProfileForm = ({user, onSave}) => {
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        profileImageUrl: user?.profileImageUrl || "",
    });

    const handleChange = (key, value) => {
        setFormData((prev) => ({
            ...prev, 
            [key]: value
        }));
    };

    const handleChooseFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append("image", file);

        try {
            setLoading(true);

            const response = await axiosInstance.post(
                API_PATHS.IMAGE.UPLOAD_IMAGE,
                uploadFormData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const uploadedImageUrl = 
                response.data?.imageUrl ||
                response.data?.image ||
                response.data?.url;

            if (uploadedImageUrl) {
                handleChange("profileImageUrl", uploadedImageUrl);
                toast.success("Profile image uploaded.");
            } else {
                toast.error("Image Uploaded but no URL was returned.");
            }
        } catch (errror) {
            toast.error (
                error.response?.data?.message || "Failed to upload image."
            );
        } finally {
            setLoading (false);
            e.target.value = "";
        }
    };

    const handleRemoveImage = () => {
        handleChange("profileImageUrl", "");
    };

    const handleSubmit = () => {
        onSave(formData);
    };

    const isEmoji = 
        formData.profileImageUrl && 
        !formData.profileImageUrl.includes("/") &&
        !formData.profileImageUrl.includes(".");

    return (
        <div className = "w-full max-w-[420px] mx-auto py-2">
            <div className = "flex flex-col items-center">
                <div className = "relative mb-4">
                    {formData.profileImageUrl ? (
                        isEmoji ? (
                            <div className = "w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-3xl">
                                {formData.profileImageUrl}
                            </div>
                        ) : (
                            <img
                                src = {formData.profileImageUrl}
                                alt = "Profile Preview"
                                className = "w-20 h-20 rounded-full object-cover border border-gray-200"
                            />
                        )
                    ) : (
                        <CharAvatar
                            fullName = {formData.fullName}
                            width = "w-20"
                            height = "h-20"
                            style = "text-xl"
                        />
                    )}

                    {/* <button
                        type = "button"
                        onClick = {handleChooseFile}
                        className = "absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:opacity-90 cursor-pointer"
                        title = "Upload Photo"
                    >
                        <LuPencil size = {16}/>
                    </button> */}
                </div>

                <div className = "flex items-center justify-center gap-3 mb-4">
                    <button
                        type = "button"
                        className = "add-btn"
                        onClick = {handleChooseFile}
                        disabled = {loading}
                    >
                        {loading ? "Uploading..." : "Upload Photo"}
                    </button>
                    {/* <div className = "flex items-center">
                        <EmojiPickerPopup
                            icon = {formData.profileImageUrl}
                            onSelect = {(selectedIcon) => 
                                handleChange("profileImageUrl", selectedIcon)
                            }
                        />
                    </div> */}
                    
                    {formData.profileImageUrl && (
                        <button
                            type = "button"
                            className = "add-btn bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 cursor-pointer"
                            onClick = {handleRemoveImage}
                        >
                            Remove Display Profile
                        </button>
                    )}
                </div>

                <input
                    ref = {fileInputRef}
                    type = "file"
                    accept = "image/*"
                    className = "hidden"
                    onChange = {handleFileChange}
                />
            </div>

            <div className = "max-w-[340px] mx-auto">
                <Input
                    value = {formData.fullName}
                    onChange = {({target}) => 
                        handleChange("fullName", target.value)
                    }
                    label = "Name"
                    placeholder = "Jane Doe"
                    type = "text"
                />
            </div>

            <div className = "flex justify-center mt-4">
                <button
                    type = "button"
                    className = "add-btn add-btn-fill mt-4 cursor-pointer"
                    onClick = {handleSubmit}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default EditProfileForm;