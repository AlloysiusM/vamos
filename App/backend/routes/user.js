const express = require('express');
const { registerUser, loginUser,forgotPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleWare');

const router = express.Router();

// Routes 
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post("/forgotPassword", forgotPassword);

// implement user profile (use protect jwt)

module.exports = router;
