import React, { useEffect, useState } from "react";
import { fetchRestaurants, searchCuisineByImage } from "../api";
import { Link } from "react-router-dom";
import "./RestaurantList.css";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [imageCuisine, setImageCuisine] = useState(""); // Cuisine detected from uploaded image
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 9;
  const RADIUS_KM = 30; // Search radius of 3 km

  useEffect(() => {
    const getRestaurants = async () => {
      const data = await fetchRestaurants();
      setRestaurants(data);
      setFilteredRestaurants(data);
    };

    getRestaurants();
  }, []);

  // Handle Image Upload and Cuisine Detection
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const detectedCuisine = await searchCuisineByImage(file);
      setImageCuisine(detectedCuisine || "");
    } catch (error) {
      console.error("Error detecting cuisine:", error);
    }
    setLoading(false);
  };

  // Calculate distance between two coordinates using Haversine formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Get User's Current Location
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not retrieve location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Filtering logic based on search, cuisine, and location
  useEffect(() => {
    let filtered = restaurants.filter((r) =>
      r.restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCuisine) {
      filtered = filtered.filter((r) =>
        r.restaurant.cuisines.toLowerCase().includes(selectedCuisine.toLowerCase())
      );
    }

    if (imageCuisine) {
      filtered = filtered.filter((r) =>
        r.restaurant.cuisines.toLowerCase().includes(imageCuisine.toLowerCase())
      );
    }

    if (latitude && longitude) {
      filtered = filtered.filter((r) => {
        const resLat = r.restaurant.location.latitude;
        const resLon = r.restaurant.location.longitude;
        if (!resLat || !resLon) return false;
        return getDistance(latitude, longitude, resLat, resLon) <= RADIUS_KM;
      });
    }

    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCuisine, imageCuisine, latitude, longitude, restaurants]);

  const indexOfLastRestaurant = currentPage * restaurantsPerPage;
  const indexOfFirstRestaurant = indexOfLastRestaurant - restaurantsPerPage;
  const currentRestaurants = filteredRestaurants.slice(indexOfFirstRestaurant, indexOfLastRestaurant);

  return (
    <div className="container">
      <h2>Restaurants</h2>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      <div className="filters">
        <select onChange={(e) => setSelectedCuisine(e.target.value)} className="filter">
          <option value="">All Cuisines</option>
          <option value="Italian">Italian</option>
          <option value="Indian">Indian</option>
          <option value="Chinese">Chinese</option>
        </select>

        <div className="location-filters">
          <input
            type="number"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="location-input"
          />
          <input
            type="number"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="location-input"
          />
          {/* <button onClick={detectLocation} className="location-btn">📍 Use My Location</button> */}
        </div>

        <div className="image-upload-container">
          <label htmlFor="imageUpload" className="upload-btn">📷 Upload Image</label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden-input"
          />
        </div>
      </div>

      {loading ? (
        <p>Detecting cuisine... ⏳</p>
      ) : (
        imageCuisine && <p>Detected Cuisine: <strong>{imageCuisine}</strong></p>
      )}

      <ul className="restaurant-list">
        {currentRestaurants.length > 0 ? (
          currentRestaurants.map((item) => (
            <li key={item.restaurant.R.res_id} className="restaurant-card">
              <Link to={`/restaurant/${item.restaurant.R.res_id}`}>
                <img src={item.restaurant.thumb} alt={item.restaurant.name} className="restaurant-img" />
                <h3 className="res-name">{item.restaurant.name}</h3>
                <p>{item.restaurant.location.locality_verbose}</p>
                <p><strong>Cuisines:</strong> {item.restaurant.cuisines}</p>
              </Link>
            </li>
          ))
        ) : (
          <p>No restaurants found.</p>
        )}
      </ul>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        <span>Page {currentPage}</span>
        <button disabled={indexOfLastRestaurant >= filteredRestaurants.length} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
};

export default RestaurantList;
