const mongoose = require('mongoose');

// add password hashing later

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
    }
}); 

// ensuring user account matches details
userSchema.methods.matchPassword = async function(password) {
    return password === this.password; 
  };

module.exports = mongoose.model('User', userSchema);