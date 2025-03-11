const express = require('express');
const { registerUser } = require('../controllers/userContoller');

const router = express.Router();

router.post('/register', registerUser);

// need to create model 
router.post('/login', loginUser);

module.exports = router;