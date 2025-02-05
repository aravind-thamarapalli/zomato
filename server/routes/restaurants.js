const express = require('express');
const { getRestaurants, getRestaurantById, getRestaurantsByLocation } = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', getRestaurants);
router.get('/:restaurantId', getRestaurantById);
router.get('/location', getRestaurantsByLocation);

module.exports = router;
