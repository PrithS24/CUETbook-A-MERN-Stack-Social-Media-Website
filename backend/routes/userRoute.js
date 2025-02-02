const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController'); // Import as an object

const router = express.Router();

// Ensure correct function references
router.post('/follow', authMiddleware, userController.followuser);
router.post('/unfollow', authMiddleware, userController.unfollowuser);

//remove user from request
router.post('/remove/friend-request',authMiddleware,userController.deleteUserFromRequest);

module.exports = router;
