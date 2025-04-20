const { ListCollectionsCursor } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    //catergory that the event falls under.
    category: {  
        type: String,
        required: true
    },
    //title of the event.
    title: {
        type: String,
        required: true
    },
    //brief description of the event.
    description: {
        type: String,
        required: true
    },
    //maximum amount of people that can attend the event.
    maxPeople: {
        type: Number,
        required: true
    },
    //where the event will be held.
    location: {
        type: String,
        required: true 
    },
    //time that the event starts.
    startTime: {
        type: Number, 
        required: true
    },
    //time that the event ends.
    endTime: {
        type: Number, 
        required: true
    },
    //variable that stores the current number of people signed up to the event.
    currentPeople: {
        type: Number, 
        default: 0,
    },
    //array that stores the users ids that are signed up to the event.
    usersSignedup: [
       {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       }
    ],
    // ref user
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Events', eventSchema);
