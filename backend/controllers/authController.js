import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//Generate JWT Token

const generateToken = (userId, email)=>{
    return jwt.sign({id:userId, email:email},process.env.JWT_SECRET,{expiresIn:"7d"})
}

//@desc Register a new user
//@route POST /api/auth/register
//@access Public
const registerUser = async (req,res)=>{
    try{
        const {name,email,password,profileImageUrl,googleToken}=req.body

        // Handle Google OAuth registration
        if (googleToken) {
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken: googleToken,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                
                const googleEmail = payload.email;
                const googleName = payload.name;
                const googlePicture = payload.picture;

                // Check if user already exists
                let user = await User.findOne({email: googleEmail});
                
                if (user) {
                    // User exists, just return token
                    return res.json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        profileImageUrl: user.profileImageUrl,
                        token: generateToken(user._id, user.email),
                    });
                }

                // Create new user with Google data
                user = await User.create({
                    name: googleName,
                    email: googleEmail,
                    password: crypto.randomBytes(32).toString('hex'), // Random password for OAuth users
                    profileImageUrl: googlePicture || profileImageUrl,
                });

                return res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    profileImageUrl: user.profileImageUrl,
                    token: generateToken(user._id, user.email),
                });
            } catch (googleError) {
                return res.status(400).json({message: "Invalid Google token"});
            }
        }

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
            token:generateToken(user._id, user.email),
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
        const {email,password,googleToken}=req.body

        // Handle Google OAuth login
        if (googleToken) {
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken: googleToken,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                
                const googleEmail = payload.email;
                const googleName = payload.name;
                const googlePicture = payload.picture;

                let user = await User.findOne({email: googleEmail});
                
                if (!user) {
                    // Create new user if doesn't exist
                    user = await User.create({
                        name: googleName,
                        email: googleEmail,
                        password: crypto.randomBytes(32).toString('hex'),
                        profileImageUrl: googlePicture,
                    });
                }

                return res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    profileImageUrl: user.profileImageUrl,
                    token: generateToken(user._id, user.email),
                });
            } catch (googleError) {
                return res.status(400).json({message: "Invalid Google token"});
            }
        }

        // Regular email/password login
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
            token:generateToken(user._id, user.email),

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

export { 
    registerUser, 
    loginUser, 
    getUserProfile
};
