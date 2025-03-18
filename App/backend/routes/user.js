const express = require('express');
const { registerUser, loginUser, resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleWare');

const router = express.Router();

// Routes 
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/reset', resetPassword);

// implement user profile (use protect jwt)

module.exports = router;
