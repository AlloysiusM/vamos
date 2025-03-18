const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleWare');

const router = express.Router();

// Routes 
router.post('/register', registerUser);
router.post('/login', loginUser);

// implement user profile (use protect jwt)

module.exports = router;
