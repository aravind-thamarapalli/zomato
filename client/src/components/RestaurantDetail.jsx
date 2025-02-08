import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchRestaurantById } from "../api";
import "./RestaurantDetail.css"; // Import dark theme styles

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRestaurant = async () => {
      const data = await fetchRestaurantById(id);
      setRestaurant(data);
      setLoading(false);
    };

    getRestaurant();
  }, [id]);

  if (loading) return <h2 className="loading-text">Loading...</h2>;
  if (!restaurant) return <h2 className="loading-text">Restaurant not found.</h2>;

  return (
    <div className="restaurant-container">
      {/* 🔹 Background Blur & Banner */}
      <div className="restaurant-banner">
        <img
          src={restaurant.featured_image || "https://source.unsplash.com/1000x600/?restaurant,food"}
          alt={restaurant.name}
          className="restaurant-image"
        />
        <div className="overlay">
          <h1 className="restaurant-name">{restaurant.name}</h1>
        </div>
      </div>

      {/* 🔹 Restaurant Info */}
      <div className="restaurant-info">
        <p><strong>Cuisines:</strong> {restaurant.cuisines}</p>
        <p><strong>Average Cost for Two:</strong> ₹{restaurant.average_cost_for_two}</p>
        
        {/* 🔹 Rating Badge */}
        <div className="rating-container">
          <span className="rating-badge">
            {restaurant.user_rating.aggregate_rating} ⭐
          </span>
          <p>({restaurant.user_rating.votes} votes)</p>
        </div>

        <p><strong>Location:</strong> {restaurant.location.locality_verbose}</p>

        {/* 🔹 Menu Button */}
        {restaurant.menu_url && (
          <a href={restaurant.menu_url} target="_blank" rel="noopener noreferrer" className="menu-button">
            📜 View Menu
          </a>
        )}

        {/* 🔹 Back Button */}
        <button className="back-button" onClick={() => navigate(-1)}>⬅ Back</button>
      </div>
    </div>
  );
};

export default RestaurantDetail;
