const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController'); // Import as an object

const router = express.Router();

// Ensure correct function references
router.post('/follow', authMiddleware, userController.followuser);
router.post('/unfollow', authMiddleware, userController.unfollowuser);

//remove user from request
router.post('/friend-request/remove',authMiddleware,userController.deleteUserFromRequest);

//get all friends request
router.get('/friend-request',authMiddleware, userController.getAllFriendsRequest)

//get all friends to send request
router.get('/user-to-request',authMiddleware, userController.getAllUserForFriendsRequest)

//get all mutual friend
router.get('/mutual-friends',authMiddleware,userController.getAllMutualFriends)

//get all users from search
router.get('/',authMiddleware,userController.getAllUser)

router.get('/user-profile/:userId',authMiddleware,userController.getUserProfile)

router.get('/check-auth',authMiddleware,userController.checkUserAuth)
module.exports = router;
