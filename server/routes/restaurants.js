const express = require("express");
const { getRestaurants, getRestaurantById, getRestaurantsByLocation } = require("../controllers/restaurantController");
const router = express.Router();

router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.get("/location", getRestaurantsByLocation);

module.exports = router;
