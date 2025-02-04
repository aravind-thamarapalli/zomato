import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../services/api";

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    axios.get(`/restaurants/${id}`).then((response) => {
      setRestaurant(response.data);
    });
  }, [id]);

  if (!restaurant) return <h2>Loading...</h2>;

  return (
    <div>
      <h2>{restaurant.name}</h2>
      <p>{restaurant.cuisines}</p>
      <p>{restaurant.address}</p>
      <p>Rating: {restaurant.rating}</p>
    </div>
  );
};

export default RestaurantPage;
