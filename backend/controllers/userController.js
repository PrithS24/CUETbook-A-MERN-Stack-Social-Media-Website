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
        const loggedInUserId = req.res.userId;
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
        }).select('username profilePicture email followerCount followingCount department status studentId')

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
        }).select('username profilePicture email followerCount followingCount department status studentId')

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
        .populate('following', 'username profilePicture email followerCount followingCount')
        .populate('followers','username profilePicture email followerCount followingCount')

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
const getAllUser = async (req, res) => {
    try {
        const { search } = req.query;
        let filter = {};

        if (search) {
            const searchTerms = search.toLowerCase().split(" "); // Split query into words

            let orConditions = [];

            searchTerms.forEach(term => {
                orConditions.push({ username: { $regex: new RegExp(term, "i") } }); // Search username
                orConditions.push({ department: { $regex: new RegExp(term, "i") } }); // Search department
                orConditions.push({ studentId: { $regex: new RegExp(term, "i") } }); // Search student ID
                
                if (["alumni", "student"].includes(term)) {
                    orConditions.push({ status: term }); // Match exact status
                }

                if (!isNaN(term)) { // If it's a number, assume it's a batch year
                    orConditions.push({ batch: term });
                }
            });

            filter.$or = orConditions;
        }

        const users = await User.find(filter).select('username profilePicture email followerCount followingCount department status studentId');

        return response(res, 200, "Got users successfully", users);
    } catch (error) {
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
