const express = require('express');
const { registerUser, loginUser,forgotPassword, verificationEmail, resetPassword, getUserName, getPeopleName} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleWare');

const router = express.Router();

// Routes 
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/verify-Email", verificationEmail);
router.post("/resetPassword", resetPassword);
router.get("/profile", getUserName)
router.get("/add-friends", getPeopleName)
// implement user profile (use protect jwt)

module.exports = router;
