import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // Change if needed

export const fetchRestaurants = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/restaurants");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2));

    // ✅ Extract restaurants from all response objects
    const extractedData = Array.isArray(data)
      ? data.flatMap((batch) => batch.restaurants || [])
      : [];

    return extractedData;
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};




export const fetchRestaurantById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return null;
  }
};
