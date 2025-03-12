const User = require('../models/userModel.js');

const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Check is user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({ fullName, email, password });
        
        // Check data json struct
        if (user) {
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                password: user.password 
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        } 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Login user (place holder)
const loginUser = async (req, res) => {
    res.json({ message: "Login endpoint not yet implemented" });
};

// Create a get profile

module.exports = { registerUser, loginUser };
