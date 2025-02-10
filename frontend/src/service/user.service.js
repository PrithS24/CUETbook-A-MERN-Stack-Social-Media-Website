import axiosInstance from "./url.service";

//to accept
export const getAllFriendsRequest = async()=>{
    try {
        const response = await axiosInstance.get('/users/friend-request')
        return response?.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

//to send
export const getAllFriendsSuggestion = async()=>{
    try {
        const response = await axiosInstance.get('/users/user-to-request')
        return response?.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

//to follow
export const followUser = async(userId)=>{
    try {
        const response = await axiosInstance.post('/users/follow',{userIdToFollow:userId})
        return response?.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

//to unfollow
export const UnfollowUser = async(userId)=>{
    try {
        const response = await axiosInstance.post('/users/unfollow',{userIdToUnfollow:userId})
        return response?.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

//to delete friend request
export const deleteUserFromRequest = async(userId)=>{
    try {
        const response = await axiosInstance.post('/users/friend-request/remove',{requestSenderId:userId})
        return response?.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

//to fetch user profile
export const fetchUserProfile = async(userId)=>{
    try {
        const token = localStorage.getItem("authToken");
        const response = await axiosInstance.get(`/users/profile/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response?.data?.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

//to get mutual friends
export const getMutualFriends = async(userId)=>{
    try {
        const response = await axiosInstance.get('/users/mutual-friends')
        return response?.data?.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

//to update user profile
export const updateUserProfile = async(userId,updateData)=>{
    try {
        const response = await axiosInstance.put(`/users/profile/${userId}`,updateData)
        return response?.data?.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

//to update user cover photo
export const updateUserCoverPhoto = async(userId,updateData)=>{
    try {
        const response = await axiosInstance.put(`/users/profile/cover-photo/${userId}`,updateData)
        return response?.data?.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

//create or update user bio
export const createOrUpdateUserBio = async(userId,bioData)=>{
    try {
        const response = await axiosInstance.put(`/users/bio/${userId}`,bioData)
        return response?.data?.data;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

//to search for user
export const getAllUsers = async (searchQuery = "") => {
    try {
        const response = await axiosInstance.get(`users?search=${searchQuery}`);
        return response?.data?.data; 
    } catch (error) {
        console.log(error);
        throw error;
    }
};
