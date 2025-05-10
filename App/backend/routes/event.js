const express = require('express');
// use express to route to controller funcs
const{
    getEvents,
    getUserEvents,
    createEvent,
    deleteEvent,
    addUser,
    removeUser,
} = require('../controllers/eventController');

const { protect } = require('../middleware/authMiddleWare');

const router = express.Router();

// get all events
router.get('/', protect, getEvents);

// get users own events
router.get('/user', protect, getUserEvents);

// create event
router.post('/', protect, createEvent);

// delete users own events
router.delete('/:id', protect, deleteEvent);

router.patch('/:id', protect, addUser);

router.patch("/:id/withdraw", protect, removeUser);


module.exports = router;