const User = require("../model/User");
const EligibleUser = require("../model/EligibleUser");
const response = require("../utils/responseHandler");
const { generateToken } = require("../utils/generateToken");
const bcrypt = require('bcryptjs');



const registerUser = async (req, res) => {
    try {
        const { username, email, password, department, studentID, gender, userType, batch, graduationYear } = req.body;

        if (!username || !email || !password || !department || !studentID || !gender || !userType) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        
        if (userType === 'alumni' && (!batch || !graduationYear)) {
            return res.status(400).json({ message: 'Batch and graduation year are required for alumni.' });
        }

        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response(res, 400, 'User with this email already exists');
        }

       
        const eligibilityCriteria = {
            email,
            studentID,
            department,
            ...(userType === 'alumni' && { batch, graduationYear }) 
        };

        const eligibleUser = await EligibleUser.findOne(eligibilityCriteria);
        if (!eligibleUser) {
            return response(res, 403, 'You are not eligible to register. Please contact support if this is a mistake.');
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            department,
            studentID,
            gender,
            userType,
            batch: userType === 'alumni' ? batch : undefined,  
            graduationYear: userType === 'alumni' ? graduationYear : undefined
        });
        await newUser.save();
        await EligibleUser.deleteOne({ email });

        const accessToken = generateToken(newUser);

      
        res.cookie("auth_token", accessToken, {
            httpOnly: true,
        });

        
        return response(res, 201, "User created successfully", {
            username: newUser.username,
            email: newUser.email,
            userType: newUser.userType
        });

    } catch (error) {
        console.error(error);
        return response(res, 500, "Internal Server Error", error.message);
    }
};
const loginUser = async (req, res) => {
    res.json({ message: "User logged in successfully" });
};

const logout = async (req, res) => {
    res.json({ message: "User logged out successfully" });
};


module.exports = { registerUser, loginUser, logout };

