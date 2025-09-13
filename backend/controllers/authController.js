import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"


//Generate JWT Token

const generateToken = (userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:"1d"})
}

//@desc Register a new user
//@route POST /api/auth/register
//@access Public
const registerUser = async (req,res)=>{
    try{
        const {name,email,password,profileImageUrl}=req.body

        //check if user already exists
        const userExist = await User.findOne({email});
        if (userExist){
            return res.status(400).json({message:"User already exists"});
        }

        //hash password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword =await bcrypt.hash(password,salt)

        //create new user

        const user = await User.create({
            name,
            email,
            password : hashedPassword,
            profileImageUrl,
        })

        //Return user data with JWT

        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id),
        });
    }catch(err){
        res.status(500).json({message:"Server error",err:err.message})
    }


};

//@desc Login user
//@route POST /api/auth/login
//@access Public

const loginUser = async (req,res)=>{
    try{
        const {email,password}=req.body
        const user = await User.findOne({email});
        if (!user){
            return res.status(500).json({message:"Invalid email or password"});
        }

        //Compare Password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(500).json({
                message:"Invalid email or password"
            })
        }
        //return user data with JWT

        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            profileImageUrl:user.profileImageUrl,
            token:generateToken(user._id),

        });
    }catch(err){
          res.status(500).json({message:"Server error",err:err.message})
    }
}

//@desc Get user Profile
//@route POST /api/auth/profile
//@access Private (Require JWT)

const getUserProfile = async (req,res)=>{
    try{
        const user = await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.json(user);

    }catch(err){
          res.status(500).json({message:"Server error",err:err.message})
    }
}

export { registerUser, loginUser, getUserProfile };
