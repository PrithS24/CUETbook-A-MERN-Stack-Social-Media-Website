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
        }).select('username profilePicture email followerCount')

        return response(res,200,'user to follow back done',userToFollowBack)
    } catch (error) {
        return response(res, 500, "Internal server error", error.message);
    }
}

//get all friend request for user

module.exports = {
    followuser,
    unfollowuser,
    deleteUserFromRequest,
    getAllFriendsRequest
};
