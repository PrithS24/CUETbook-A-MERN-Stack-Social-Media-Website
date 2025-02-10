const response = require("../utils/responseHandler");
const User = require("../model/User");

// API for following a user
const followuser = async (req, res) => {
    try {
        const { userIdToFollow } = req.body;
        const userId = req?.user?.userId;

        // Prevent user from following itself
        if (userId === userIdToFollow) {
            return response(res, 400, "You are not allowed to follow yourself");
        }

        const userToFollow = await User.findById(userIdToFollow);
        const currentUser = await User.findById(userId);

        // Check if both users exist
        if (!userToFollow || !currentUser) {
            return response(res, 404, "User not found");
        }

        // Check if already following
        if (currentUser.following.includes(userIdToFollow)) {
            return response(res, 400, "You are already following this account");
        }

        // Add to following list
        currentUser.following.push(userIdToFollow);
        // Add current user as the follower
        userToFollow.followers.push(userId);

        // Update counts
        currentUser.followingCount += 1;
        userToFollow.followerCount += 1;

        await currentUser.save();
        await userToFollow.save();

        return response(res, 200, "User followed successfully");
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
};

// API for unfollowing a user
const unfollowuser = async (req, res) => {
    try {
        const { userIdToUnfollow } = req.body;
        const userId = req?.user?.userId;

        // Prevent user from unfollowing itself
        if (userId === userIdToUnfollow) {
            return response(res, 400, "You are not allowed to unfollow yourself");
        }

        const userToUnfollow = await User.findById(userIdToUnfollow);
        const currentUser = await User.findById(userId);

        // Check if both users exist
        if (!userToUnfollow || !currentUser) {
            return response(res, 404, "User not found");
        }

        // Check if the user is actually following
        if (!currentUser.following.includes(userIdToUnfollow)) {
            return response(res, 400, "You are not following this account");
        }

        // Remove from following list
        currentUser.following = currentUser.following.filter(id => id.toString() !== userIdToUnfollow.toString());
        // Remove from followers list
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== userId.toString());

        // Update counts
        currentUser.followingCount -= 1;
        userToUnfollow.followerCount -= 1;

        await currentUser.save();
        await userToUnfollow.save();

        return response(res, 200, "User unfollowed successfully");
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
};

//to delete friend request
const deleteUserFromRequest = async(req,res)=>{
    try {
        const loggedInUserId = req.user.userId;
        const {requestSenderId} = req.body;

        const requestSender = await User.findById(requestSenderId);
        const loggedInUser = await User.findById(loggedInUserId);

        if (!requestSender || !loggedInUser) {
            return response(res, 404, "User not found");
        }
        //check if the request sender is following loggedin user or not
        const isRequestSend = requestSender.following.includes(loggedInUserId)
        if(!isRequestSend){
            return response(res,404, 'No request found for this user')
        }

        //remove the loggedin userId from request sender following list
        requestSender.following = requestSender.following.filter(user=>user.toString !== loggedInUserId )
        //remove the sender userId from loggedIn user followers list
        loggedInUser.followers = loggedInUser.followers.filter(user=>user.toString !== requestSenderId )

        //update follower and following counts
        loggedInUser.followerCount=loggedInUser.followers.length;
        requestSender.followingCount=requestSender.following.length;

        //save both users
        await loggedInUser.save();
        await requestSender.save();

        return response(res,200,`Friend request from ${requestSender.username} deleted successfully`)
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
}

//get all friend request
const getAllFriendsRequest = async(req,res)=>{
    try {
        const loggedInUserId = req.user.userId;

        //find the logged in user and retrieve their followers and following
        const loggedInUser = await User.findById(loggedInUserId).select('followers following')
        if(!loggedInUser){
           return response(res,404, 'User not found') 
        }
        //find user who follow the logged in user but are not followed back
        const userToFollowBack = await User.find({
            _id:{
                $in: loggedInUser.followers, //user who follow the loggedin user
                $nin: loggedInUser.following //exclude the logged in user's following list

            }
        }).select('username profilePicture email followerCount followingCount department userType studentID')

        return response(res,200,'user to follow back done',userToFollowBack)
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
}

//get all friend request for user
const getAllUserForRequest = async(req,res)=>{
    try {
        const loggedInUserId = req.user.userId;

        //find the logged in user and retrieve their followers and following
        const loggedInUser = await User.findById(loggedInUserId).select('followers following')
        if(!loggedInUser){
           return response(res,404, 'User not found') 
        }
        //find user who neither following nor follower of the logged in user
        const userForFriendRequest = await User.find({
            _id:{
                $ne: loggedInUser, //user who follow the loggedin user
                $nin: [...loggedInUser.following, ...loggedInUser.followers] //exclude both

            }
        }).select('username profilePicture email followerCount followingCount department userType studentID')

        return response(res,200,'users to send friend request',userForFriendRequest)
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
}

//api for mutual friends
const getAllMutualFriends = async (req, res) => {
    try {
        const ProfileUserId = req.params.userId;

        //find the logged in user and retrive their followers and following
        const loggedInUser = await User.findById(ProfileUserId)
        .select('followers following')
        .populate('followers', 'username profilePicture email followerCount followingCount department userType studentID')
        .populate('following', 'username profilePicture email followerCount followingCount department userType studentID')
        if(!loggedInUser){
           return response(res, 404, 'User not found')
        }

        //create a set of user id that logged in user is following
        const followingUserId = new Set(loggedInUser.following.map(user => user._id.toString()))

        //filter followers to get only those who are also following you and followed by loggin user 
        const mutualFriends = loggedInUser.followers.filter(follower => 
            followingUserId.has(follower._id.toString())
        )

        return response(res,200, 'Mutual friends get successfully', mutualFriends)

   } catch (error) {
       return response(res, 500, 'Internal server error', error.message)
   }
}

//get all users so that you can search for profile
// const getAllUser = async (req, res) => {
//     try {
//         const { search } = req.query;  // Get the search parameter from the query string
//         let filter = {};  // Initialize an empty filter

//         if (search) {
//             const searchTerms = search.toLowerCase().split(" ");  // Split the search query into individual words

//             let orConditions = [];  // Initialize an array to store search conditions

//             // Loop through each search term and add it to the filter
//             searchTerms.forEach(term => {
//                 // Match 'username', 'department', or 'studentID' using regex, case-insensitive
//                 orConditions.push({ username: { $regex: new RegExp(term, "i") } });
//                 orConditions.push({ department: { $regex: new RegExp(term, "i") } });
//                 orConditions.push({ studentID: { $regex: new RegExp(term, "i") } });

//                 // Match the 'userType' for 'alumni' or 'student'
//                 if (["alumni", "student"].includes(term)) {
//                     orConditions.push({ userType: term });
//                 }

//                 // If the term is a number, assume it's a 'batch' year and add to conditions
//                 if (!isNaN(term)) {
//                     orConditions.push({ batch: term });
//                 }
//             });

//             filter.$or = orConditions;  // Set the filter to use the OR conditions
//         }

//         // Query the database using the filter
//         const users = await User.find(filter).select('username profilePicture email followerCount followingCount department userType studentID batch');

//         // Respond with the result
//         return response(res, 200, "Got users successfully", users);
//     } catch (error) {
//         // Handle any errors that occur
//         return response(res, 500, "Internal server error", error.message);
//     }
// };

const getAllUser = async (req, res) => {
    try {
        const { search } = req.query;
        let filter = {}; // Initialize an empty filter

        if (search) {
            const searchTerms = search.toLowerCase().split(" "); // Split the search query into individual terms
            
            let andConditions = []; // Array to hold AND conditions

            searchTerms.forEach(term => {
                // Match term in string fields using regex (name, email, username, department, userType)
                andConditions.push({
                    $or: [
                        { department: { $regex: new RegExp(term, "i") } }, // Match department (e.g., "CSE")
                        { userType: { $regex: new RegExp(term, "i") } },   // Match userType (e.g., "alumni")
                        { name: { $regex: new RegExp(term, "i") } },        // Match name (e.g., "Pritha", "Saha")
                        { email: { $regex: new RegExp(term, "i") } },       // Match email
                    ]
                });

                // Exact match for studentID (as a string)
                andConditions.push({
                    studentID: { $regex: new RegExp(`^${term}$`, "i") } // Exact match (case-insensitive)
                });

                // Match batch (if term is a number, perform exact match for batch)
                if (!isNaN(term)) {
                    andConditions.push({
                        batch: term  // Exact match for batch (if term is numeric)
                    });
                }
            });

            // Apply the AND condition if there are multiple search terms
            filter.$and = andConditions;
        }

        // Query users with the dynamic filter
        const users = await User.find(filter).select('name email studentID department userType batch');

        if (users.length === 0) {
            return response(res, 200, "No users found", []);
        }

        return response(res, 200, "Got users successfully", users);
    } catch (error) {
        console.error(error);
        return response(res, 500, "Internal server error", error.message);
    }
};


//check if user is authenticated or not
const checkUserAuth = async(req,res)=>{
    try {
        const userId = req?.user?.userId
        if(!userId) return response(res,404, 'Unauthenticated login')

        //fetch user details, leave out sensitive data
        const user= await User.findById(userId).select('-password');
        if(!user) return response(res,403, 'User not found',user)
        return response(res,201,'User authenticated')
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
}
const getUserProfile=async(req,res)=>{
    try {
        const {userId} = req.params;
        const loggedInUserId=req?.user?.userId

        //fetch user details, leave out sensitive data
        const userProfile= await User.findById(userId).select('-password');
        if(!userProfile) return response(res,403, 'User not found')
            
        const isOwner = loggedInUserId ===userId;
        return response(res,201,'User profile found successfully',{profile:userProfile, isOwner})
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    } 
}
module.exports = {
    followuser,
    unfollowuser,
    deleteUserFromRequest,
    getAllFriendsRequest,
    getAllUserForRequest,
    getAllMutualFriends,
    getAllUser,
    checkUserAuth,
    getUserProfile
};
