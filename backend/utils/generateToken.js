const jwt = require('jsonwebtoken')

const generateToken = (user)=>{
    return jwt.sign({userId:user?._id,email:user.email}, process.env.IWT_SECRET,{expiresIn:"90d"});
}

module.exports={generateToken}