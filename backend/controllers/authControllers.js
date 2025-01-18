const User = require("../model/User");
const response = require("../utils/responseHandler");
const bcrypt=require('bcryptjs')

const registerUser = async(req, res)=>{
    try {
        const { username, email, password, department, studentID, gender,  userType, batch, graduationYear } = req.body;

        if (!username || !email || !password || !department || !studentID || !gender || userType) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // If user is an alumni, batch and graduation year are required
        if (userType === 'alumni' && (!batch || !graduationYear)) {
            return res.status(400).json({ message: 'Batch and graduation year are required for alumni.' });
        }

        const existingUser=await User.findOne({email});
        if(existingUser)
        {
            return response(res,400,'User with this email already exits')
        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser = new User ({
            username,
            email,
            password: hashedPassword,
            department,
            studentID,
            gender,
            userType,
            batch: userType === 'alumni' ? batch : undefined,  // Set batch only for alumni
            graduationYear: userType === 'alumni' ? graduationYear : undefined
        })
        await newUser.save();

        const accessToken = generateToken(newUser);

        res.cookie("auth_token",accessToken,{
            httpOnly:true,
        })

        return response(res,201,"User created successfully",{
            username:newUser.username,
            email:newUser.email,
            userType: newUser.userType
        })

    } catch (error) {
        console.error(error)
        return response(res,500,"Internal Server Error",error.message)
    }
}

module,exports ={registerUser}