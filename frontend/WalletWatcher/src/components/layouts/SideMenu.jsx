import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {SIDE_MENU_DATA} from "../../utils/data";
import {UserContext} from "../../context/userContext";
import CharAvatar from "../Cards/CharAvatar";
import Modal from "../Modal";
import EditProfileForm from "../Profile/EditProfileForm";
import axiosInstance from "../../utils/axiosInstance";
import {API_PATHS} from "../../utils/apiPaths";
import toast from "react-hot-toast";

const SideMenu = ({activeMenu}) => {
    const {user, updateUser, clearUser} = useContext(UserContext);
    const navigate = useNavigate();
    const [openEditProfileModal, setOpenEditProfileModal] = useState(false);

    const handleClick = (route) => {
        if (route === "logout") {
            handleLogout();
            return;
        }

        navigate(route);
    };

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
    };

    const handleUpdateProfile = async (profileData) => {
        try {
            const response = await axiosInstance.put(
                API_PATHS.AUTH.UPDATE_PROFILE,
                profileData
            );

            updateUser(response.data);
            toast.success("Profile updated successfully");
            setOpenEditProfileModal(false);
        } catch (error) {
            toast.error (
                error.response?.data?.message || "Failed to updated profile"
            );
        }
    };

    return (
        <>
            <div className = "w-64 h-[calc(100vh-61px)] left-0 bg-white border-r border-gray-200/50 p-4 sticky top-[61px] z-20">
                <div className = "flex flex-col items-center justify-center gap-3 mt-3 mb-7">
                    <button
                        type = "button"
                        className = "relative cursor-pointer"
                        onClick = {() => setOpenEditProfileModal(true)}
                    >
                        {!user?.profileImageUrl ? (
                            <CharAvatar
                                fullName = {user?.fullName}
                                width = "w-20"
                                height = "h-20"
                                style = "text-xl"
                            />
                            ) : (
                                <img
                                src = {user?.profileImageUrl}
                                alt = "Profile Image"
                                className = "w-20 h-20 object-cover bg-slate-400 rounded-full"
                            />
                            ) 
                        }
                    </button>

                    <h5 className = "text-gray-950 font-medium leading-6">
                        {user?.fullName || ""}
                    </h5>
                </div>

                {SIDE_MENU_DATA.map((item, index) => (
                    <button
                        key = {`menu_${index}`}
                        className = {`w-full flex items-center gap-4 text-[15px] ${
                            activeMenu == item.label ? "text-white bg-primary" : ""
                        } py-3 px-6 rounded-lg mb-3 cursor-pointer`}
                        onClick = {() => handleClick(item.path)}
                    >
                        <item.icon className = "text-xl"/>
                        {item.label}
                    </button>  
                ))}
            </div>

            <Modal
                isOpen = {openEditProfileModal}
                onClose = {() => setOpenEditProfileModal(false)}
                title = "Edit Profile"
            >
                <EditProfileForm user = {user} onSave = {handleUpdateProfile}/>
            </Modal>
        </>
    );
};

export default SideMenu