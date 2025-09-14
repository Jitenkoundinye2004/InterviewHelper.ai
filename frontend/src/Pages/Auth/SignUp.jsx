import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper.js";
import { UserContext } from "../../context/userContext.jsx";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPath.js";
import uploadImage from "../../utils/uploadImage.js";

const Signup = ({ setCurrentPage }) => {
  const [profilepic, setProfilepic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {updateUser} = useContext(UserContext);

  // ✅ Added error state
  const [error, setError] = useState("");

  const navigate = useNavigate();

  //Handle signup form submit//
  const handleSignup = async(e) => {
    e.preventDefault();
    console.log("Signing up:", name, email, password, profilepic);
    // navigate("/dashboard");

    let profileImageUrl = "";

    if (!name) {
      setError("Full name is required."); // ✅ changed fullName → name
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Password cannot be empty.");
      return;
    }

    if(password.length < 8){ 
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError("");
    // signup API call can be made here
    try {
      //Upload image if Present
      if(profilepic){
        const imgUploadRes = await uploadImage(profilepic);
        profileImageUrl=imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name,
        email,
        password,
        profileImageUrl,

      });
      const {token} = response.data;

      if(token){
        localStorage.setItem("token",token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Join Us today by entering your details to get started.
      </p>

      {/* ✅ Display error */}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <ProfilePhotoSelector
          image={profilepic}
          setImage={setProfilepic}
          preview={preview}
          setPreview={setPreview}
        />

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          type="text"
          required
          className="border rounded p-2"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="abc@gmail.com"
          type="email"
          required
          className="border rounded p-2"
        />

        <div className="relative">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="min. 8 characters"
            type={showPassword ? "text" : "password"}
            required
            className="border rounded p-2 w-full"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          className="text-blue-500 font-medium cursor-pointer"
          onClick={() => setCurrentPage("login")}
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default Signup;
