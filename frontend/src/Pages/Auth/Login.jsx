import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { validateEmail } from "../../utils/helper"; 
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  // Handle login form submit
  const handleLogin = async(e) => {
    e.preventDefault();

    // ✅ Validation checks
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

    // Clear previous error
    setError("");

    // ✅ Now navigate only after validations pass
    
    // login API call can be made here
    try {
      const response =await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password
      });
      
      const{token} = response.data;
      
      if(token){
        localStorage.setItem("token",token);
        updateUser(response.data)
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
      <h3 className="text-lg font-semibold text-black">Welcome Back</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Please enter your credentials to log in.
      </p>

      {/* ✅ Display error messages */}
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        Don’t have an account?{" "}
        <button
          type="button"
          className="text-blue-500 font-medium"
          onClick={() => setCurrentPage("signup")}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
