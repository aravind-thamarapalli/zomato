import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // ✅ API base URL

// Fetch all restaurants
export const fetchRestaurants = async () => {
  try {
    console.log("Fetching from:", `${API_BASE_URL}/restaurants`);

    const response = await fetch(`${API_BASE_URL}/restaurants`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2));

    return Array.isArray(data) ? data.flatMap((batch) => batch.restaurants || []) : [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

// Fetch a restaurant by its ID
export const fetchRestaurantById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return null;
  }
};

// Send an image for cuisine detection via Gemini AI API
export const searchCuisineByImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`${API_BASE_URL}/image-search`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to detect cuisine");
    }

    const data = await response.json();
    return data.cuisine || ""; // Return the detected cuisine name
  } catch (error) {
    console.error("Error with image search:", error);
    return "";
  }
};
