import React from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({value,
     onChange,
     label,
     placeholder,
     type
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const toggleshowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>

            <div className="relative">
                <input
                    type={type === "password" ? (showPassword ? "text" : "password") : type}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-gray-900 placeholder-gray-500"
                    value={value}
                    onChange={(e) => onChange(e)}
                />
                {type === "password" && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {showPassword ? (
                            <FaRegEye
                                size={20}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200"
                                onClick={() => toggleshowPassword()}
                            />
                        ) : (
                            <FaRegEyeSlash
                                size={20}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors duration-200"
                                onClick={() => toggleshowPassword()}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
    
};

export default Input;

