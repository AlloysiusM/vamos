const Favourite = require('../models/favourite');

// Add a favourite event for a user
const addFavourite = async (req, res) => {
  const { userId, eventId } = req.body;

  try {
    // Check if already favourited
    const existing = await Favourite.findOne({ user: userId, event: eventId });
    if (existing) {
      return res.status(400).json({ message: 'Event already favourited' });
    }

    const favourite = new Favourite({ user: userId, event: eventId });
    await favourite.save();

    res.status(201).json({ message: 'Favourite added', favourite });
  } catch (error) {
    res.status(500).json({ message: 'Error adding favourite', error });
  }
};

// Remove a favourite
const removeFavourite = async (req, res) => {
  const { userId, eventId } = req.body;

  try {
    const result = await Favourite.findOneAndDelete({ user: userId, event: eventId });
    if (!result) {
      return res.status(404).json({ message: 'Favourite not found' });
    }
    res.json({ message: 'Favourite removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing favourite', error });
  }
};

// Get all favourites for a user
const getFavourites = async (req, res) => {
  const { userId } = req.params;

  try {
    const favourites = await Favourite.find({ user: userId }).populate('event');
    res.json(favourites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favourites', error });
  }
};

module.exports = {
  addFavourite,
  removeFavourite,
  getFavourites
};