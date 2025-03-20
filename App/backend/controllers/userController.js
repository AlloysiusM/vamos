const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // For generating a random code

// create JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    })
}

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
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if(user && (await user.matchPassword(password))) {
            res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Create a get profile



// Setup email transporter (Gmail SMTP example)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use environment variables in production
    },
  });

  //Forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Generate a 6-digit verification code
        const verificationCode = crypto.randomInt(100000, 999999).toString();
    
        // Save the code in the database (add a field for it)
        user.resetCode = verificationCode;
        user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
        await user.save();
    
        // Send email with the verification code
        await transporter.sendMail({
          from: '"Your App" <your-email@gmail.com>',
          to: user.email,
          subject: 'Password Reset Code',
          text: `Your password reset code is: ${verificationCode}`,
        });
    
        res.json({ message: 'Verification code sent successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
      }
    };

    //Verify code
    const verificationEmail =  async (req, res) => {
        const { email, code } = req.body;
      
        try {
          const user = await User.findOne({ email });
      
          if (!user || user.resetCode !== code || Date.now() > user.resetCodeExpires) {
            return res.status(400).json({ message: 'Invalid or expired code' });
          }
      
          // Clear the reset code after successful verification
          user.resetCode = null;
          user.resetCodeExpires = null;
          await user.save();
      
          res.json({ message: 'Code verified successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Something went wrong' });
        }
      };



module.exports = { registerUser, loginUser, forgotPassword, verificationEmail };
