const User = require('../models/userModel.js');

const registerUser = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const userExists = await User.findOneAndDelete({email});
        if(userExist) {
            return res.status(400).json({message: 'User already exists'});
        }

        const user = await User.create({
            fullName,
            email,
            password
        })

        if(user) {
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                user: user.password
            });
        } else {
            res.status(400).json({message: 'Invalid user data'});
        } 
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

// create login user

// create getProfile

module.exports = { registerUser };