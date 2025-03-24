const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    fullName: {
        type: String, 
        required: true
    }, 
    email: {
        type: String, 
        required: true,
        unique: true,
        // regex for unquie email. 
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Please fill a valid email address']
    },
    password: {
        type: String, 
        required: true
    },
    resetCode: { type: String, default: null }, // Added resetCode
    resetCodeExpires: { type: Date, default: null }, // Expiry field
}); 

// Hash password, ensuring security
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


// ensuring user account matches details
userSchema.methods.matchPassword = async function(password ) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', userSchema);