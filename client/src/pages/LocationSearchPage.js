import React, { useState } from "react";
import axios from "../services/api";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    axios.get(`/restaurants/search?query=${query}`).then((response) => {
      setResults(response.data);
    });
  };

  return (
    <div>
      <h2>Search Restaurants</h2>
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((restaurant) => (
          <li key={restaurant.restaurantID}>{restaurant.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
