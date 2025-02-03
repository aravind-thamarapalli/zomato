import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import csvParser from "csv-parser";
import Restaurant from "./models/Restaurant.js";
import { recognizeFood } from "./utils/foodRecognition.js"; // Import food recognition function

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Load CSV data into MongoDB
// Load CSV data into MongoDB
const loadCSVData = async () => {
  try {
    const restaurants = [];
    fs.createReadStream("./archive/zomato.csv")
      .pipe(csvParser())
      .on("data", (row) => {
        const cuisines = row["Cuisines"] || "Not Available"; // Default value if empty
        restaurants.push({
          restaurantID: row["Restaurant ID"],
          name: row["Restaurant Name"],
          city: row["City"],
          address: row["Address"],
          cuisines: cuisines,  // Assign the non-empty or default value
          rating: row["Aggregate rating"],
          votes: row["Votes"],
          priceRange: row["Price range"],
        });
      })
      .on("end", async () => {
        // Perform upsert operation for each restaurant
        for (let restaurant of restaurants) {
          await Restaurant.updateOne(
            { restaurantID: restaurant.restaurantID },  // Check if it already exists
            { $set: restaurant },  // Update the document if found, else insert
            { upsert: true }  // Enable upsert functionality
          );
        }
        console.log("Data successfully loaded into MongoDB with upsert.");
      });
  } catch (error) {
    console.error("Error loading CSV data:", error);
  }
};


// API Endpoints
app.get("/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ restaurantID: req.params.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.get("/restaurants", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const restaurants = await Restaurant.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Image-based search for food (optional additional feature)
app.post("/search-food", (req, res) => {
  const { imagePath } = req.body; // You can upload an image and extract path here
  const food = recognizeFood(imagePath);  // Recognize food from the image path
  res.json({ food });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Uncomment this to load CSV data when neede
loadCSVData();
