import React, { useState } from 'react';
import { TextField, Button, Grid, CircularProgress, Box } from '@mui/material';
import axios from 'axios';

const LocationSearch = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/restaurants/search?latitude=${latitude}&longitude=${longitude}&radius=${radius}`)
      .then(response => {
        setRestaurants(response.data.restaurants);
        setLoading(false);
      })
      .catch(error => {
        console.error('There was an error fetching the location-based restaurants!', error);
        setLoading(false);
      });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4">Location-based Search</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Latitude"
            fullWidth
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Longitude"
            fullWidth
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Radius (meters)"
            fullWidth
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
          />
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" onClick={handleSearch} sx={{ marginTop: 2 }}>Search</Button>
      
      {loading ? (
        <CircularProgress sx={{ marginTop: 3 }} />
      ) : (
        <Grid container spacing={3} sx={{ marginTop: 3 }}>
          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <Grid item key={restaurant.id} xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Typography variant="h6">{restaurant.name}</Typography>
                  <Typography variant="body2">{restaurant.location}</Typography>
                </Paper>
              </Grid>
            ))
          ) : (
            <Typography>No restaurants found</Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default LocationSearch;
