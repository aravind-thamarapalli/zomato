import React, { useEffect, useState } from "react";
import { fetchRestaurants } from "../api";
import { Link } from "react-router-dom";
import "./RestaurantList.css";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [imageSearchLabels, setImageSearchLabels] = useState([]);
  const restaurantsPerPage = 9;

  useEffect(() => {
    const getRestaurants = async () => {
      const data = await fetchRestaurants();
      setRestaurants(data);
      setFilteredRestaurants(data);
    };

    getRestaurants();
  }, []);

  // Image Upload Handler
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/api.restaurants/img-search", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.labels) {
        setImageSearchLabels(data.labels);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Filtering logic based on search and image labels
  useEffect(() => {
    let filtered = restaurants.filter((r) =>
      r.restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCuisine) {
      filtered = filtered.filter((r) =>
        r.restaurant.cuisines.toLowerCase().includes(selectedCuisine.toLowerCase())
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter((r) =>
        r.restaurant.location.country_id === Number(selectedCountry)
      );
    }

    if (imageSearchLabels.length > 0) {
      filtered = filtered.filter((r) =>
        imageSearchLabels.some((label) =>
          r.restaurant.cuisines.toLowerCase().includes(label.toLowerCase())
        )
      );
    }

    setFilteredRestaurants(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCuisine, selectedCountry, imageSearchLabels, restaurants]);

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

        <select onChange={(e) => setSelectedCountry(e.target.value)} className="filter">
          <option value="">All Countries</option>
          <option value="1">India</option>
          <option value="2">USA</option>
        </select>

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
