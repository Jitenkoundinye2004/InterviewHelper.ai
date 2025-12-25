import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

const ProfileInfoCard = () => {
    const {user,clearUser } = useContext(UserContext);
    const navigate = useNavigate();

const handleLogout = () => {
    localStorage.clear()
    clearUser();
    navigate("/");
};
return user && (
    <div className='flex items-center'>
        {user.profileImageUrl && user.profileImageUrl.trim() !== "" ? (
            <img src={user.profileImageUrl} alt=""
                className='w-11 h-11 bg-gray-300 rounded-full mr-3' />
        ) : (
            <div className='w-11 h-11 bg-gray-300 rounded-full mr-3 flex items-center justify-center'>
                <span className='text-gray-600 font-bold text-lg'>
                    {(user.name || "").charAt(0).toUpperCase()}
                </span>
            </div>
        )}
        <div>
            <div className='text-[15px] text-black font-bold leading-3'>
                {user.name || ""}

            </div>
            <button className='text-blue-500 text-sm font-semibold cursor-pointer hover:underline'
                onClick={handleLogout}>
                Logout
            </button>
        </div>
    </div>
)
}
export default ProfileInfoCard;