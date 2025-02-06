// //dummy authmiddleware for coding purpose
// const jwt = require('jsonwebtoken');
// const User = require('../model/User');

// const authMiddleware = async (req, res, next) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//         return res.status(401).json({ message: 'Authentication failed' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.userId); // Assuming the JWT contains userId
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         req.user = user; // Attach user data to request
//         next(); // Proceed to the next middleware or route handler
//     } catch (error) {
//         return res.status(401).json({ message: 'Authentication failed', error: error.message });
//     }
// };

// module.exports = authMiddleware;


// const jwt = require("jsonwebtoken");
// const response = require("../utils/responseHandler");

// const authMiddleware = (req, res, next) => {
//   const authToken = req?.cookies?.auth_token;
//   if (!authToken)
//     return response(
//       res,
//       401,
//       "Authentication required, please provide a token"
//     );

//   try {
//     const decode = jwt.verify(authToken, process.env.JWT_SECRET);
//     // req.user = decode;
//     console.log("Decoded Token:", decode); // Debugging line
//     req.user = { userId: decode.userId }; // Ensure correct casing
//     next();
//   } catch (error) {
//     // console.error(error)
//     console.error("JWT verification error:", error);
//     return response(res, 401, "Invalid token or expired. Please try again");
//   }
// };

// module.exports = authMiddleware; // tazin er part 

const jwt = require('jsonwebtoken')
const response = require('../utils/responseHandler')

const authMiddleware = (req, res, next) =>{
    const authToken = req?.cookies?.auth_token;
    if ( !authToken) return response(res, 401, "Authentication required. Please provide a token")

    try {
        const decode = jwt.verify(authToken, process.env.JWT_SECRET)
        req.user = decode
        next();
    } catch (error) {
        console.error(error)
        return response(res, 401, 'invalid token or expired. Please try again.')
    }
}

module.exports = authMiddleware

