const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1h"});
};

exports.registerUser = async (req, res) => {
    console.log("BODY:", req.body); // Temporary - from AI to find issue when using postman
    const {fullName, email, password, profileImageUrl } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({message: "All fields are required"});
    }

    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: "Email already in use."});
        }
        
        const user = await User.create({
            fullName,
            email,
            password,
            profileImageUrl,
        });
        
        res.status(201).json({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    } 
    catch (err) {
        res
            .status(500)
            .json({message: "Error registering user", error: err.message});
    }
};

exports.loginUser = async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: "All fields are required."});
    }
    try {
        const user = await User.findOne({email});
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({message: "Invalid Credentials."});
        }
        res.status(200).json ({
            id: user._id,
            user,
            token: generateToken(user._id),
        });
    }   catch (err) {
        res
            .status(500)
            .json({message: "Error logging in", error: err.message});
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({message: "User not found."});
        }

        res.status(200).json(user);
    } catch (err) {
        res
            .status(500)
            .json ({message: "Error occured.", error: err.message});
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const {fullName, profileImageUrl} = req.body;

        if (!fullName || !fullName.trim()) {
            return res.status(400).json({message: "Full name is required."});
        }

        const updateUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                fullName: fullName.trim(),
                profileImageUrl: profileImageUrl || "",
            },
            {new: true}
        ).select("-password");

        if (!updateUser) {
            return res.status(404).json({message: "User not found. Login and try again."});
        }
    } catch (error) {
        res.status(500).json({
            message: "Error updating profile", error: error.message,
        });
    }
};