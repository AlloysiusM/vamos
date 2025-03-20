const express = require('express');
const { registerUser, loginUser,forgotPassword, verificationEmail} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleWare');

const router = express.Router();

// Routes 
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/verificationEmail", verificationEmail);
//router.post("/resetPassword", verificationEmail);

// implement user profile (use protect jwt)

module.exports = router;
