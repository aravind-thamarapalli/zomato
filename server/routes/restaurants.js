const express = require('express');
const { getRestaurants, getRestaurantById, getRestaurantsByLocation } = require('../controllers/restaurantController');
const { imageSearchHandler } = require('../controllers/imageSearch');
const router = express.Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.get('/location', getRestaurantsByLocation);
router.get('/image-search', imageSearchHandler);

module.exports = router;
