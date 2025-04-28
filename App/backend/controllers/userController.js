const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // For generating a random code
const Notification = require('../models/notificationModel');

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
      pass: process.env.EMAIL_PASS, 
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
          from: '"Vamos Unlimited" <your-email@gmail.com>',
          to: user.email,
          subject: 'Password Reset Code',
          text: `Your Vamos password reset code is: ${verificationCode}`,
        });
    
        res.json({ message: 'Verification code sent successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
      }
    };

    //Verify code
    const verificationEmail = async (req, res) => {
      const { email, code } = req.body;
  
      try {
          const user = await User.findOne({ email });
  
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }
  
          console.log("[DEBUG] Found User:", user);
          console.log("[DEBUG] Stored Code:", user.resetCode);
          console.log("[DEBUG] Received Code:", code);
          console.log("[DEBUG] Expiry Time:", user.resetCodeExpires);
  
          // Check if resetCode is undefined or expired
          if (!user.resetCode) {
              return res.status(400).json({ message: 'No verification code found. Please request a new one.' });
          }
  
          if (Date.now() > user.resetCodeExpires) {
              return res.status(400).json({ message: 'Verification code expired. Request a new one.' });
          }
  
          if (user.resetCode.toString() !== code) {
              return res.status(400).json({ message: 'Invalid verification code' });
          }
  
          // Clear the reset code after successful verification
          user.resetCode = null;
          user.resetCodeExpires = null;
          await user.save();
  
          // Generate a temporary token for password reset
          const tempToken = generateToken(user._id);
  
          res.json({ message: 'Code verified successfully', token: tempToken });
  
      } catch (error) {
          console.error("[ERROR] Server Error:", error);
          res.status(500).json({ message: 'Something went wrong' });
      }
  };

  //reset password
  const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    console.log("[DEBUG] Received Reset Password Request:");
    console.log("Email:", email);
    console.log("New Password:", newPassword);

    try {
        // Check is user exists
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
      // Ensure user has verified the reset code
      if (user.resetCode || user.resetCodeExpires) {
        return res.status(400).json({ message: 'Password reset code not verified' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
       
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  }

  const getUserName = async(req, res) => {
    console.log('dada');
    
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token ("Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token and decode payload
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from DB using ID from token payload
            // Select only necessary fields, explicitly exclude password
            const user = await User.findById(decoded.id).select('-password');

            if (user) {
                // Send user data (without password)
                res.status(200).json({
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    // Add any other non-sensitive fields you want to return
                });
            } else {
                // This case might occur if the user was deleted after the token was issued
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Get User Profile Error:', error);
            // Handle specific JWT errors
            if (error.name === 'JsonWebTokenError') {
                res.status(401).json({ message: 'Not authorized, token invalid' });
            } else if (error.name === 'TokenExpiredError') {
                res.status(401).json({ message: 'Not authorized, token expired' });
            } else {
                res.status(500).json({ message: 'Server Error' });
            }
        }
    } else {
        // Handle case where no token is provided
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

const getPeopleName = async(req, res) => {
    console.log('gg');
    
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            console.log('kk');
            // Extract token ("Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token and decode payload
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const users = await User.find({ _id: { $ne: decoded.id } }).select('fullName email');
            res.status(200).json(users);
       
    } catch (error) {
        console.error('Get User Profile Error:', error);
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ message: 'Not authorized, token invalid' });
        } else if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Not authorized, token expired' });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }
    }
} else {
    // Handle case where no token is provided
    res.status(401).json({ message: 'Not authorized, no token provided' });
}
};

const sendingReq = async (req, res) => {

    try {
        const { friendId } = req.body;
        const senderId = req.user.id;
        

        // Create a notification for the user
    const newNotif = new Notification({
        user: friendId,          // who will RECEIVE this notification
        message: `You have a new friend request!`,
        sender: senderId,        // who sent it
        type: 'friend_request',  // optional
      });
  
      await newNotif.save();
        res.status(201).json({ message: 'Notification sent'});
        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getNotif = async (req, res) => {

};

  

module.exports = { registerUser, loginUser, forgotPassword, verificationEmail, resetPassword, getUserName, getPeopleName, sendingReq, getNotif };
