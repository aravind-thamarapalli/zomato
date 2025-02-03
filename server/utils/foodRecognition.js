// utils/foodRecognition.js

// Mock function to simulate food recognition
export const recognizeFood = (imagePath) => {
    // For now, we'll simulate food recognition based on file name
    const foodItems = {
      pizza: "Pizza",
      pasta: "Pasta",
      icecream: "Ice Cream",
      burger: "Burger"
    };
  
    // Extract food name from image file path (for demonstration purposes)
    const foodKey = imagePath.split("/").pop().split(".")[0]; // Get the filename without extension
  
    // Return the recognized food or a default message if not recognized
    return foodItems[foodKey] || "Food not recognized";
  };
  