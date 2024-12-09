import { useState,useCallback } from "react";
import { FaEdit } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import authService from "../../services/authService";
import panelService from "../../services/panelService";
import { UPDATE_SUCCESS } from "../../redux/actions/types";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";
import Modal from "./settingsComponents/Modal";

function Settings() {
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [keepUnsavedChanges, setKeepUnsavedChanges] = useState(useSelector(state => state.user.keepunsaved));
  const [profilePic, setProfilePic] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editableName, setEditableName] = useState( useSelector(state => state.user.name));
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [updateName]= useState(useSelector(state => state.user.name));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const profile = {
    name: editableName,
    institute: useSelector(state => state.user.instituteId),
    roles: useSelector(state => state.user.roles),
    email: useSelector(state => state.user.email),
    image: useSelector(state => state.user.image),
    keepUnsavedChanges:useSelector(state => state.user.keepunsaved),
  };
  
  // Helper function to crop the image
  const getCroppedImg = async (imageSrc, crop) => {
    const image = new Image();
    image.src = imageSrc;
    
    return new Promise((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        canvas.width = 200;
        canvas.height = 200;
        
        // Cropping the image
        ctx.drawImage(
          image,
          crop.x, crop.y, crop.width, crop.height,
          0, 0, 200, 200
        );
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject("Canvas is empty");
            return;
          }
          resolve(blob);
        }, "image/jpeg", 1);
      };
      
      image.onerror = (error) => reject(error);
    });
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setUnsavedChanges(true);
    validatePasswords(event.target.value, confirmPassword);
  };
  
  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setUnsavedChanges(true);
    validatePasswords(password, event.target.value); 
  };
  
  const validatePasswords = (password, confirmPassword) => {
    if (password !== confirmPassword && confirmPassword) {
      setPasswordError("Passwords do not match.");
    } else {
      setPasswordError("");
    }
  };
  
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result); // Set the image source for cropping
        setShowCropper(true); // Show cropper
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  const handleCropSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      
      // Compress the image
      const compressedImage = await imageCompression(croppedImageBlob, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 200,
      });
      
      setProfilePic(compressedImage); // Set the compressed, cropped image
      setShowCropper(false); // Hide cropper
      setUnsavedChanges(true);
    } catch (error) {
      console.error("Error cropping the image:", error);
    }
  };
  const handleSaveChanges = async () => {
    if (!passwordError) {
      const updatedProfile = new FormData();
      //include only the fields that are changed
      if (password) updatedProfile.append("password", password);
      if (profilePic){
        updatedProfile.append("image", profilePic);
      }
      if (editableName !== updateName) updatedProfile.append("name", editableName);
      if (keepUnsavedChanges !== profile.keepUnsavedChanges) updatedProfile.append("keepUnsavedChanges", keepUnsavedChanges);
      
      try {
        await authService.updateProfile(updatedProfile);
        alert("Changes saved.");
        setPassword("");
        setConfirmPassword("");
        setUnsavedChanges(false);
        dispatch({ type: UPDATE_SUCCESS, payload: updatedProfile });
      } catch (error) {
        console.error("Failed to save changes:", error);
        alert("Failed to save changes. Please try again.");
      }
    }
  };
  
  const handleKeepUnsavedChangesToggle = () => {
    setKeepUnsavedChanges(!keepUnsavedChanges);
    setUnsavedChanges(true);
  };
  
  const handleEditName = () => {
    setIsEditingName(true);
  };
  
  const handleNameChange = (e) => {
    setEditableName(e.target.value);
    setUnsavedChanges(true);
  };
  
  const handleNameSave = () => {
    setIsEditingName(false);
    setUnsavedChanges(true);
    
  };
  const handleRequestAccess = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitRequest = (text, role) => {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("role", role);
    panelService.request_access(formData);
    setIsModalOpen(false);
  };
  
  return (
    <div className="w-full min-h-screen py-8 dark:bg-gray-900 bg-blue-50 text-black">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 allign">
        {/* Profile Card */}
        <div className="p-8 rounded-xl shadow-lg mb-10 dark:bg-gray-800 bg-white">
          <h2 className="dark:text-white text-black mb-2 text-2xl font-semibold allign">
            Profile Information
          </h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="relative mt-2 w-32 min-h-[32]">
            <img
              src={profilePic ? URL.createObjectURL(profilePic) : profile.image ? `http://64.227.158.253/uploads/images/${encodeURIComponent(profile.image)}` : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
              alt="Profile"
              className="rounded-full w-full h-full border-2 border-blue-400 shadow-md object-cover"
            />
            {/* Edit Icon */}
            <label
              htmlFor="upload"
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full border-2 border-blue-400 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5m-5.586-9.414a2 2 0 112.828 2.828L11 12.828l-4 1 1-4 5.414-5.414z"
                />
              </svg>
            </label>

            {/* Hidden file input */}
            <input
              id="upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </div>


            <div className="text-left space-y-1 w-full">
              <div className="flex items-center">
                <p className="text-lg font-medium dark:text-white text-black">
                  Name:
                </p>
                {isEditingName ? (
                  <input
                    type="text"
                    value={editableName}
                    onChange={handleNameChange}
                    className="ml-2 px-2 py-1 border dark:bg-gray-700 dark:text-white bg-white text-black rounded-md" />
                ) : (
                  <span className="font-light ml-2 dark:text-white text-black text-lg" >{profile.name}</span>
                )}
                {isEditingName ? (
                  <button
                    onClick={handleNameSave}
                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded-md"
                  >
                    Done
                  </button>
                ) : (
                  <FaEdit
                    className="cursor-pointer ml-2 text-blue-500"
                    onClick={handleEditName}
                  />
                )}
              </div>

              <p
                className="text-lg font-medium dark:text-white text-black">
                Institute Id: <span className="font-light">{profile.institute}</span>
              </p>
              <p
                className="text-lg font-medium dark:text-white text-black">
                Roles: <span className="font-light">{profile.roles.join(", ")}</span>
              </p>
              <p
                className="text-lg font-medium dark:text-white text-black">
                Email: <span className="font-light">{profile.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Settings Options */}
        <div
          className="p-8 rounded-xl shadow-lg dark:bg-gray-800 bg-white">
          <h2
            className="text-2xl font-semibold mb-4 dark:text-white text-black">
            Preferences
          </h2>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-lg font-medium mb-2 dark:text-white text-black">
              Change Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow-md border border-gray-300 rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
            />
            <input
              type="password"
              id="confirm-password"
              className="shadow-md border border-gray-300 rounded-lg w-full py-3 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 mt-4"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm new password"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
          </div>
          {/* Keep Unsaved Changes */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="keepUnsavedChanges"
              className="h-5 w-5 text-blue-600 focus:ring-blue-600 transition-transform transform scale-105 mr-3"
              checked={keepUnsavedChanges}
              onChange={handleKeepUnsavedChangesToggle}
            />
            <label
              htmlFor="keepUnsavedChanges"
              className="text-lg font-medium dark:text-white text-black">
              Keed Edited Changes Locally Without Saving for Everyone
            </label>
          </div>

          {profile.roles.includes("Admin") && (
          <button
            className="w-full bg-gradient-to-r from-teal-400 to-blue-500 text-white py-3 px-6 rounded-lg hover:from-teal-500 hover:to-blue-600 transition-all duration-200 shadow-md mt-4"
            onClick={handleRequestAccess}
          >
            Request Access Update
          </button>
        )}
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmitRequest}
          />


        </div>
            {/* Save Changes */}
            {unsavedChanges && (
            <button
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md mt-4"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
          )}
      </div>
      {showCropper && (
      <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-800 bg-opacity-75">
        <div className="bg-white rounded-md p-4 shadow-lg">
          <div className="crop-container relative w-[400px] h-[400px]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>
          <button
            onClick={handleCropSave}
            className="bg-blue-500 text-white py-1 px-4 rounded-md mt-4"
          >
            Save
          </button>
        </div>
      </div>
    )}
    </div>
  );
}

export default  Settings;