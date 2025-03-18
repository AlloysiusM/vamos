const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

const protect = async (req, res, next) => {
    let token;

    // Check for token in headers
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get the token from the header
            token = req.headers.authorization.split(' ')[1];

            console.log("Token received in middleware:", token);  // Log the token

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log("Decoded token:", decoded);  // Log the decoded token

            // Find the user from the token and attach to req object
            req.user = await User.findById(decoded.id).select('-password');

            return next(); // Pass control to the next middleware/route handler
        } catch (error) {
            console.error(error);  // Log any error for debugging
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // No token provided
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };
