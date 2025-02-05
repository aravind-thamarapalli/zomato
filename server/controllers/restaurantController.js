const { getDB } = require('../config/db');
const ObjectId = require('mongodb').ObjectId;

/**
 * Get Restaurants with Filtering and Pagination
 */
const getRestaurants = async (req, res) => {
    try {
        const db = getDB();
        const { page = 1, limit = 10, country, cuisine, avg_spend, name } = req.query;
        const filter = {};

        if (country) filter["restaurant.location.country_id"] = parseInt(country);
        if (cuisine) filter["restaurant.cuisines"] = { $regex: cuisine, $options: 'i' };
        if (avg_spend) filter["restaurant.average_cost_for_two"] = { $lte: parseInt(avg_spend) };
        if (name) filter["restaurant.name"] = { $regex: name, $options: 'i' };

        const restaurants = await db.collection('restaurants')
            .find(filter)
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .toArray();

        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    }
};

/**
 * Get Restaurant by ID
 */
const getRestaurantById = async (req, res) => {
    try {
        const db = getDB();
        const restaurant = await db.collection('restaurants').findOne({ "restaurant.id": req.params.restaurantId });
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurant details', error: error.message });
    }
};

/**
 * Get Restaurants by Location (GeoJSON Query)
 */
const getRestaurantsByLocation = async (req, res) => {
    try {
        const { lat, lon, radius = 3 } = req.query;
        if (!lat || !lon) return res.status(400).json({ message: 'Latitude and Longitude are required' });

        const db = getDB();
        const restaurants = await db.collection('restaurants').find({
            "restaurant.location": {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(lon), parseFloat(lat)]
                    },
                    $maxDistance: radius * 1000 // Convert km to meters
                }
            }
        }).toArray();

        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching restaurants by location', error: error.message });
    }
};

module.exports = { getRestaurants, getRestaurantById, getRestaurantsByLocation };
