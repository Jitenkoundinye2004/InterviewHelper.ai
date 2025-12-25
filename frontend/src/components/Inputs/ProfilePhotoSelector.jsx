import React, { useRef } from "react";
import { LuUser, LuUpload, LuTrash, LuCamera } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview }) => {
  const inputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const previewUrl = URL.createObjectURL(file);
      if (setPreview) setPreview(previewUrl);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (setPreview) {
      setPreview(null);
    }
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const onChooseFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image ? (
        <div className="group relative">
          <div
            className="w-24 h-24 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all overflow-hidden"
            onClick={onChooseFile}
          >
            <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-blue-500 transition-colors">
              <LuCamera size={24} />
              <span className="text-[10px] font-medium uppercase tracking-wide">Add Photo</span>
            </div>
          </div>

          <button
            type="button"
            className="absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors pointer-events-none"
          >
            <LuUpload size={14} />
          </button>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={preview}
            alt="profile photo"
            className="w-24 h-24 rounded-full object-cover border-2 border-blue-500 shadow-sm"
          />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -top-1 -right-1 shadow-md hover:bg-red-600 transition-all transform hover:scale-110"
            onClick={handleRemoveImage}
          >
            <LuTrash size={14} />
          </button>

          <div
            className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
            onClick={onChooseFile}
          >
            <LuUpload className="text-white" size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
