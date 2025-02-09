import axios from "axios";

const API_BASE_URL = "https://zomato-production-3c01.up.railway.app/api"; // ✅ Fixed

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



export const fetchRestaurantById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return null;
  }
};
