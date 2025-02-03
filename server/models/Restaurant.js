import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  restaurantID: { type: String, required: true },
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  cuisines: { type: String, required: false },  // Make it optional
  rating: { type: Number, required: true },
  votes: { type: Number, required: true },
  priceRange: { type: String, required: true }
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
