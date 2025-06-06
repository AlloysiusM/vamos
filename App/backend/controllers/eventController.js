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


// Post create event
const createEvent = async (req, res) => {

    const { category, title, description, maxPeople, location, startTime, endTime, } = req.body;

    let emptyFields = [];

    const usersSignedup = [];
    const currentPeople = 0;

    if (!category) emptyFields.push('category');
    if (!title) emptyFields.push('title');
    if (!description) emptyFields.push('description');
    if (!maxPeople) emptyFields.push('maxPeople');
    if (!location) emptyFields.push('location');
    if (!startTime) emptyFields.push('startTime');
    if (!endTime) emptyFields.push('endTime');

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

const addUser = async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such event' });
    }

    try {
        const event = await Event.findById(id);

        // Prevent duplicate sign-ups
        if (event.usersSignedup.includes(userId)) {
            return res.status(400).json({ error: 'User already signed up' });
        }

        // Check if event is full
        if (event.currentPeople >= event.maxPeople) {
            return res.status(400).json({ error: 'Event Full' });
        }

        // Update event to include the user
        event.currentPeople += 1; // Increase currentPeople count
        event.usersSignedup.push(userId); // Add user to usersSignedUp
        await event.save();

        res.status(200).json(event); // Send back the updated event
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const removeUser = async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such event' });
    }

    try {
        const event = await Event.findById(id);

        // Check if the user is signed up
        if (!event.usersSignedup.includes(userId)) {
            return res.status(400).json({ error: 'User not signed up for this event' });
        }

        // Decrease currentPeople and remove the user from usersSignedUp
        event.currentPeople = Math.max(event.currentPeople - 1, 0); // Ensure it doesn’t go negative
        event.usersSignedup = event.usersSignedup.filter(user => user.toString() !== userId.toString());

        await event.save();

        res.status(200).json({ message: 'Successfully withdrawn from event', event });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getEvents,
    getUserEvents,
    createEvent,
    deleteEvent,
    addUser,
    removeUser
}