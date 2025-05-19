const express = require('express');
const router = express.Router();
const {addFavourite, removeFavourite, getFavourites} = require('../controllers/favouriteController');

router.post('/add', addFavourite);
router.post('/remove', removeFavourite);
router.get('/:userId', getFavourites);

module.exports = router;
