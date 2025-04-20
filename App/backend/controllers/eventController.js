const Event = require('../models/eventModel');
const mongoose = require('mongoose');

// get all events
const getEvents = async (req, res) => {
    try {
        // get ever users events (sorted by latest date created)
        const events = await Event.find().sort({ createdAt: -1 }); 
        res.status(200).json(events); 
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
};

// get users own events
const getUserEvents = async (req, res) => {
    try {
        // find users own workouts (sorted by latest date created)
        const workouts = await Workout.find({user: req.user._id}).sort({createdAt: -1});
    } catch(error) {
        res.status(500).json({ message: error.message }); 
    }
}

// get single workout
// ???? 

// Post create event
const createEvent = async (req, res) => {

    const { category, title, description, maxPeople, location, startTime, endTime, currentPeople, usersSignedup } = req.body;

    let emptyFields = [];

    if (!category) emptyFields.push('category');
    if (!title) emptyFields.push('title');
    if (!description) emptyFields.push('description');
    if (!maxPeople) emptyFields.push('maxPeople');
    if (!location) emptyFields.push('location');
    if (!startTime) emptyFields.push('startTime');
    if (!endTime) emptyFields.push('endTime');
    if (!currentPeople) emptyFields.push('currentPeople');
    if (!usersSignedup) emptyFields.push('usersSignedup');


    if (emptyFields.length > 0) {
        return res.status(400).json({ 
            error: 'Please fill in all the fields', 
            emptyFields 
        });
    }

    try {
        const userId = req.user._id;

        const event = await Event.create({ 
            category, 
            title, 
            description, 
            maxPeople, 
            location, 
            startTime, 
            endTime, 
            currentPeople,
            usersSignedup,
            user: userId 
        });
        console.log(startTime);
        console.log(endTime);
        res.status(201).json(event); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEvent = async(req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such event' });
    }

    try {
        const event = await Event.findOneAndDelete({ _id: id, user: req.user._id });

        if(!event) {
            return res.status(400).json({ error: 'No such event' });
        }

        res.status(200).json(event);
    } catch(error) {
        res.status(500).json({ error: 'Server error' });
    }
}

const updateEvent = async(req, res) => {
    
}

module.exports = {
    getEvents,
    getUserEvents,
    createEvent,
    deleteEvent
}
