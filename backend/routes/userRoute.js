const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController'); // Import as an object
const { createOrUpdateUserBio,updateCoverPhoto,updateUserProfile } = require('../controllers/createOrUpdateController');
const { multerMiddleware } = require('../config/cloudinary');

const router = express.Router();


//user follow 
router.post('/follow',authMiddleware,userController.followuser)

//user unfollow
router.post('/unfollow',authMiddleware,userController.unfollowuser)

//remove user from request
router.post('/remove/friend-request',authMiddleware,userController.deleteUserFromRequest);

//get all friends request
router.get('/friend-request',authMiddleware,userController.getAllFriendsRequest )


//get all friends for request
router.get('/user-to-request',authMiddleware,userController.getAllUserForFriendsRequest )


//get all mutual friends 
router.get('/mutual-friends/:userId',authMiddleware,userController.getAllMutualFriends)


//get all users from search
router.get('/',authMiddleware,userController.getAllUser)

router.get('/profile/:userId',authMiddleware,userController.getUserProfile)


//get all users fror search 
router.get('/check-auth',authMiddleware,userController.checkUserAuth)



// create or update user Bio
router.put('/bio/:userId', authMiddleware, createOrUpdateUserBio)

router.put('/profile/:userId',authMiddleware, multerMiddleware.single('profilePicture'),updateUserProfile)


// update user cover
router.put('/profile/cover-photo/:userId',authMiddleware,multerMiddleware.single('coverPhoto') ,updateCoverPhoto)

module.exports = router;