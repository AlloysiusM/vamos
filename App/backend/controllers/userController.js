const User = require('../models/userModel.js');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // For generating a random code
const Notification = require('../models/notificationModel');
const mongoose = require('mongoose');

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

// Google login
const googleLogin = async (req, res) => {
  const { email, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword = crypto.randomBytes(16).toString('hex');
      user = await User.create({
        fullName: name,
        email,
        password: generatedPassword, 
        isGoogleUser: true
      });
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');

            if (user) {
                res.status(200).json({
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Get User Profile Error:', error);

            if (error.name === 'JsonWebTokenError') {
                res.status(401).json({ message: 'Not authorized, token invalid' });
            } else if (error.name === 'TokenExpiredError') {
                res.status(401).json({ message: 'Not authorized, token expired' });
            } else {
                res.status(500).json({ message: 'Server Error' });
            }
        }
    } else {

        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

const getPeopleName = async(req, res) => {
    console.log('gg');
    
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            console.log('kk');
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const users = await User.find({ _id: { $ne: decoded.id } }).select('fullName email');
            res.status(200).json(users);
       
    } catch (error) {
        console.error('Get User Profile Error:', error);
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ message: 'Not authorized, token invalid' });
        } else if (error.name === 'TokenExpiredError') {
            res.status(401).json({ message: 'Not authorized, token expired' });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }
    }
} else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
}
};

const sendingReq = async (req, res) => {

    try {
        const { friendId } = req.body;
        const senderId = req.user.id;
        
    const newNotif = new Notification({
        user: friendId,
        message: `You have a new friend request!`,
        sender: senderId, 
        type: 'friend_request',
      });
  
      await newNotif.save();
        res.status(201).json({ message: 'Notification sent'});
        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getFriendReq = async (req, res) => {
   try {
    const userId = req.user.id;
    const notification = await Notification.find({user: userId})
    .populate('sender', 'fullName email') 
    .sort({ createdAt: -1 }); 

    res.status(200).json(notification);
    
   } catch (error) {
    res.status(500).json({ message: 'Server error' });
}
};

const acceptFriendRequest = async (req, res) => {
    const { notificationId } = req.body;
    const recipientId = req.user.id;

    if (!notificationId) {
        return res.status(400).json({ message: 'Notification ID is required' });
    }

    try {
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return res.status(404).json({ message: 'Friend request notification not found' });
        }

        if (notification.user.toString() !== recipientId) {
            return res.status(403).json({ message: 'You are not authorized to accept this request' });
        }

        if (notification.type !== 'friend_request') {
             return res.status(400).json({ message: 'This notification is not a friend request' });
        }

        const senderId = notification.sender; 

        const recipient = await User.findById(recipientId);
        const sender = await User.findById(senderId);

        if (!recipient || !sender) {
             await Notification.findByIdAndDelete(notificationId); 
            return res.status(404).json({ message: 'One or both users involved no longer exist' });
        }

        await User.findByIdAndUpdate(recipientId, { $addToSet: { friends: senderId } });
        await User.findByIdAndUpdate(senderId, { $addToSet: { friends: recipientId } });

        await Notification.findByIdAndDelete(notificationId);

        res.status(200).json({ message: 'Friend request accepted successfully' });

    } catch (error) {
        console.error('Accept Friend Request Error:', error);
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Notification ID format' });
        }
        res.status(500).json({ message: 'Server error while accepting friend request' });
    }
};

const getFriends = async (req, res) => {
    const userId = req.user.id; 

    try {
        const user = await User.findById(userId)
                               .populate('friends', 'fullName email');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.friends);

    } catch (error) {
        console.log(error);
        
        console.error('Get Friends Error:', error);
        res.status(500).json({ message: 'Server error while fetching friends list' });
    }
};

const deleteFriend = async (req, res) => {
    const userId = req.user.id; 
    const { friendId } = req.params;

    if (!friendId) {
        return res.status(400).json({ message: 'Friend ID is required in URL parameters' });
    }

    if (userId === friendId) {
        return res.status(400).json({ message: 'You cannot remove yourself as a friend.' });
    }

    if (!mongoose.Types.ObjectId.isValid(friendId)) {
        return res.status(400).json({ message: 'Invalid Friend ID format' });
    }

    try {
        const user = await User.findById(userId);
        const friendToRemove = await User.findById(friendId);

        if (!user) {
            return res.status(404).json({ message: 'Current user not found.' });
        }
        if (!friendToRemove) {
             console.log(`Friend with ID ${friendId} not found, removing from user ${userId}'s list.`);
        }

        const updateCurrentUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { friends: friendId } },
            { new: true } 
        );

        const updateExFriend = await User.findByIdAndUpdate(
            friendId,
            { $pull: { friends: userId } },
            { new: true } 
        );

        console.log(`User ${userId} removed friend ${friendId}.`);
        if (friendToRemove) { 
             console.log(`User ${friendId} removed friend ${userId}.`);
        }


        res.status(200).json({ message: 'Friend removed successfully' });

    } catch (error) {
        console.error('Delete Friend Error:', error);
        res.status(500).json({ message: 'Server error while removing friend' });
    }
};

  

module.exports = { registerUser, loginUser, forgotPassword, verificationEmail, resetPassword, getUserName, getPeopleName, sendingReq, getFriendReq, acceptFriendRequest,getFriends,
    deleteFriend, googleLogin
  };
