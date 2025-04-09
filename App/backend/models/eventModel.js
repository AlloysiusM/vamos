const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    category: {  
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    maxPeople: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true 
    },
    startTime: {
        type: Number, 
        required: true
    },
    endTime: {
        type: Number, 
        required: true
    },
    // ref user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Events', eventSchema);
